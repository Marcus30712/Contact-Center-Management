"""Opens the course in a real browser and checks the things unit tests can't:
layout at phone/desktop widths, bad addresses, blocked storage, language
switching, and one full lesson run. Prints failed check names; exit 1 on any.

Usage: python3 scripts/browser_check.py   (run from the project root)
"""
import functools
import http.server
import pathlib
import sys
import tempfile
import threading

from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
REPO = ROOT.parent
HUB = ""  # set by serve()
OUT = ROOT / "scripts" / "out"
LESSONS = ["hiring", "onboarding", "nesting", "coaching", "retention", "career"]
TRACK_KEY = "agent-lifecycle-course:track"
STEPS = {  # steps each track sees, per lesson
    "general": {"hiring": 9, "onboarding": 11, "nesting": 12, "coaching": 12, "retention": 9, "career": 11},
    "tech": {"hiring": 10, "onboarding": 11, "nesting": 12, "coaching": 12, "retention": 9, "career": 11},
}
BLOCK_STORAGE = "Object.defineProperty(window, 'localStorage', { get() { throw new Error('blocked'); } });"

failures = []


def check(name, ok, detail=""):
    if not ok:
        failures.append(f"{name} {detail}".strip())


def serve():
    class Quiet(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *args):
            pass

    # Serve the whole repository under a sub-path, the way GitHub Pages does
    # (/Contact-Center-Management/), so relative links are really exercised.
    web = pathlib.Path(tempfile.mkdtemp())
    (web / "kb").symlink_to(REPO, target_is_directory=True)
    handler = functools.partial(Quiet, directory=str(web))
    server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    global HUB
    HUB = f"http://127.0.0.1:{server.server_address[1]}/kb/"
    return server, HUB + "agent-lifecycle/index.html"


TOUR_DONE = "try { localStorage.setItem('queuecraft:tour', 'done'); } catch (e) {}"


# tour=True: start as a first-time visitor, so the home page shows the tutorial.
# Every other check starts with it seen, so the tutorial never covers the page.
def new_page(browser, errors, width=390, height=780, locale="ko-KR", init=None, scheme="light", tour=False):
    ctx = browser.new_context(viewport={"width": width, "height": height}, locale=locale, color_scheme=scheme)
    ctx.add_init_script(("" if tour else TOUR_DONE + "\n") + (init or ""))
    page = ctx.new_page()
    page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
    page.on("pageerror", lambda e: errors.append(str(e)))
    return page


def open_at(page, base, hash_=""):
    page.goto(base + hash_)
    page.wait_for_selector("#app > *")


def main():
    OUT.mkdir(exist_ok=True)
    server, base = serve()
    errors = []
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path="/usr/bin/google-chrome")

        # (a) no sideways scroll at phone and desktop widths, home and every lesson
        for width in (320, 390, 1280):
            for track in ("general", "tech"):
                page = new_page(browser, errors, width=width, init=f"try {{ localStorage.setItem('{TRACK_KEY}', '{track}'); }} catch (e) {{}}")
                for hash_ in ["#home"] + [f"#{l}-{n}" for l in LESSONS for n in (0, 4)]:
                    open_at(page, base, hash_)
                    overflow = page.evaluate("document.documentElement.scrollWidth - window.innerWidth")
                    check(f"(a) no horizontal scroll {width}px {track} {hash_}", overflow <= 0, f"overflow={overflow}")
                page.context.close()

        page = new_page(browser, errors)

        # (c) unknown lesson -> home
        open_at(page, base, "#nope-3")
        check("(c) bad lesson id shows home", page.locator("[data-stage-list] a").count() == 6)

        # (d) step past the end -> last step
        open_at(page, base, "#hiring-99")
        check("(d) step clamps to last", page.inner_text("[data-counter]") == "9 / 9", page.inner_text("[data-counter]"))

        # (i) full run of lesson 1: steps -> checkpoint -> connection -> home shows done
        open_at(page, base, "#hiring-0")
        for _ in range(STEPS["general"]["hiring"]):
            page.click("[data-next]")
        check("(i) checkpoint opens after last step", page.is_visible("[data-view='checkpoint']"))
        check("(i) three questions on the general track", page.locator("[data-question]").count() == 3)
        page.click("[data-question='hiring-q1'] [data-option='a']")
        check("(i) a wrong answer shows its own feedback", page.locator("[data-question='hiring-q1'] [data-feedback]").inner_text().startswith("지금 넘긴 질문은"))
        page.click("[data-question='hiring-q1'] [data-option='b']")
        check("(i) the right answer shows no wrong-answer feedback", page.locator("[data-question='hiring-q1'] [data-feedback]").count() == 0)
        check("(i) one explanation per answered question", page.locator("[data-explanation]:visible").count() == 1)
        check("(i) connection waits for every question", not page.is_visible("[data-connection]"))
        page.click("[data-question='hiring-general'] [data-option='b']")
        check("(i) connection still waits for the third question", not page.is_visible("[data-connection]"))
        page.click("[data-question='hiring-general-2'] [data-option='c']")
        check("(i) connection card shown", page.is_visible("[data-connection]"))
        page.click("[data-lang='en']")
        page.wait_for_function("document.querySelector('[data-back]')?.textContent.includes('Back')")
        check("(j) checkpoint survives a language switch", page.is_visible("[data-view='checkpoint']") and page.is_visible("[data-connection]"))
        page.click("[data-lang='ko']")
        page.wait_for_function("document.querySelector('[data-back]')?.textContent.includes('이전')")
        page.click("[data-next-lesson]")
        page.wait_for_function("document.querySelector('[data-counter]')?.textContent === '1 / 11'")
        check("(i) next lesson opens", "onboarding-0" in page.url)
        page.click("[data-home]")
        page.wait_for_selector("[data-stage-list]")
        check("(i) finished lesson marked done", "is-done" in (page.get_attribute("[data-stage-list] a[data-stage='hiring']", "class") or ""))
        page.go_back()
        page.wait_for_selector("[data-counter]")
        check("(i) browser back returns to lesson", page.inner_text("[data-counter]") == "1 / 11")

        # (h) language switch keeps the step and survives reload
        open_at(page, base, "#hiring-2")
        page.click("[data-lang='en']")
        page.wait_for_function("document.querySelector('[data-next]')?.textContent.trim() === 'Next'")
        check("(h) step kept after language switch", page.inner_text("[data-counter]") == "3 / 9")
        page.reload()
        page.wait_for_selector("[data-next]")
        check("(h) language kept after reload", page.inner_text("[data-next]").strip() == "Next")
        check("(h) step kept after reload", page.inner_text("[data-counter]") == "3 / 9")

        # (l) track choice survives a reload; (m) switching track keeps the step in range
        page.click("[data-lang='ko']")
        page.wait_for_function("document.querySelector('[data-next]')?.textContent.trim() === '다음'")
        open_at(page, base, "#hiring-6")  # general: the mock-call step (common)
        page.click("[data-track='tech']")
        page.wait_for_function("document.querySelector('[data-counter]')?.textContent.endsWith('/ 10')")
        check("(m) same common step after switching to tech", page.inner_text("[data-counter]") == EXPECT_TECH_COUNTER, page.inner_text("[data-counter]"))
        check("(m) address follows the switch", page.url.endswith("#hiring-6"), page.url)
        page.click("[data-next]")  # tech-only step
        check("(m) badge on a tech-only step", page.inner_text("[data-track-badge]") == "기술지원")
        page.click("[data-track='general']")
        page.wait_for_function("document.querySelector('[data-counter]')?.textContent.endsWith('/ 9')")
        check("(m) tech-only step falls back to the common step before it", page.inner_text("[data-counter]") == "7 / 9", page.inner_text("[data-counter]"))
        page.click("[data-track='tech']")
        page.reload()
        page.wait_for_selector("[data-counter]")
        check("(l) track kept after reload", page.get_attribute("[data-track='tech']", "aria-pressed") == "true")
        open_at(page, base, "#coaching-11")
        page.click("[data-track='general']")
        page.wait_for_function("document.querySelector('[data-track=general]')?.getAttribute('aria-pressed') === 'true'")
        n = int(page.inner_text("[data-counter]").split(" / ")[0])
        check("(m) step stays in range after switching", 1 <= n <= 12, str(n))

        # (o) keyboard focus stays on the toggle that was used
        open_at(page, base, "#hiring-0")
        page.focus("[data-track='tech']")
        page.keyboard.press("Enter")
        page.wait_for_selector("[data-track='tech'][aria-pressed='true']")
        check("(o) focus stays on the track button", page.evaluate("document.activeElement?.getAttribute('data-track')") == "tech")
        page.focus("[data-lang='en']")
        page.keyboard.press("Enter")
        page.wait_for_selector("[data-lang='en'][aria-pressed='true']")
        check("(o) focus stays on the language button", page.evaluate("document.activeElement?.getAttribute('data-lang')") == "en")
        page.click("[data-lang='ko']")
        page.click("[data-track='general']")
        page.wait_for_selector("[data-track='general'][aria-pressed='true']")

        # (n) switching track inside the checkpoint keeps it open and clears answers
        open_at(page, base, "#nesting-11")
        page.click("[data-next]")
        page.click("[data-question='nesting-q1'] [data-option='b']")
        page.click("[data-track='tech']")
        page.wait_for_selector("[data-question='nesting-tech']")
        check("(n) checkpoint stays open after a track switch", page.is_visible("[data-view='checkpoint']"))
        check("(n) answers cleared after a track switch", page.locator(".option.is-correct").count() == 0)
        check("(n) old track question gone", page.locator("[data-question='nesting-general']").count() == 0)
        check("(n) both old track questions gone, both new ones shown", page.locator("[data-question='nesting-general-2']").count() == 0 and page.locator("[data-question='nesting-tech']").count() == 1 and page.locator("[data-question='nesting-tech-2']").count() == 1)
        page.click("[data-track='general']")
        page.context.close()

        # (g) first visit follows the browser language
        page = new_page(browser, errors, locale="ko-KR")
        open_at(page, base)
        check("(g) ko-KR starts in Korean", page.inner_text("h1") == "상담사 라이프사이클", page.inner_text("h1"))
        page.screenshot(path=str(OUT / "home-390.png"), full_page=True)
        page.click("[data-track='tech']")
        open_at(page, base, "#onboarding-9")
        page.wait_for_timeout(500)
        page.screenshot(path=str(OUT / "lesson-390-tech.png"), full_page=True)
        page.context.close()

        page = new_page(browser, errors, locale="en-US")
        open_at(page, base)
        check("(g) en-US also starts in Korean", page.inner_text("h1") == "상담사 라이프사이클", page.inner_text("h1"))
        check("(g) first visit starts on general support", page.get_attribute("[data-track='general']", "aria-pressed") == "true")
        page.click("[data-lang='en']")
        page.wait_for_function("document.querySelector('h1')?.textContent === 'The Agent Lifecycle'")
        page.set_viewport_size({"width": 320, "height": 780})
        bar = page.evaluate("document.querySelector('.topbar').getBoundingClientRect().height")
        check("(p) header takes at most two rows at 320px in English", bar <= 110, f"height={bar}")
        cut = page.evaluate("(() => { const b = document.getElementById('brand'); return b.scrollWidth - b.clientWidth; })()")
        check("(p) course title is not cut off at 320px in English", cut <= 0, f"cut={cut}")
        page.click("[data-lang='ko']")
        bar = page.evaluate("document.querySelector('.topbar').getBoundingClientRect().height")
        check("(p) header takes at most two rows at 320px in Korean", bar <= 110, f"height={bar}")
        cut = page.evaluate("(() => { const b = document.getElementById('brand'); return b.scrollWidth - b.clientWidth; })()")
        check("(p) course title is not cut off at 320px in Korean", cut <= 0, f"cut={cut}")
        page.click("[data-lang='en']")
        page.wait_for_function("document.querySelector('h1')?.textContent === 'The Agent Lifecycle'")
        page.set_viewport_size({"width": 390, "height": 780})
        note_visible = page.is_visible("[data-translation-note]")
        check("(g) English translation note", note_visible == EXPECT_TRANSLATION_NOTE, f"visible={note_visible}")
        for width in (320, 390):
            page.set_viewport_size({"width": width, "height": 780})
            page.evaluate(f"localStorage.setItem('{TRACK_KEY}', 'tech')")
            page.reload()  # the track is read at load
            page.wait_for_selector("[data-track='tech'][aria-pressed='true']")
            for hash_ in ["#home", "#hiring-1", "#hiring-6", "#nesting-5", "#coaching-8", "#career-7"]:
                open_at(page, base, hash_)
                overflow = page.evaluate("document.documentElement.scrollWidth - window.innerWidth")
                check(f"(k) English no horizontal scroll {width}px {hash_}", overflow <= 0, f"overflow={overflow}")
        page.wait_for_timeout(500)
        open_at(page, base, "#coaching-7")
        page.wait_for_timeout(500)
        page.screenshot(path=str(OUT / "lesson-390-en.png"), full_page=True)
        open_at(page, base)
        page.screenshot(path=str(OUT / "home-390-en.png"), full_page=True)
        page.context.close()

        # (e) storage blocked -> still works, in memory
        page = new_page(browser, errors, init=BLOCK_STORAGE)
        open_at(page, base)
        check("(e) home renders with storage blocked", page.locator("[data-stage-list] a").count() == 6)
        page.click("[data-lang='en']")
        page.wait_for_function("document.querySelector('h1')?.textContent === 'The Agent Lifecycle'")
        open_at(page, base, "#career-0")
        check("(e) lesson renders with storage blocked", page.inner_text("[data-counter]") == "1 / 11")
        page.click("[data-track='tech']")
        page.wait_for_function("document.querySelector('[data-track=tech]')?.getAttribute('aria-pressed') === 'true'")
        check("(e) track switch works with storage blocked", page.inner_text("[data-counter]") == "1 / 11")
        page.context.close()

        # (f) desktop + dark screenshots for a human look
        page = new_page(browser, errors, width=1280, height=800)
        open_at(page, base)
        for width in (1280, 900, 640, 390, 320):
            page.set_viewport_size({"width": width, "height": 800})
            for lang in ("ko", "en"):
                page.click(f"[data-lang='{lang}']")
                page.wait_for_selector(f"[data-lang='{lang}'][aria-pressed='true']")
                tall = page.evaluate("Math.max(...[...document.querySelectorAll('.lang-btn')].map((b) => b.getBoundingClientRect().height))")
                check(f"(q) toggle labels stay on one line {width}px {lang}", tall <= 40, f"height={tall}")
        page.click("[data-lang='ko']")
        page.set_viewport_size({"width": 1280, "height": 800})
        page.screenshot(path=str(OUT / "home-1280.png"), full_page=True)
        open_at(page, base, "#career-7")
        page.wait_for_timeout(500)
        page.screenshot(path=str(OUT / "lesson-1280.png"), full_page=True)
        page.context.close()
        page = new_page(browser, errors, scheme="dark")
        open_at(page, base, "#coaching-8")
        page.wait_for_timeout(500)
        page.screenshot(path=str(OUT / "lesson-390-dark.png"), full_page=True)
        page.context.close()

        # ---- Knowledge Base hub, glossary and references ----
        page = new_page(browser, errors)
        page.goto(HUB)
        cards = page.locator("a.card")
        check("(r) hub shows eight topic cards plus the practice card", cards.count() == 9, str(cards.count()))
        for href, title in (("./guide/", "팀장 상황별 길잡이"), ("./agent-lifecycle/", "상담사 라이프사이클"), ("./sop-library/", "SOP 라이브러리"), ("./codex/", "Codex 원페이저"), ("./staffing-calculator/", "인력 산정 실험실"), ("./glossary/", "용어집"), ("./references/", "참고 자료")):
            page.goto(HUB)
            page.click(f"a.card[href='{href}']")
            page.wait_for_selector("#app h1")
            check(f"(r) card opens {href}", page.inner_text("#app h1") == title, page.inner_text("#app h1"))
        for path, link in (("glossary/", "[data-back]"), ("references/", "[data-back]"), ("staffing-calculator/", "[data-back]"), ("agent-lifecycle/", "[data-kb-link]"), ("sop-library/", "[data-kb-link]"), ("codex/", "[data-kb-link]"), ("guide/", "a.brand")):
            page.goto(HUB + path)
            page.wait_for_selector("#app > *")
            page.click(link)
            page.wait_for_selector("a.card")
            check(f"(s) {path} links back to the hub", page.url == HUB, page.url)

        page.goto(HUB + "glossary/#nope")
        page.wait_for_selector("[data-count]")
        check("(t) unknown term address shows the list", page.locator(".is-focus").count() == 0)
        if page.locator("[data-term='aht']").count():
            page.goto(HUB + "glossary/#aht")
            page.wait_for_selector("[data-term='aht'].is-focus")
            check("(t) term address focuses the card", page.locator(".is-focus").count() == 1)
            check("(t) keyboard focus moves to the opened term", page.evaluate("document.activeElement?.getAttribute('data-term')") == "aht")
            page.fill("[data-search]", "shrinkage")
            check("(t) search narrows the list", page.locator("[data-term]").count() == 3, str(page.locator("[data-term]").count()))
            check("(t) search box keeps focus while typing", page.evaluate("document.activeElement?.hasAttribute('data-search')"))
            page.fill("[data-search]", "((")
            check("(t) odd search text shows the empty note", page.is_visible("[data-empty]"))
        for width in (320, 390, 1280):
            page.set_viewport_size({"width": width, "height": 780})
            for lang in ("ko", "en"):
                for path in ("", "glossary/", "references/", "staffing-calculator/", "sop-library/", "sop-library/#coaching-6", "codex/", "codex/#principles", "codex/#teams", "codex/#career", "codex/#daily", "guide/", "privacy/", "settings/"):
                    page.goto(HUB + path)
                    if path:
                        page.wait_for_selector("#app > *")
                        page.click(f"[data-lang='{lang}']")
                        page.wait_for_selector(f"[data-lang='{lang}'][aria-pressed='true']")
                    overflow = page.evaluate("document.documentElement.scrollWidth - window.innerWidth")
                    check(f"(u) no horizontal scroll {width}px {lang} /{path}", overflow <= 0, f"overflow={overflow}")
        page.click("[data-lang='ko']")
        page.set_viewport_size({"width": 390, "height": 780})
        page.goto(HUB + "glossary/")
        page.wait_for_selector("[data-count]")
        page.screenshot(path=str(OUT / "glossary-390.png"), full_page=False)
        page.goto(HUB + "references/")
        page.wait_for_selector("#app h1")
        page.screenshot(path=str(OUT / "references-390.png"), full_page=True)
        check("(x) references show the Codex without a PDF link", "Codex 2.0" in page.inner_text("#app") and page.locator("a[href$='.pdf']").count() == 0)
        page.click("a[data-privacy]")
        page.wait_for_selector("#app h1")
        check("(p6) references link opens the privacy policy", page.inner_text("#app h1") == "개인정보처리방침", page.inner_text("#app h1"))
        page.goto(HUB)
        page.wait_for_selector("a[data-privacy]")
        page.click("a[data-privacy]")
        page.wait_for_selector("#app h1")
        check("(p6) home link opens the privacy policy with eight sections", page.inner_text("#app h1") == "개인정보처리방침" and page.locator("#app h2").count() == 8)
        page.screenshot(path=str(OUT / "privacy-390.png"), full_page=True)
        # (c9) time-share bars: the same share draws the same length, whatever the task title
        for role in ("agent", "sme", "tl", "am", "om"):
            page.goto(HUB + f"codex/#daily-{role}")
            page.wait_for_selector(".cx-share-fill")
            got = page.evaluate("""[...document.querySelectorAll('.cx-task')].map((t) => ({
                pct: Number(t.querySelector('.cx-share-label').textContent.match(/\\d+/)[0]),
                px: t.querySelector('.cx-share-fill').getBoundingClientRect().width,
                track: t.querySelector('.cx-share-track').getBoundingClientRect().width }))""")
            tracks = {round(g["track"]) for g in got}
            ok = len(tracks) == 1 and all(abs(g["px"] - g["track"] * g["pct"] / 100) <= 1 for g in got)
            check(f"(c9) {role} share bars are proportional on one scale", ok, str(got))
        # (s1) settings: five menu items fit at 320px, dark carries to other pages, light goes back
        page.set_viewport_size({"width": 320, "height": 700})
        page.goto(HUB + "settings/")
        page.wait_for_selector("[data-theme-pick]")
        check("(s1) the menu has five items with Settings current", page.locator("nav.appbar a").count() == 5 and page.get_attribute("nav.appbar a[aria-current='page']", "data-item") == "settings")
        widths = page.evaluate("[...document.querySelectorAll('nav.appbar a span')].every((s) => s.scrollWidth <= s.parentElement.clientWidth)")
        check("(s1) menu labels fit at 320px", widths)
        page.set_viewport_size({"width": 390, "height": 780})
        page.click("[data-theme-pick='dark']")
        check("(s1) dark applies at once", page.evaluate("document.documentElement.dataset.theme") == "dark")
        page.screenshot(path=str(OUT / "settings-390-dark.png"), full_page=True)
        page.goto(HUB + "glossary/")
        page.wait_for_selector("#app h1")
        check("(s1) another page opens dark", page.evaluate("document.documentElement.dataset.theme") == "dark" and page.evaluate("getComputedStyle(document.body).backgroundColor") != "rgb(255, 255, 255)")
        page.goto(HUB + "settings/")
        page.wait_for_selector("[data-theme-pick]")
        page.click("[data-theme-pick='system']")
        check("(s1) system clears the choice", not page.evaluate("document.documentElement.hasAttribute('data-theme')") and page.evaluate("localStorage.getItem('queuecraft:theme')") == "system")
        with page.expect_download() as dl:
            page.click("[data-export]")
        check("(s1) export downloads a dated file", dl.value.suggested_filename.startswith("queuecraft-backup-") and dl.value.suggested_filename.endswith(".json"))
        page.screenshot(path=str(OUT / "settings-390.png"), full_page=True)
        first = new_page(browser, errors)
        first.goto(HUB + "settings/")
        first.wait_for_selector("[data-offline]")
        first.wait_for_function("document.querySelector('[data-offline]').textContent === '오프라인 준비 완료'", timeout=15000)
        check("(s2) a first visit turns to ready without reopening", True)
        first.wait_for_function("/v0\\.1\\.0 \\([0-9a-f]{8}\\)/.test(document.querySelector('[data-footer]').textContent)", timeout=8000)
        check("(s2) the footer shows the build", True)
        first.context.close()

        # (w) the language chosen in the course carries over
        page.goto(HUB + "agent-lifecycle/")
        page.wait_for_selector("[data-lang='en']")
        page.click("[data-lang='en']")
        page.goto(HUB + "glossary/")
        page.wait_for_selector("#app h1")
        check("(w) glossary follows the course language", page.inner_text("#app h1") == "Glossary", page.inner_text("#app h1"))
        check("(w) English glossary needs no translation note", not page.is_visible("[data-translation-note]"))
        check("(w) English glossary lists every term", page.locator("[data-term]").count() == 49, str(page.locator("[data-term]").count()))
        page.screenshot(path=str(OUT / "glossary-390-en.png"), full_page=False)
        page.goto(HUB + "references/")
        page.wait_for_selector("#app h1")
        check("(w) references follow the course language", page.inner_text("#app h1") == "References", page.inner_text("#app h1"))
        page.goto(HUB + "staffing-calculator/")
        page.wait_for_selector("#app h1")
        check("(z5) staffing lab follows the course language", page.inner_text("#app h1") == "Staffing Lab", page.inner_text("#app h1"))
        check("(z5) English staffing lab has no Korean", not page.evaluate("/[가-힣]/.test(document.querySelector('#app').textContent)"))
        page.screenshot(path=str(OUT / "staffing-390-en.png"), full_page=True)
        page.context.close()

        # ---- Staffing Lab ----
        page = new_page(browser, errors)
        number = lambda key: page.inner_text(f"[data-result='{key}'] [data-number]")
        def slide(input_id, value):
            page.focus(f"[data-input='{input_id}']")
            page.fill(f"[data-input='{input_id}']", str(value))
        page.goto(HUB + "staffing-calculator/")
        page.wait_for_selector("[data-results]")
        check("(z1) example values show the documented results", (number("serviceLevel"), number("occupancy"), number("seated")) == ("89%", "71%", "14명"), number("serviceLevel"))
        check("(z1) example note is shown", page.is_visible("[data-example-note]"))
        check("(z8) away marks are drawn at full strength", page.evaluate("getComputedStyle(document.querySelector('[data-person=planned]')).opacity") == "1")
        slide("rostered", 19)
        check("(z8) just under target is not shown as the target", number("serviceLevel") == "79%" and page.inner_text("[data-gap]") == "1명 부족", number("serviceLevel"))
        page.wait_for_function("document.querySelector('[data-status]').textContent.includes('79%')")
        slide("rostered", 20)
        page.screenshot(path=str(OUT / "staffing-390.png"), full_page=True)
        slide("rostered", 10); slide("planned", 0); slide("unplanned", 0)
        check("(z2) overload shows the message", page.is_visible("[data-overload]") and number("serviceLevel") == "—", number("serviceLevel"))
        page.screenshot(path=str(OUT / "staffing-390-overload.png"), full_page=True)
        slide("rostered", 20); slide("planned", 20); slide("unplanned", 10)
        check("(z2) overload clears again", not page.is_visible("[data-overload]") and number("serviceLevel") == "89%", number("serviceLevel"))
        page.focus("[data-input='aht']")
        page.keyboard.press("ArrowRight")
        check("(z3) arrow key moves the slider one step", page.inner_text("[data-value='aht']") == "3.5분", page.inner_text("[data-value='aht']"))
        check("(z3) results follow the slider", number("serviceLevel") != "89%", number("serviceLevel"))
        page.evaluate("document.querySelector(\"[data-input='target']\").scrollIntoView()")
        box = page.evaluate("(() => { const r = document.querySelector('[data-summary]').getBoundingClientRect(); return [r.top, r.bottom, r.right - r.left, window.innerWidth]; })()")
        check("(z7) summary stays in view while scrolled to the sliders", box[0] >= 0 and box[1] <= 120 and box[2] <= box[3], str(box))
        check("(z3) slider keeps focus", page.evaluate("document.activeElement?.getAttribute('data-input')") == "aht")
        for input_id, value in (("volume", 300), ("aht", 15), ("rostered", 80), ("planned", 40), ("unplanned", 30), ("target", 120)):
            slide(input_id, value)
        text = page.inner_text("#app")
        check("(z2) extremes show no broken number", "NaN" not in text and "Infinity" not in text and "undefined" not in text)
        overflow = page.evaluate("document.documentElement.scrollWidth - window.innerWidth")
        check("(z4) 80 people fit without sideways scroll", overflow <= 0, f"overflow={overflow}")
        page.goto(HUB + "staffing-calculator/")
        page.wait_for_selector("[data-results]")
        page.click("[data-result='occupancy'] a[data-glossary]")
        page.wait_for_selector("[data-term='occupancy'].is-focus")
        check("(z6) glossary link opens the term", page.url.endswith("glossary/#occupancy"), page.url)
        page.goto(HUB + "references/")
        page.wait_for_selector("[data-lab-link]")
        page.click("[data-lab-link]")
        page.wait_for_selector("[data-results]")
        check("(z6) references link to the lab", page.inner_text("#app h1") == "인력 산정 실험실")
        page.set_viewport_size({"width": 1280, "height": 900})
        check("(z7) summary is hidden on wide screens", not page.is_visible("[data-summary]"))
        page.screenshot(path=str(OUT / "staffing-1280.png"), full_page=True)
        page.set_viewport_size({"width": 320, "height": 640})
        page.click("[data-lang='en']")
        page.evaluate("document.querySelector(\"[data-input='target']\").scrollIntoView()")
        page.screenshot(path=str(OUT / "staffing-320-en-scrolled.png"))
        page.click("[data-lang='ko']")
        page.context.close()
        page = new_page(browser, errors, scheme="dark")
        page.goto(HUB + "staffing-calculator/")
        page.wait_for_selector("[data-results]")
        page.screenshot(path=str(OUT / "staffing-390-dark.png"), full_page=True)
        page.context.close()

        # ---- SOP Library ----
        SOP = HUB + "sop-library/"
        SOP_STEPS = {"escalation": 10, "scrubbing": 11, "coaching": 11, "pip": 11, "calibration": 11, "onboarding": 11, "incident": 11, "nurture": 11, "launch": 10}
        SOP_ANSWERS = {"scrubbing": "bc", "onboarding": "ac", "incident": "ca", "launch": "ac"}  # the rest are "bb"
        LABELS_FIT = """[...document.querySelectorAll('[data-node]:not(.is-hidden)')].every((g) => {
            const r = g.querySelector('rect').getBoundingClientRect();
            const t = g.querySelector('text').getBoundingClientRect();
            return t.left >= r.left - 0.5 && t.right <= r.right + 0.5;
        })"""
        page = new_page(browser, errors)
        page.goto(SOP)
        page.wait_for_selector("[data-sop-list]")
        check("(s1) list shows nine SOPs in two groups", page.locator("[data-sop-list] a[data-sop]").count() == 9 and page.locator("[data-group]").count() == 2)
        page.screenshot(path=str(OUT / "sop-list-390.png"), full_page=True)
        ids = list(SOP_STEPS)
        for i, (sop, steps) in enumerate(SOP_STEPS.items()):
            page.goto(SOP + f"#{sop}-0")
            page.wait_for_selector("[data-counter]")
            check(f"(s1) {sop} starts at 1 / {steps}", page.inner_text("[data-counter]") == f"1 / {steps}", page.inner_text("[data-counter]"))
            check(f"(s1) {sop} is {i + 1} of 9", page.inner_text(".eyebrow") == f"{i + 1} / 9")
            for n in range(steps - 1):
                if n % 2:
                    page.keyboard.press("ArrowRight")
                else:
                    page.click("[data-next]")
            check(f"(s1) {sop} reaches the last step", page.inner_text("[data-counter]") == f"{steps} / {steps}", page.inner_text("[data-counter]"))
            check(f"(s2) {sop} labels fit their boxes (ko)", page.evaluate(LABELS_FIT))
            check(f"(s2) {sop} hides nothing at the end", page.locator("[data-node].is-hidden").count() == 0)
            page.screenshot(path=str(OUT / f"sop-{sop}-390.png"), full_page=True)
            page.click("[data-lang='en']")
            page.wait_for_selector("[data-lang='en'][aria-pressed='true']")
            check(f"(s2) {sop} labels fit their boxes (en)", page.evaluate(LABELS_FIT))
            check(f"(s2) {sop} English has no Korean", not page.evaluate("/[가-힣]/.test(document.querySelector('#app').textContent)"))
            if sop == "coaching":
                page.screenshot(path=str(OUT / "sop-coaching-390-en.png"), full_page=True)
            page.click("[data-lang='ko']")
            page.wait_for_selector("[data-lang='ko'][aria-pressed='true']")
            page.click("[data-next]")
            check(f"(s1) {sop} checkpoint opens", page.is_visible("[data-view='checkpoint']"))
            right1, right2 = SOP_ANSWERS.get(sop, "bb")
            wrong2 = "a" if right2 != "a" else "b"
            page.click(f"[data-question='{sop}-q1'] [data-option='{right1}']")
            check(f"(s1) {sop} first answer is marked correct", page.locator(f"[data-question='{sop}-q1'] .explanation.is-correct").count() == 1)
            check(f"(s1) {sop} connection waits for both answers", not page.is_visible("[data-connection]"))
            page.click(f"[data-question='{sop}-q2'] [data-option='{wrong2}']")
            check(f"(s1) {sop} wrong answer is marked", page.locator(f"[data-question='{sop}-q2'] .explanation.is-wrong").count() == 1)
            check(f"(s1) {sop} wrong answer shows its own feedback", page.locator(f"[data-question='{sop}-q2'] [data-feedback]").count() == 1)
            page.click(f"[data-question='{sop}-q2'] [data-option='{right2}']")
            check(f"(s1) {sop} connection card shown", page.is_visible("[data-connection]"))
            page.click("[data-next-lesson]")
            if i < len(ids) - 1:
                page.wait_for_function(f"location.hash === '#{ids[i + 1]}-0'")
            else:
                page.wait_for_selector("[data-sop-list]")
                check("(s4) the last SOP returns to the list", page.url.endswith("#home"), page.url)
        done = page.locator("[data-sop-list] a.is-done").count()
        check("(s3) all nine SOPs marked done", done == 9, str(done))
        page.goto(HUB + "agent-lifecycle/")
        page.wait_for_selector("[data-stage-list]")
        check("(s3) SOP progress does not mark the lifecycle course", page.locator("[data-stage-list] a.is-done").count() == 0)
        page.evaluate("localStorage.setItem('agent-lifecycle-course:v1', JSON.stringify({completed: ['coaching']}))")
        page.evaluate("localStorage.removeItem('sop-library:v1')")
        page.goto(SOP)
        page.wait_for_selector("[data-sop-list]")
        check("(s3) lifecycle progress does not mark the SOP course", page.locator("[data-sop-list] a.is-done").count() == 0)
        for bad in ("#hiring-0", "#nope"):
            page.goto(SOP + bad)
            page.wait_for_selector("#app > *")
            page.reload()
            page.wait_for_selector("#app > *")
            check(f"(s5) {bad} opens the list", page.locator("[data-sop-list]").count() == 2)
        page.goto(SOP + "#coaching-99")
        page.reload()
        page.wait_for_selector("[data-counter]")
        check("(s5) a step past the end opens the last step", page.inner_text("[data-counter]") == "11 / 11", page.inner_text("[data-counter]"))
        page.goto(SOP + "#pip-3")
        page.reload()
        page.wait_for_selector("[data-persona]")
        check("(s6) PIP badge reads 도윤", page.text_content("[data-persona] text") == "도윤")
        page.goto(HUB + "glossary/#pip")
        page.wait_for_selector("[data-term='pip'] a[data-sop-link]")
        page.click("[data-term='pip'] a[data-sop-link]")
        page.wait_for_selector("[data-counter]")
        check("(s6) glossary PIP card opens the PIP SOP", page.url.endswith("sop-library/#pip-0") and page.inner_text("#app h1") == "성과 개선 계획 (PIP)", page.url)
        page.click("[data-lang='en']")
        page.goto(SOP)
        page.wait_for_selector("[data-sop-list]")
        check("(s6) SOP list follows the shared language", page.inner_text("#app h1") == "SOP Library")
        page.click("[data-lang='ko']")
        page.set_viewport_size({"width": 1280, "height": 900})
        page.screenshot(path=str(OUT / "sop-list-1280.png"), full_page=True)
        page.goto(SOP + "#coaching-6")
        page.reload()
        page.wait_for_selector("[data-counter]")
        page.screenshot(path=str(OUT / "sop-coaching-1280.png"), full_page=True)
        page.context.close()
        page = new_page(browser, errors, scheme="dark")
        page.goto(SOP + "#pip-9")
        page.wait_for_selector("[data-counter]")
        page.screenshot(path=str(OUT / "sop-pip-390-dark.png"), full_page=True)
        page.context.close()

        # ---- Codex one-pagers ----
        CX = HUB + "codex/"
        page = new_page(browser, errors)
        page.goto(CX)
        page.wait_for_selector("a[data-page]")
        check("(c1) list shows four one-pagers", page.locator("a[data-page]").count() == 4)
        page.screenshot(path=str(OUT / "codex-list-390.png"), full_page=True)
        page.click("a[data-page='principles']")
        page.wait_for_selector("[data-expand-all]")
        page.click("[data-expand-all]")
        check("(c2) expand all opens four principles", page.locator("[data-card] [aria-expanded='true']").count() == 4)
        page.screenshot(path=str(OUT / "codex-principles-390.png"), full_page=True)
        page.click("nav[data-pages] a[href='#teams']")
        page.wait_for_selector("[data-card='wfm']")
        check("(c7) moving to another page puts focus on its title", page.evaluate("document.activeElement.tagName") == "H1")
        page.click("[data-card='ta'] button")
        page.click("[data-card='wfm'] button")
        check("(c3) only one team open", page.locator("[data-card] [aria-expanded='true']").count() == 1)
        check("(c3) focus stays on the opened team", page.evaluate("document.activeElement.closest('[data-card]')?.dataset.card") == "wfm")
        page.click("[data-card='wfm'] a[data-glossary='shrinkage']")
        page.wait_for_selector("[data-term='shrinkage'].is-focus")
        check("(c5) KPI glossary link lands on the term", page.url.endswith("glossary/#shrinkage"))
        page.go_back()
        page.wait_for_selector("[data-card='wfm']")
        page.screenshot(path=str(OUT / "codex-teams-390.png"), full_page=True)
        page.goto(CX + "#career")
        page.wait_for_selector("[data-level]")
        page.focus("[data-tab='operation']")
        page.keyboard.press("ArrowRight")
        check("(c4) arrow key moves to the next team", page.get_attribute("[data-tab='td']", "aria-pressed") == "true" and page.evaluate("document.activeElement.dataset.tab") == "td")
        page.keyboard.press("Home")
        page.click("[data-level='om']")
        check("(c4) top level has no next step", page.locator("[data-level-detail] [data-next]").count() == 0)
        page.screenshot(path=str(OUT / "codex-career-390.png"), full_page=True)
        page.goto(CX + "#daily")
        page.wait_for_selector("[data-block]")
        page.click("[data-block='2']")
        check("(c4) a time block highlights its task", page.get_attribute("[data-task-item='1']", "aria-pressed") == "true")
        check("(c7) the choice is announced", "1:1" in page.text_content("#cx-status"))
        check("(c7) the plain list of times shows on phones", page.is_visible("[data-slot='0']"))
        box = page.evaluate("document.querySelector('[data-task-detail]').getBoundingClientRect().top - document.querySelector('[data-day]').getBoundingClientRect().bottom")
        check("(c7) details sit close under the times", box < 700, str(box))
        widths = page.evaluate("[...document.querySelectorAll('[data-day] li')].map((li) => li.getBoundingClientRect().width)")
        check("(c1) day bar blocks are all visible", all(w >= 4 for w in widths), str(widths))
        page.screenshot(path=str(OUT / "codex-daily-390.png"), full_page=True)
        for href in page.evaluate("[...document.querySelectorAll('a[data-related]')].map((a) => a.getAttribute('href'))"):
            page.goto(CX + "#daily")
            page.wait_for_selector("a[data-related]")
            page.click(f"a[data-related='{href}']")
            page.wait_for_selector("#app h1")
            check(f"(c5) related link {href} opens a page", page.locator("#app h1").count() == 1)
        page.goto(CX + "#teams")
        page.wait_for_selector("[data-card='hr']")
        page.click("[data-card='hr'] button")
        page.click("[data-lang='en']")
        page.wait_for_selector("[data-lang='en'][aria-pressed='true']")
        check("(c6) language switch keeps the open team", page.get_attribute("[data-card='hr'] button", "aria-expanded") == "true")
        for pid in ("principles", "teams", "career", "daily"):
            page.goto(CX + f"#{pid}")
            page.wait_for_selector("#app h1")
            page.evaluate("document.querySelectorAll('[data-card] button[aria-expanded=false]').forEach((b) => b.click())")
            check(f"(c6) English {pid} has no Korean", not page.evaluate("/[가-힣]/.test(document.querySelector('#app').textContent)"))
        page.set_viewport_size({"width": 320, "height": 700})
        for pid in ("principles", "teams", "career", "daily"):
            page.goto(CX + f"#{pid}")
            page.wait_for_selector("#app h1")
            page.evaluate("document.querySelectorAll('[data-card] button[aria-expanded=false]').forEach((b) => b.click())")
            over = page.evaluate("document.documentElement.scrollWidth - window.innerWidth")
            check(f"(c3) English {pid} fits 320px with cards open", over <= 0, f"overflow={over}")
        page.screenshot(path=str(OUT / "codex-daily-320-en.png"), full_page=True)
        page.click("[data-lang='ko']")
        for bad in ("#nope", "#teams-3"):
            page.goto(CX + bad)
            page.reload()
            page.wait_for_selector("#app > *")
            check(f"(c6) {bad} opens the list", page.locator("a[data-page]").count() == 4)
        page.set_viewport_size({"width": 1280, "height": 900})
        page.goto(CX + "#daily")
        page.wait_for_selector("[data-block]")
        page.click("[data-task-item='1']")
        check("(c7) the plain list of times is hidden on wide screens", not page.is_visible("[data-slot='0']"))
        page.screenshot(path=str(OUT / "codex-daily-1280.png"), full_page=True)
        page.goto(CX + "#career")
        page.wait_for_selector("[data-level]")
        page.screenshot(path=str(OUT / "codex-career-1280.png"), full_page=True)
        page.context.close()
        page = new_page(browser, errors, scheme="dark")
        page.goto(CX + "#teams")
        page.wait_for_selector("[data-card='operation']")
        page.click("[data-card='operation'] button")
        page.screenshot(path=str(OUT / "codex-teams-390-dark.png"), full_page=True)
        page.context.close()

        # ---- App shell: home, bottom menu, Miso, offline ----
        page = new_page(browser, errors)
        page.goto(HUB)
        page.wait_for_selector("img[data-miso='grin']")
        check("(a1) Miso greets on the home screen", page.evaluate("document.querySelector('img[data-miso=grin]').naturalWidth") > 0)
        check("(a1) a first visit suggests lesson 1", page.is_visible("[data-start]"))
        check("(a1) the start note stands in for my learning on a first visit", page.locator("[data-course]").count() == 0)
        page.screenshot(path=str(OUT / "home-390.png"), full_page=True)
        page.evaluate("localStorage.setItem('agent-lifecycle-course:v1', JSON.stringify({completed: ['hiring']}))")
        page.reload()
        page.wait_for_selector("[data-course='lifecycle']")
        check("(a1) progress shows after a lesson", "1/6" in page.inner_text("[data-course='lifecycle']") and page.get_attribute("a[data-next='lifecycle']", "href") == "./agent-lifecycle/#onboarding-0")
        PAGES = {"": "home", "guide/": "guide", "agent-lifecycle/": "learn", "sop-library/": "learn", "codex/#daily": "browse",
                 "staffing-calculator/": "browse", "glossary/": "browse", "references/": "browse", "privacy/": "browse", "settings/": "settings"}
        for path, item in PAGES.items():
            page.goto(HUB + path)
            page.wait_for_selector("nav.appbar a[aria-current='page']")
            check(f"(a2) {path or 'home'} shows the menu with {item} current", page.get_attribute("nav.appbar a[aria-current='page']", "data-item") == item)
            page.evaluate("window.scrollTo(0, document.documentElement.scrollHeight)")
            gap = page.evaluate("""(() => {
                const bar = document.querySelector('nav.appbar').getBoundingClientRect().top;
                const items = [...document.querySelectorAll('#app *')].filter((el) => el.offsetParent && el.getClientRects().length);
                return bar - Math.max(...items.map((el) => el.getBoundingClientRect().bottom));
            })()""")
            check(f"(a2) {path or 'home'} content ends above the menu", gap >= 0, f"gap={gap}")
        page.goto(HUB + "guide/")
        page.wait_for_selector("nav.appbar")
        page.click("[data-lang='en']")
        page.wait_for_function("document.querySelector('nav.appbar a[data-item=guide] span').textContent === 'Guide'")
        check("(a2) the menu follows the language", True)
        page.click("[data-lang='ko']")
        page.click("nav.appbar a[data-item='learn']")
        page.wait_for_selector("#learn")
        check("(a2) Learn goes to the home screen's learn section", page.url.endswith("/kb/#learn"))
        page.goto(HUB + "agent-lifecycle/#hiring-0")
        page.wait_for_selector("[data-counter]")
        for _ in range(12):
            if page.locator("[data-view='checkpoint']").is_visible():
                break
            page.click("[data-next]")
        for q in page.evaluate("[...document.querySelectorAll('[data-question]')].filter((q) => q.offsetParent).map((q) => q.dataset.question)"):
            answer = page.evaluate(f"document.querySelector('[data-question=\"{q}\"]').dataset.answer || ''")
            for opt in ("a", "b", "c", "d"):
                if page.locator(f"[data-question='{q}'] .explanation.is-correct").count():
                    break
                if page.locator(f"[data-question='{q}'] [data-option='{opt}']").count():
                    page.click(f"[data-question='{q}'] [data-option='{opt}']")
        page.wait_for_selector("[data-connection]:not([hidden]) img[data-miso='proud']")
        check("(a3) Miso congratulates at the end of a lesson", page.evaluate("document.querySelector('img[data-miso=proud]').naturalWidth") > 0)
        page.screenshot(path=str(OUT / "lesson-done-390.png"), full_page=True)
        # Tabbing down a long page never leaves the focused control behind the bottom menu.
        page.goto(HUB + "guide/")
        page.wait_for_selector("[data-card]")
        worst = 999
        for _ in range(40):
            page.keyboard.press("Tab")
            worst = min(worst, page.evaluate("""(() => { const e = document.activeElement;
              if (!e || e.closest('nav.appbar')) return 999;
              return document.querySelector('nav.appbar').getBoundingClientRect().top - e.getBoundingClientRect().bottom; })()"""))
        check(f"(a3) a control reached with Tab stays above the menu (worst gap {worst:.0f}px)", worst >= 0)
        page.context.close()

        page = new_page(browser, errors)
        page.goto(HUB)
        page.wait_for_selector("[data-greeting]")
        page.evaluate("navigator.serviceWorker.ready.then(() => true)")
        page.reload()
        page.wait_for_function("navigator.serviceWorker.controller !== null")
        page.context.set_offline(True)
        for path, ready in (("", "[data-greeting]"), ("guide/", "[data-card]"), ("agent-lifecycle/#coaching-2", "[data-counter]"), ("sop-library/", "a[data-sop]"),
                            ("codex/#teams-ta", "[data-card='ta']"), ("staffing-calculator/", "[data-results]"), ("glossary/#aht", "[data-term='aht']"), ("references/", "#app h1"), ("privacy/", "#app h1"), ("settings/", "[data-theme-pick]"), ("practice/", "#app h1"), ("excel/#lesson-1", "[data-start]")):
            page.goto(HUB + path)
            page.wait_for_selector(ready, timeout=8000)
            check(f"(a4) offline: {path or 'home'} opens", page.locator(ready).count() >= 1)
        check("(a4) offline: Miso still shows", page.goto(HUB) is not None and page.wait_for_selector("img[data-miso='grin']") is not None and page.evaluate("document.querySelector('img[data-miso=grin]').complete && document.querySelector('img[data-miso=grin]').naturalWidth > 0"))
        page.context.set_offline(False)
        page.context.close()

        page = new_page(browser, errors, scheme="dark")
        page.goto(HUB)
        page.wait_for_selector("img[data-miso='grin']")
        page.screenshot(path=str(OUT / "home-390-dark.png"), full_page=True)
        page.context.close()
        page = new_page(browser, errors, width=1280, height=900)
        page.goto(HUB)
        page.wait_for_selector("img[data-miso='grin']")
        page.screenshot(path=str(OUT / "home-1280.png"), full_page=True)
        pad = page.evaluate("getComputedStyle(document.querySelector('.page')).paddingLeft")
        check(f"(a5) wide screens keep 32px side margins ({pad})", pad == "32px")
        page.evaluate("window.scrollTo(0, document.documentElement.scrollHeight)")
        page.wait_for_timeout(200)
        check("(a5) scrolled to the bottom of home, the menu marks Browse", page.get_attribute("nav.appbar [aria-current='page']", "data-item") == "browse")
        page.evaluate("window.scrollTo(0, 0)")
        page.wait_for_timeout(200)
        check("(a5) back at the top, the menu marks Home", page.get_attribute("nav.appbar [aria-current='page']", "data-item") == "home")
        page.context.close()

        # ---- Today's practice ----
        DONE2 = "try { localStorage.setItem('agent-lifecycle-course:v1', JSON.stringify({completed: ['hiring', 'onboarding']})); } catch (e) {}"
        for scheme in ("light", "dark"):
            page = new_page(browser, errors, init=DONE2, scheme=scheme)
            page.goto(HUB + "practice/")
            page.wait_for_selector("[data-question]")
            check(f"(p1) {scheme}: Miso thinks over the first question", page.evaluate("document.querySelector('img[data-miso=think]').complete && document.querySelector('img[data-miso=think]').naturalWidth > 0"))
            check(f"(p1) {scheme}: the menu marks Learn", page.get_attribute("nav.appbar [aria-current='page']", "data-item") == "learn")
            check(f"(p1) {scheme}: no stray 'null' text", "null" not in page.inner_text("#app"))
            page.screenshot(path=str(OUT / f"practice-390{'-dark' if scheme == 'dark' else ''}.png"), full_page=True)
            page.context.close()
        page = new_page(browser, errors, init=DONE2)
        page.goto(HUB + "practice/")
        for _ in range(3):
            page.wait_for_selector("[data-question] [data-option]:not([disabled])")
            page.click("[data-question] [data-option] >> nth=0")
            page.wait_for_selector("img[data-miso='joy'], img[data-miso='worry']")
            page.click("[data-next]")
        page.wait_for_selector("[data-done]")
        check("(p2) three answers finish the day with Miso cheering", page.locator("img[data-miso='cheer']").count() == 1)
        check("(p2) the first badge is announced", "첫걸음" in page.inner_text("[data-badge-new]"))
        page.click("[data-card]")
        page.click("[data-know]")
        check("(p2) a known card leaves today's deck", "4" in page.inner_text("[data-cards-count]"))
        page.evaluate("window.scrollTo(0, document.documentElement.scrollHeight)")
        gap = page.evaluate("document.querySelector('nav.appbar').getBoundingClientRect().top - document.querySelector('[data-badges]').getBoundingClientRect().bottom")
        check(f"(p2) the badge shelf ends above the menu (gap {gap:.0f}px)", gap >= 0)
        page.screenshot(path=str(OUT / "practice-done-390.png"), full_page=True)
        page.goto(HUB)
        page.wait_for_selector("a[data-practice]")
        check("(p3) the home card says today is done", "오늘 연습 완료" in page.inner_text("a[data-practice]"))
        page.context.close()
        page = new_page(browser, errors, width=320, init=DONE2)
        page.goto(HUB + "practice/")
        page.wait_for_selector("[data-question]")
        check("(p4) 320px: no sideways scroll", page.evaluate("document.documentElement.scrollWidth <= window.innerWidth"))
        page.context.close()

        EXCEL4 = "try { localStorage.setItem('excel-practice:v1', JSON.stringify({completed: ['4'], scores: {}})); } catch (e) {}"
        for width in (320, 390):
            page = new_page(browser, errors, width=width, init=EXCEL4)
            page.goto(HUB + "practice/")
            page.wait_for_selector("[data-question]")
            check(f"(p5) {width}px: an Excel question shows the table", page.locator(".ex-sheet td[data-cell='C2']").count() == 1)
            check(f"(p5) {width}px: no sideways scroll with the table", page.evaluate("document.documentElement.scrollWidth <= window.innerWidth"))
            if width == 390:
                page.screenshot(path=str(OUT / "practice-excel-390.png"), full_page=True)
            page.context.close()

        # ---- Miso's Excel practice ----
        page = new_page(browser, errors)
        page.goto(HUB + "excel/")
        page.wait_for_selector("[data-lesson]")
        check("(x1) the list shows 11 lessons", page.locator("ol.ex-list:not(.ex-advanced ol) > [data-lesson]").count() == 11 and page.locator("[data-advanced] [data-lesson]").count() == 5)
        check("(x1) the menu marks Learn", page.get_attribute("nav.appbar [aria-current='page']", "data-item") == "learn")
        page.screenshot(path=str(OUT / "excel-list-390.png"), full_page=True)
        page.click("[data-lesson='1'] a")
        page.wait_for_selector("[data-start]")
        page.click("[data-start]")
        page.wait_for_selector("[data-count]")
        # 1-1, 1-2 choice; 1-3, 1-4 blanks; 1-5, 1-6 cells.
        page.click("[data-option='0']"); page.click("[data-next]")
        page.click("[data-option='0']"); page.click("[data-next]")
        page.click("[data-chip='0']"); page.click("[data-next]")
        page.click("[data-chip='0']"); page.click("[data-next]")
        page.click("td[data-cell='E9']"); page.click("[data-check]")
        check("(x2) tapping E9 answers 1-5", page.locator("img[data-miso='joy']").count() == 1)
        page.click("[data-next]")
        page.click("td[data-cell='C2']"); page.click("td[data-cell='C9']"); page.click("[data-check]")
        check("(x2) tapping C2 then C9 answers 1-6", page.locator("img[data-miso='joy']").count() == 1)
        page.click("[data-next]")
        page.wait_for_selector("[data-done]")
        check("(x2) lesson 1 ends with Miso proud and 6 of 6", "6개 중 6개" in page.inner_text("[data-score]") and page.locator("img[data-miso='proud']").count() == 1)
        page.click("[data-next-lesson]")
        page.wait_for_selector("[data-start]")
        page.click("[data-start]")
        page.click("[data-option='1']")
        check("(x2) a wrong Excel pick shows its own feedback", page.locator("[data-feedback]").inner_text().startswith("AVERAGE는 평균이라"))
        page.click("[data-retry]")
        for _ in range(4):
            page.click("[data-option='0'], [data-chip='0']")
            page.click("[data-next]")
        page.wait_for_selector("[data-bank]")
        for text in ("SUM(", "E2:E9", ")"):
            page.click(f"[data-bank] [data-card]:text-is('{text}')")
        page.click("[data-check]")
        check("(x3) building SUM(E2:E9) shows 118770", "118770" in page.inner_text("[data-result]"))
        check("(x3) the used cells are marked", page.locator("td.is-used").count() == 8)
        gap = page.evaluate("document.querySelector('nav.appbar').getBoundingClientRect().top - document.querySelector('[data-next]').getBoundingClientRect().bottom")
        page.evaluate("document.querySelector('[data-next]').scrollIntoView({block: 'end'})")
        gap = page.evaluate("document.querySelector('nav.appbar').getBoundingClientRect().top - document.querySelector('[data-next]').getBoundingClientRect().bottom")
        check(f"(x3) the next button can sit above the menu (gap {gap:.0f}px)", gap >= -1)
        page.screenshot(path=str(OUT / "excel-build-390.png"), full_page=True)
        page.context.close()
        ALL9 = "try { localStorage.setItem('excel-practice:v1', JSON.stringify({completed: ['1','2','3','4','5','6','7','8','9'], scores: {}})); } catch (e) {}"
        for width, scheme, shot in ((320, "light", None), (390, "dark", "excel-steps-390-dark.png")):
            page = new_page(browser, errors, width=width, init=ALL9, scheme=scheme)
            page.goto(HUB + "excel/#lesson-10")
            page.wait_for_selector("[data-start]")
            page.click("[data-start]")
            for _ in range(4):
                page.click("[data-option='0'], [data-chip='0']")
                page.click("[data-next]")
            page.wait_for_selector("[data-bank]")
            check(f"(x4) {width}px {scheme}: steps question has no sideways scroll", page.evaluate("document.documentElement.scrollWidth <= window.innerWidth"))
            if shot:
                page.screenshot(path=str(OUT / shot), full_page=True)
            page.context.close()
        page = new_page(browser, errors, width=320, init=ALL9)
        page.goto(HUB + "excel/#lesson-2")
        page.wait_for_selector("[data-start]")
        page.click("[data-start]")
        for _ in range(4):
            page.click("[data-option='0'], [data-chip='0']")
            page.click("[data-next]")
        page.wait_for_selector("[data-bank]")
        check("(x4) 320px: build question has no sideways scroll", page.evaluate("document.documentElement.scrollWidth <= window.innerWidth"))
        page.context.close()

        # (fr) a title that gets focus only so screen readers start there draws no ring;
        # things you can press still do
        page = new_page(browser, errors)
        page.goto(HUB + "codex/")
        page.wait_for_selector("a[data-page]")
        page.focus("a[data-page='principles']")
        page.keyboard.press("Enter")
        page.wait_for_function("document.activeElement && document.activeElement.tagName === 'H1'")
        check("(fr) the focused title draws no ring", page.evaluate("getComputedStyle(document.activeElement).outlineStyle") == "none",
              page.evaluate("getComputedStyle(document.activeElement).outline"))
        page.keyboard.press("Tab")
        page.wait_for_timeout(100)
        check("(fr) a button reached by Tab still shows its ring", page.evaluate("document.activeElement.tagName !== 'H1' && getComputedStyle(document.activeElement).outlineStyle !== 'none'"),
              page.evaluate("document.activeElement.outerHTML.slice(0, 80)"))
        page.context.close()

        # ---- Situation guide ----
        GD = HUB + "guide/"
        page = new_page(browser, errors)
        page.goto(HUB)
        check("(g1) the practice card, then the guide, lead the hub", page.get_attribute("a.card >> nth=0", "href") == "./practice/" and page.get_attribute("a.card >> nth=1", "href") == "./guide/")
        page.goto(GD)
        page.wait_for_selector("[data-card]")
        check("(g1) seventeen situations", page.locator("[data-card]").count() == 17)
        page.focus("[data-tab='all']")
        page.keyboard.press("ArrowRight")
        page.keyboard.press("ArrowRight")
        check("(g2) arrow keys pick a group", page.get_attribute("[data-tab='newcomer']", "aria-pressed") == "true" and page.locator("[data-card]:visible").count() == 3)
        page.focus("[data-tab='org']")
        page.keyboard.press("Tab")
        check("(g2) Tab skips hidden groups and lands on the first visible situation", page.evaluate("document.activeElement.closest('[data-card]')?.dataset.card") == "s6")
        page.screenshot(path=str(OUT / "guide-390.png"), full_page=True)
        page.click("[data-tab='all']")
        links = page.evaluate("(() => { document.querySelectorAll('[data-card] button[aria-expanded=false]').forEach((b) => b.click()); return [...document.querySelectorAll('a[data-go]')].map((a) => a.getAttribute('href')); })()")
        check("(g3) thirty-four links", len(links) == 34, str(len(links)))
        DEEP = {"#teams-ta": "[data-card='ta'] [aria-expanded='true']", "#teams-td": "[data-card='td'] [aria-expanded='true']",
                "#teams-wfm": "[data-card='wfm'] [aria-expanded='true']", "#principles-p1": "[data-card='p1'] [aria-expanded='true']",
                "#principles-p3": "[data-card='p3'] [aria-expanded='true']", "#daily-tl": "[data-tab='tl'][aria-pressed='true']"}
        for href in sorted(set(links)):
            page.goto(GD + href)
            page.wait_for_selector("h1")
            if "#" in href:
                page.reload()
                page.wait_for_selector("h1")
            check(f"(g3) {href} opens a page", page.locator("h1").count() >= 1 and page.locator("a[data-page], [data-counter], [data-term].is-focus, #app h1").count() >= 1, page.url)
            hashpart = href[href.find("#"):] if "#" in href else ""
            if hashpart in DEEP and "codex/" in href:
                check(f"(g3) {href} opens the named item", page.locator(DEEP[hashpart]).count() == 1)
        page.goto(GD)
        page.wait_for_selector("[data-card]")
        page.click("[data-card='s13'] button")
        page.click("[data-lang='en']")
        page.wait_for_selector("[data-lang='en'][aria-pressed='true']")
        check("(g4) language switch keeps the open card", page.get_attribute("[data-card='s13'] button", "aria-expanded") == "true")
        page.set_viewport_size({"width": 320, "height": 700})
        page.evaluate("document.querySelectorAll('[data-card] button[aria-expanded=false]').forEach((b) => b.click())")
        over = page.evaluate("document.documentElement.scrollWidth - window.innerWidth")
        check("(g4) English guide fits 320px with every card open", over <= 0, f"overflow={over}")
        page.screenshot(path=str(OUT / "guide-320-en.png"), full_page=True)
        page.click("[data-lang='ko']")
        page.set_viewport_size({"width": 1280, "height": 900})
        page.screenshot(path=str(OUT / "guide-1280.png"), full_page=False)
        # (g5) the lesson a guide situation opened ends with that situation's "then go here"
        page.set_viewport_size({"width": 390, "height": 780})
        page.goto(GD)
        page.wait_for_selector("[data-card]")
        page.click("[data-card='s1'] button")
        page.click("[data-card='s1'] a[data-go='first']")
        page.wait_for_selector("[data-counter]")
        check("(g5) the first link carries the situation", "?guide=s1#coaching-0" in page.url, page.url)
        for _ in range(20):
            if page.is_visible("[data-view='checkpoint']"):
                break
            page.click("[data-next]")
        r1, r2 = SOP_ANSWERS.get("coaching", "bb")
        page.click(f"[data-question='coaching-q1'] [data-option='{r1}']")
        page.click(f"[data-question='coaching-q2'] [data-option='{r2}']")
        page.wait_for_selector("[data-connection]:not([hidden]) a[data-guide-then]")
        check("(g5) the end card names the situation", "길잡이에서 고른 상황 ·" in page.inner_text("[data-connection]"))
        check("(g5) 'then go here' is the primary button, the next SOP comes after it",
              page.evaluate("(() => { const t = document.querySelector('a[data-guide-then]'), n = document.querySelector('[data-next-lesson]'); return t.classList.contains('primary') && !n.classList.contains('primary') && !!(t.compareDocumentPosition(n) & 4); })()"))
        page.locator("[data-connection]").scroll_into_view_if_needed()
        page.screenshot(path=str(OUT / "guide-then-390.png"), full_page=False)
        page.click("a[data-guide-then]")
        page.wait_for_selector("[data-counter]")
        check("(g5) it opens the guide's next place", page.url.endswith("agent-lifecycle/#coaching-0"), page.url)
        page.goto(HUB + "sop-library/#coaching-0")
        page.wait_for_selector("[data-counter]")
        check("(g5) a lesson opened without the guide has no guide button", page.locator("a[data-guide-then]").count() == 0)
        # (g6) the usual "up next" text gives way to the guide; ?guide stays only on its own lesson
        page.goto(HUB + "sop-library/?guide=s1#coaching-0")
        page.wait_for_selector("[data-counter]")
        for _ in range(20):
            if page.is_visible("[data-view='checkpoint']"):
                break
            page.click("[data-next]")
        page.click(f"[data-question='coaching-q1'] [data-option='{r1}']")
        page.click(f"[data-question='coaching-q2'] [data-option='{r2}']")
        page.wait_for_selector("[data-connection]:not([hidden]) a[data-guide-then]")
        check("(g6) the usual next-lesson text is hidden", "성과 개선 계획(PIP)" not in page.inner_text("[data-connection]"))
        check("(g6) the arrow stays with the last word", page.inner_text("a[data-guide-then]").endswith("\u00a0→") or page.evaluate("document.querySelector('a[data-guide-then]').textContent.endsWith('\\u00a0→')"))
        page.click("[data-next-lesson]")
        page.wait_for_function("location.hash === '#pip-0'")
        check("(g6) moving on drops ?guide from the address", "guide=" not in page.url, page.url)
        page.goto(HUB + "sop-library/?guide=s1#home")
        page.wait_for_selector("a[data-sop]")
        check("(g6) the list drops ?guide too", "guide=" not in page.url, page.url)
        page.context.close()

        # (v) storage blocked
        page = new_page(browser, errors, init=BLOCK_STORAGE)
        for path, ko, en in (("glossary/", "용어집", "Glossary"), ("references/", "참고 자료", "References"), ("staffing-calculator/", "인력 산정 실험실", "Staffing Lab"), ("sop-library/", "SOP 라이브러리", "SOP Library"), ("codex/", "Codex 원페이저", "Codex One-Pagers"), ("guide/", "팀장 상황별 길잡이", "Team Lead Situation Guide")):
            page.goto(HUB + path)
            page.wait_for_selector("#app h1")
            check(f"(v) {path} opens in Korean with storage blocked", page.inner_text("#app h1") == ko)
            page.click("[data-lang='en']")
            page.wait_for_function(f"document.querySelector('#app h1')?.textContent === '{en}'")
        page.context.close()

        # (z) Excel advanced lessons: the section, and a 22-card build on small screens
        BASIC11 = '["1","2","3","4","5","6","7","8","9","10","11"]'
        for width in (320, 390):
            page = new_page(browser, errors, width=width, init="try { localStorage.setItem('excel-practice:v1', '{\"completed\":" + BASIC11.replace('"', '\\"') + ",\"scores\":{}}'); } catch (e) {}")
            page.goto(HUB + "excel/")
            page.wait_for_selector("[data-advanced]")
            check(f"(z) {width}: five advanced lessons, all open", page.locator("[data-advanced] [data-lesson] a:not(.ex-go)").count() == 5)
            check(f"(z) {width}: Continue points at lesson 12", page.get_attribute("[data-advanced] .ex-go", "href") == "#lesson-12")
            page.goto(HUB + "excel/#lesson-16")
            page.wait_for_selector("[data-start]")
            page.click("[data-start]")
            qs = page.evaluate("import('../excel/advanced.js').then((m) => m.EXCEL_ADVANCED[4].questions.map((q) => ({ t: q.type, a: q.answer, c: q.cards ? q.cards.ko : null })))")
            for q in qs[:5]:
                if q["t"] == "choice":
                    page.click(f"[data-option='{q['a']}']")
                elif q["t"] == "blank":
                    page.click(f"[data-chip='{q['a']}']")
                elif q["t"] == "build":
                    for card in q["c"]:
                        page.evaluate("(w) => [...document.querySelectorAll('[data-bank] [data-card]')].find((b) => b.textContent === w && !b.disabled).click()", card)
                    page.click("[data-check]")
                page.click("[data-next]")
            box = page.evaluate("""() => { const r = [...document.querySelectorAll('[data-bank] [data-card]')].map((b) => b.getBoundingClientRect());
                return { n: r.length, out: r.filter((x) => x.left < 0 || x.right > innerWidth).length, w: document.documentElement.scrollWidth, iw: innerWidth }; }""")
            check(f"(z) {width}: all 22 cards on screen", box["n"] == 22 and box["out"] == 0 and box["w"] <= box["iw"], str(box))
            # Place every answer card, scroll to the bottom: the formula line stays in view.
            for card in qs[5]["c"]:
                page.evaluate("(w) => [...document.querySelectorAll('[data-bank] [data-card]')].find((b) => b.textContent === w && !b.disabled).click()", card)
            page.evaluate("window.scrollTo(0, document.documentElement.scrollHeight)")
            page.wait_for_timeout(200)
            line = page.evaluate("(() => { const r = document.querySelector('[data-line]').getBoundingClientRect(); return { t: r.top, b: r.bottom, h: innerHeight }; })()")
            check(f"(z) {width}: the formula line stays in view while scrolling", line["t"] >= 0 and line["t"] < line["h"] / 2, str(line))
            page.screenshot(path=str(OUT / f"excel-advanced-16-6-{width}.png"))
            page.context.close()

        # (y) Settings: Reset learning
        # Seed once per tab: an init script runs on every page load.
        page = new_page(browser, errors, init="try { if (!sessionStorage.getItem('seeded')) { sessionStorage.setItem('seeded', '1'); localStorage.setItem('sop-library:v1', '{\"completed\":[\"escalation\"]}'); localStorage.setItem('queuecraft:theme', 'dark'); } } catch (e) {}")
        page.goto(HUB + "settings/")
        page.wait_for_selector("[data-reset]")
        page.click("[data-reset]")
        page.wait_for_selector("[data-reset-confirm]")
        check("(y) Reset asks first with the focus on Cancel", page.evaluate("document.activeElement?.hasAttribute('data-reset-cancel')"))
        page.screenshot(path=str(OUT / "settings-reset-dark.png"))
        page.keyboard.press("Enter")
        check("(y) Cancel keeps the records", page.evaluate("localStorage.getItem('sop-library:v1')") is not None and page.locator("[data-reset-confirm]").count() == 0)
        page.click("[data-reset]")
        page.click("[data-reset-go]")
        check("(y) Erase clears the learning records only", page.evaluate("localStorage.getItem('sop-library:v1') === null && localStorage.getItem('queuecraft:theme') === 'dark'"))
        page.goto(HUB)
        page.wait_for_selector("[data-start]")
        check("(y) home starts over after a reset", page.locator("[data-course]").count() == 0)
        page.context.close()

        # (x) Settings: the "Add to Home Screen" sheet and the tutorial section
        for width, height, scheme in ((320, 568, "light"), (390, 780, "light"), (390, 780, "dark")):
            page = new_page(browser, errors, width=width, height=height, scheme=scheme)
            page.goto(HUB + "settings/")
            page.wait_for_selector("[data-install-open]")
            heads = page.eval_on_selector_all("#app h2", "els => els.map(e => e.textContent)")
            check(f"(x) {width}: tutorial is its own section after Language", heads[:2] == ["언어", "튜토리얼"], str(heads))
            page.click("[data-install-open]")
            page.wait_for_selector("[data-install-sheet] [role=dialog]")
            page.wait_for_timeout(350)
            box = page.evaluate("""() => { const d = document.querySelector('[data-install-sheet] [role=dialog]').getBoundingClientRect();
                const ok = document.querySelector('[data-install-ok]').getBoundingClientRect();
                return { l: d.left, r: d.right, t: d.top, b: d.bottom, okT: ok.top, okB: ok.bottom, w: innerWidth, h: innerHeight }; }""")
            check(f"(x) {width}x{height} {scheme}: sheet on screen", box["l"] >= 0 and box["r"] <= box["w"] and box["t"] >= 0 and box["b"] <= box["h"], str(box))
            check(f"(x) {width}x{height} {scheme}: Got it is visible", box["okT"] >= box["t"] and box["okB"] <= box["b"], str(box))
            if scheme == "dark":
                page.screenshot(path=str(OUT / "install-sheet-dark.png"))
            elif width == 390:
                page.screenshot(path=str(OUT / "install-sheet-390.png"))
                page.click("[role=tab][data-p=android]")
                check("(x) Android tab shows the Android steps", page.is_visible("#ins-android") and not page.is_visible("#ins-ios"))
                page.screenshot(path=str(OUT / "install-sheet-android-390.png"))
                page.focus("[data-install-ok]")
                inside = True
                for _ in range(6):
                    page.keyboard.press("Tab")
                    inside = inside and page.evaluate("!document.activeElement || document.activeElement === document.body || !!document.activeElement.closest('[data-install-sheet]')")
                check("(x) Tab never reaches the page behind the sheet", inside)
                page.keyboard.press("Escape")
                check("(x) Esc closes the sheet", page.locator("[data-install-sheet]").count() == 0)
                check("(x) focus returns to the button", page.evaluate("document.activeElement?.hasAttribute('data-install-open')"))
                page.click("[data-tour-replay]")
                page.wait_for_selector("[data-tour] [role=dialog]")
                check("(x) tutorial View opens the tour at 1/5", page.inner_text("[data-tour-count]") == "1/5")
            page.context.close()

        # (w) first-run tutorial on the bottom menu
        BUBBLE = """() => { const b = document.querySelector('[data-tour] [role=dialog]').getBoundingClientRect();
            const nav = document.querySelector('nav.appbar').getBoundingClientRect();
            return { left: b.left, right: b.right, bottom: b.bottom, navTop: nav.top, w: innerWidth,
                     lit: document.querySelector('nav.appbar a.tour-lit')?.dataset.item }; }"""
        for width in (320, 390, 1280):
            page = new_page(browser, errors, width=width, height=780, tour=True)
            page.goto(HUB)
            page.wait_for_selector("[data-tour] [role=dialog]")
            page.wait_for_timeout(300)
            check(f"(w) {width}: tutorial starts at 1/5", page.inner_text("[data-tour-count]") == "1/5")
            box = page.evaluate(BUBBLE)
            check(f"(w) {width}: bubble on screen", box["left"] >= 0 and box["right"] <= box["w"], str(box))
            check(f"(w) {width}: bubble above the menu", box["bottom"] <= box["navTop"], str(box))
            check(f"(w) {width}: Home is lit", box["lit"] == "home", str(box))
            check(f"(w) {width}: the page stays at the top", page.evaluate("scrollY") == 0, str(page.evaluate("scrollY")))
            if width == 390:
                page.screenshot(path=str(OUT / "tour-390.png"))
                order = ["home"]
                for _ in range(4):
                    page.click("[data-tour-next]")
                    page.wait_for_timeout(250)
                    b = page.evaluate(BUBBLE)
                    order.append(b["lit"])
                    check(f"(w) 390: bubble on screen and above the menu at {b['lit']}", b["left"] >= 0 and b["right"] <= b["w"] and b["bottom"] <= b["navTop"], str(b))
                check("(w) the five items in order", order == ["home", "learn", "guide", "browse", "settings"], str(order))
                check("(w) last button says 시작하기", page.inner_text("[data-tour-next]") == "시작하기")
                page.click("[data-tour-next]")
                check("(w) Get started closes it", page.locator("[data-tour]").count() == 0)
                check("(w) seen is remembered", page.evaluate("localStorage.getItem('queuecraft:tour')") == "done")
                page.reload()
                page.wait_for_selector("#app > *")
                page.wait_for_timeout(400)
                check("(w) not shown again after reload", page.locator("[data-tour]").count() == 0)
                # Replay from Settings: shown again, and the address loses ?tour=1.
                page.goto(HUB + "settings/")
                page.click("[data-tour-replay]")
                page.wait_for_selector("[data-tour] [role=dialog]")
                check("(w) replay starts at 1/5", page.inner_text("[data-tour-count]") == "1/5")
                check("(w) replay clears tour= from the address", "tour=" not in page.url, page.url)
                page.click("[data-tour-skip]")
                page.reload()
                page.wait_for_selector("#app > *")
                page.wait_for_timeout(400)
                check("(w) not shown again after replay and reload", page.locator("[data-tour]").count() == 0)
            page.context.close()
        page = new_page(browser, errors, tour=True)
        page.goto(HUB)
        page.wait_for_selector("[data-tour] [role=dialog]")
        page.mouse.click(200, 100)
        page.keyboard.press("Shift+Tab")
        check("(w) after a tap on the dimmed page, Tab stays in the bubble", page.evaluate("document.querySelector('[role=dialog]').contains(document.activeElement)"))
        page.keyboard.press("Escape")
        check("(w) Esc closes the tutorial", page.locator("[data-tour]").count() == 0)
        page.context.close()
        page = new_page(browser, errors, tour=True, init=BLOCK_STORAGE)
        page.goto(HUB)
        page.wait_for_selector("#app > *")
        page.wait_for_timeout(500)
        check("(w) storage blocked: the tutorial is not forced on every visit", page.locator("[data-tour]").count() == 0)
        page.goto(HUB + "?tour=1")
        page.wait_for_selector("[data-tour] [role=dialog]")
        page.click("[data-tour-skip]")
        check("(w) storage blocked: replay still opens and closes", page.locator("[data-tour]").count() == 0)
        page.context.close()
        page = new_page(browser, errors, tour=True, locale="en-US", init="try { localStorage.setItem('agent-lifecycle-course:lang', 'en'); } catch (e) {}")
        page.goto(HUB)
        page.wait_for_selector("[data-tour] [role=dialog]")
        check("(w) English tutorial", page.inner_text("[data-tour-skip]") == "Skip" and page.inner_text("[data-tour-next]") == "Next")
        page.context.close()

        browser.close()
    server.shutdown()

    # (b) no console errors anywhere
    check("(b) no console errors", not errors, "; ".join(errors[:3]))

    if failures:
        print("FAILED:")
        for f in failures:
            print(" -", f)
        sys.exit(1)
    print("ALL CHECKS PASSED")


# English is fully translated, so no fallback note is expected. If English
# text goes missing, the note appears and this check fails.
EXPECT_TRANSLATION_NOTE = False
EXPECT_TECH_COUNTER = "7 / 10"

if __name__ == "__main__":
    main()
