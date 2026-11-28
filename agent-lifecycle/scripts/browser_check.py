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
# The role question (2026-11-25) is answered unless a check asks for it.
ROLE_ASKED = "try { if (!localStorage.getItem('queuecraft:role')) localStorage.setItem('queuecraft:role-asked', '1'); } catch (e) {}"


# tour=True: start as a first-time visitor, so the home page shows the tutorial.
# Every other check starts with it seen, so the tutorial never covers the page.
# Pages open as if reached from inside the app, so the start screen (shown only
# when the app is opened at home) stays out of the way; start=True opens fresh.
IN_APP = "Object.defineProperty(Document.prototype, 'referrer', { get() { return location.origin + '/'; } });"


def new_page(browser, errors, width=390, height=780, locale="ko-KR", init=None, scheme="light", tour=False, start=False, role=False):
    ctx = browser.new_context(viewport={"width": width, "height": height}, locale=locale, color_scheme=scheme)
    ctx.add_init_script(("" if tour else TOUR_DONE + "\n") + ("" if start else IN_APP + "\n") + ("" if role else ROLE_ASKED + "\n") + (init or ""))
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
        check("(r) a team lead's home shows practice, guide and five Learn cards", cards.count() == 7, str(cards.count()))
        for href, title in (("./guide/", "팀장 상황별 길잡이"), ("./tl/", "팀장 첫걸음"), ("./agent-lifecycle/", "상담사 라이프사이클"), ("./tl-support/", "팀장 서포트 라이프사이클"), ("./sop-library/", "팀장 SOP 라이브러리"), ("../codex/", "Codex 원페이저"), ("../staffing-calculator/", "인력 산정 실험실"), ("../glossary/", "용어집"), ("../references/", "참고 자료")):
            page.goto(HUB if href.startswith("./") else HUB + "browse/")
            page.click(f"a.card[href='{href}']")
            page.wait_for_selector("#app h1")
            check(f"(r) card opens {href}", page.inner_text("#app h1") == title, page.inner_text("#app h1"))
        for path, link in (("glossary/", "[data-back]"), ("references/", "[data-back]"), ("staffing-calculator/", "[data-back]"), ("agent-lifecycle/", "[data-kb-link]"), ("sop-library/", "[data-kb-link]"), ("codex/", "[data-kb-link]")):
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
                for path in ("", "glossary/", "references/", "staffing-calculator/", "sop-library/", "sop-library/#coaching-6", "sme/", "sme/#peer-3", "sme-lifecycle/", "sme-lifecycle/#senior-3", "sme-sop/", "sme-sop/#voc-3", "sme-guide/", "tl/", "tl/#listen-3", "tl-support/", "tl-support/#qa-3", "agent/", "agent/#golive-3", "agent-career/", "agent-career/#tl-3", "agent-sop/", "agent-sop/#outage-3", "agent-guide/", "am/", "am/#cover-4", "am-sop/", "am-sop/#cover-3", "review/", "browse/", "codex/", "codex/#principles", "codex/#teams", "codex/#career", "codex/#daily", "guide/", "privacy/", "settings/"):
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
        SOP_STEPS = {"escalation": 10, "scrubbing": 11, "coaching": 12, "pip": 11, "calibration": 11, "transition": 10, "onboarding": 11, "incident": 11, "nurture": 11, "launch": 10}
        SOP_ANSWERS = {"scrubbing": "bc", "onboarding": "ac", "incident": "ca", "launch": "ac"}  # the rest are "bb"
        LABELS_FIT = """[...document.querySelectorAll('[data-node]:not(.is-hidden)')].every((g) => {
            const r = g.querySelector('rect').getBoundingClientRect();
            const t = g.querySelector('text').getBoundingClientRect();
            return t.left >= r.left - 0.5 && t.right <= r.right + 0.5;
        })"""
        page = new_page(browser, errors)
        page.goto(SOP)
        page.wait_for_selector("[data-sop-list]")
        check("(s1) list shows ten SOPs in two groups", page.locator("[data-sop-list] a[data-sop]").count() == 10 and page.locator("[data-group]").count() == 2)
        page.screenshot(path=str(OUT / "sop-list-390.png"), full_page=True)
        ids = list(SOP_STEPS)
        for i, (sop, steps) in enumerate(SOP_STEPS.items()):
            page.goto(SOP + f"#{sop}-0")
            page.wait_for_selector("[data-counter]")
            check(f"(s1) {sop} starts at 1 / {steps}", page.inner_text("[data-counter]") == f"1 / {steps}", page.inner_text("[data-counter]"))
            check(f"(s1) {sop} is {i + 1} of 10", page.inner_text(".eyebrow") == f"{i + 1} / 10")
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
            if page.locator(f"[data-question='{sop}-q3']").count():
                check(f"(s1) {sop} waits for the third answer", not page.is_visible("[data-connection]"))
                page.click(f"[data-question='{sop}-q3'] [data-option='b']")
            check(f"(s1) {sop} connection card shown", page.is_visible("[data-connection]"))
            page.click("[data-next-lesson]")
            if i < len(ids) - 1:
                page.wait_for_function(f"location.hash === '#{ids[i + 1]}-0'")
            else:
                page.wait_for_selector("[data-sop-list]")
                check("(s4) the last SOP returns to the list", page.url.endswith("#home"), page.url)
        done = page.locator("[data-sop-list] a.is-done").count()
        check("(s3) all ten SOPs marked done", done == 10, str(done))
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
        check("(s5) a step past the end opens the last step", page.inner_text("[data-counter]") == "12 / 12", page.inner_text("[data-counter]"))
        page.goto(SOP + "#pip-3")
        page.reload()
        page.wait_for_selector("[data-persona]")
        check("(s6) PIP badge reads 우진", page.text_content("[data-persona] text") == "우진")
        page.goto(HUB + "glossary/#pip")
        page.wait_for_selector("[data-term='pip'] a[data-sop-link]")
        page.click("[data-term='pip'] a[data-sop-link]")
        page.wait_for_selector("[data-counter]")
        check("(s6) glossary PIP card opens the PIP SOP", page.url.endswith("sop-library/#pip-0") and page.inner_text("#app h1") == "성과 개선 계획 (PIP)", page.url)
        page.click("[data-lang='en']")
        page.goto(SOP)
        page.wait_for_selector("[data-sop-list]")
        check("(s6) SOP list follows the shared language", page.inner_text("#app h1") == "TL SOP Library")
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
        PAGES = {"": "home", "guide/": "guide", "sme-guide/": "guide", "agent-guide/": "guide", "agent-lifecycle/": "learn", "sop-library/": "learn", "sme-lifecycle/": "learn", "sme-sop/": "learn", "tl/": "learn", "tl-support/": "learn", "agent-career/": "learn", "agent-sop/": "learn", "am-sop/": "learn", "codex/#daily": "browse", "browse/": "browse",
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
        check("(a5) scrolled to the bottom of home, the menu marks Learn", page.get_attribute("nav.appbar [aria-current='page']", "data-item") == "learn")
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

        # (dt) a double tap on Start / Next must not answer the question drawn under the finger
        LOG_CLICKS = "window.__clicks = []; addEventListener('click', (e) => { const t = e.target.closest('[data-start],[data-next],[data-option],[data-chip]'); window.__clicks.push([t ? Object.keys(t.dataset)[0] : e.target.tagName, e.detail]); }, true);"
        for touch in (False, True):
            ctx = browser.new_context(viewport={"width": 390, "height": 780}, has_touch=touch, is_mobile=touch)
            ctx.add_init_script(TOUR_DONE + "\n" + IN_APP + "\n" + LOG_CLICKS)
            page = ctx.new_page()
            page.on("pageerror", lambda e: errors.append(str(e)))
            page.goto(HUB + "excel/#lesson-1")
            page.wait_for_selector("[data-start]")
            how = "touch" if touch else "mouse"

            def double(sel):
                page.wait_for_timeout(600)  # apart from earlier taps, so these two count as one double tap
                page.evaluate("window.__clicks = []")
                loc = page.locator(sel)
                loc.scroll_into_view_if_needed()
                if touch:
                    box = loc.bounding_box()
                    x, y = box["x"] + box["width"] / 2, box["y"] + box["height"] / 2
                    page.touchscreen.tap(x, y)
                    page.wait_for_timeout(60)
                    page.touchscreen.tap(x, y)
                else:
                    loc.dblclick()
                page.wait_for_timeout(150)
                return page.evaluate("window.__clicks")

            clicks = double("[data-start]")
            check(f"(dt) {how}: Start took the first tap, the second hit a fresh option", [c[1] for c in clicks] == [1, 2] and clicks[0][0] == "start", clicks)
            check(f"(dt) {how}: double tap on Start leaves question 1 unanswered", page.locator("[data-explanation]").count() == 0)
            answer = page.evaluate("import('../excel/data.js').then((d) => d.EXCEL_LESSONS[0].questions[0].answer)")
            if page.locator("[data-explanation]").count() == 0:
                page.click(f"[data-option='{answer}']")
            clicks = double("[data-next]")
            check(f"(dt) {how}: Next took the first tap, the second hit a fresh option", [c[1] for c in clicks] == [1, 2] and clicks[0][0] == "next" and clicks[1][0] in ("option", "chip"), clicks)
            count = page.locator("[data-count]").inner_text()
            check(f"(dt) {how}: double tap on Next goes to question 2, unanswered", "2" in count and page.locator("[data-explanation]").count() == 0, count)
            page.wait_for_timeout(600)
            q2 = page.evaluate("import('../excel/data.js').then((d) => d.EXCEL_LESSONS[0].questions[1].answer)")
            if page.locator("[data-explanation]").count() == 0:
                page.click(f"[data-option='{q2}']")
            check(f"(dt) {how}: a normal tap still answers afterwards", page.locator(".explanation.is-correct").count() == 1)
            ctx.close()

        # (ch) Staffing Lab channel comparison tab
        for lang in ("ko", "en"):
            for width in (320, 390, 1280):
                page = new_page(browser, errors, width=width, init=f"try {{ localStorage.setItem('agent-lifecycle-course:lang', '{lang}'); }} catch (e) {{}}")
                page.goto(HUB + "staffing-calculator/#channels")
                page.wait_for_selector("[data-ch-table]")
                over = page.evaluate("document.documentElement.scrollWidth - window.innerWidth")
                check(f"(ch) channel tab fits {width}px {lang}", over <= 0, f"overflow={over}")
                edge = page.evaluate("document.querySelector('th[data-col=total]').getBoundingClientRect().right - document.querySelector('.ch-table-wrap').getBoundingClientRect().right")
                check(f"(ch) the total column is in view without scrolling the table {width}px {lang}", edge <= 1, f"edge={edge}")
                if lang == "ko" and width == 390:
                    check("(ch) the documented totals", page.inner_text("[data-cell='needed.total']") == "72" and page.inner_text("[data-cell='diff.total']") == "부족 5명 · 여유 1명", page.inner_text("[data-cell='diff.total']"))
                    page.screenshot(path=str(OUT / "staffing-channels-390.png"), full_page=True)
                    page.click("label[for='ch-on-email']")
                    page.wait_for_function("!document.querySelector(\"th[data-col='email']\")")
                    check("(ch) turning email off updates the totals", page.inner_text("[data-cell='needed.total']") == "63", page.inner_text("[data-cell='needed.total']"))
                    page.click("label[for='ch-on-chat']")
                    check("(ch) the last channel on cannot be turned off", page.is_disabled("[data-ch-toggle='phone']"))
                    page.focus("[data-ch-input='phone.current']")
                    page.keyboard.press("ArrowRight")
                    check("(ch) a slider keeps focus while results change", page.evaluate("document.activeElement.dataset.chInput") == "phone.current" and page.inner_text("[data-cell='current.phone']") == "37")
                    page.click("a[data-tab='practice']")
                    page.wait_for_selector("[data-results]")
                    check("(ch) the practice tab opens from the tab bar", page.evaluate("location.hash") == "#practice" and page.evaluate("document.activeElement.dataset.tab") == "practice")
                    page.keyboard.press("Tab")
                    page.keyboard.press("Enter")
                    page.wait_for_selector("[data-ch-table]")
                    check("(ch) the keyboard reaches the channel tab", page.evaluate("document.activeElement.dataset.tab") == "channels")
                    check("(ch) values survive switching tabs", page.inner_text("[data-cell='current.phone']") == "37" and not page.locator("th[data-col='email']").count())
                if lang == "en" and width == 390:
                    check("(ch) no seat note for the example values", page.locator("[data-seat-note]").count() == 0)
                    page.evaluate("(() => { const el = document.querySelector(\"[data-ch-input='email.hoursOpen']\"); el.value = 4; el.dispatchEvent(new Event('input', { bubbles: true })); })()")
                    page.wait_for_selector("[data-seat-note='email']")
                    check("(ch) a short-hours channel shows the seat note", page.inner_text("[data-seat-note='email']").startswith("Email: "))
                    check("(ch) the seat note page still fits", page.evaluate("document.documentElement.scrollWidth - window.innerWidth") <= 0)
                    page.locator(".lab-results").screenshot(path=str(OUT / "staffing-seat-note-390-en.png"))
                if lang == "ko" and width == 320:
                    check("(ch) a table that fits is not a tab stop", page.get_attribute(".ch-table-wrap", "tabindex") is None)
                    page.evaluate("""(() => {
                      const set = (key, v) => { const el = document.querySelector(`[data-ch-input='${key}']`); el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); };
                      for (const [k, v] of Object.entries({ 'phone.hoursOpen': 1, 'phone.dailyVolume': 5000, 'phone.aht': 15, 'phone.current': 0,
                        'chat.hoursOpen': 1, 'chat.dailyVolume': 3000, 'chat.aht': 30, 'chat.concurrency': 1, 'chat.current': 0,
                        'email.hoursOpen': 1, 'email.dailyVolume': 2000, 'email.aht': 30, 'email.current': 0 })) set(k, v);
                    })()""")
                    page.wait_for_timeout(100)
                    wide = page.evaluate("(() => { const w = document.querySelector('.ch-table-wrap'); return w.scrollWidth > w.clientWidth; })()")
                    check("(ch) a table that overflows becomes a labelled tab stop", (not wide) or (page.get_attribute(".ch-table-wrap", "tabindex") == "0" and page.get_attribute(".ch-table-wrap", "role") == "region"), f"wide={wide}")
                    check("(ch) the extreme case really overflows (so the check above means something)", wide)
                    check("(ch) the page itself still does not overflow", page.evaluate("document.documentElement.scrollWidth - window.innerWidth") <= 0)
                if lang == "en" and width == 320:
                    check("(ch) English channel tab has no Korean", not page.evaluate("/[가-힣]/.test(document.querySelector('#app').textContent)"))
                    page.screenshot(path=str(OUT / "staffing-channels-320-en.png"), full_page=True)
                page.context.close()

        # (tl) 2026-11-22: the week check on the team leader's day, and guide s18
        for lang, width in (("ko", 320), ("en", 320), ("ko", 1280)):
            page = new_page(browser, errors, width=width, init=f"try {{ localStorage.setItem('agent-lifecycle-course:lang', '{lang}'); }} catch (e) {{}}")
            page.goto(HUB + "codex/#daily-tl")
            page.wait_for_selector("[data-week-check]")
            check(f"(tl) week check fits {width}px {lang}", page.evaluate("document.documentElement.scrollWidth - window.innerWidth") <= 0)
            if lang == "en":
                check("(tl) English week check has no Korean", not page.evaluate("/[가-힣]/.test(document.querySelector('[data-week-check]').textContent)"))
            if lang == "ko" and width == 320:
                page.click("label[for='cx-week-3']")
                check("(tl) a tick toggles by tapping its label", page.is_checked("#cx-week-3"))
                keys = page.evaluate("Object.keys(localStorage).join(',')")
                check("(tl) ticks are not stored", "week" not in keys, keys)
                page.locator("[data-week-check]").screenshot(path=str(OUT / "codex-week-check-320.png"))
            page.context.close()
        page = new_page(browser, errors)
        page.goto(HUB + "guide/")
        page.wait_for_selector("[data-card]")
        page.click("[data-card='s18'] button")
        page.click("[data-card='s18'] a[data-go='first']")
        page.wait_for_selector("[data-counter]")
        check("(g7) s18 opens the colleague-to-team-leader SOP", "#transition-0" in page.url and "guide=s18" in page.url, page.url)
        for _ in range(20):
            if page.is_visible("[data-view='checkpoint']"):
                break
            page.click("[data-next]")
        page.click("[data-question='transition-q1'] [data-option='b']")
        page.click("[data-question='transition-q2'] [data-option='b']")
        page.wait_for_selector("[data-connection]:not([hidden]) a[data-guide-then]")
        page.click("a[data-guide-then]")
        page.wait_for_selector("[data-week-check]")
        check("(g7) then opens the team leader's day with the week check", page.url.endswith("codex/#daily-tl"), page.url)
        page.context.close()

        # (st) 2026-11-22: the start screen when the app is opened at home
        CLOCK = "(() => { const R = Date; const fixed = new R(2026, 10, 23, 8, 30).getTime(); globalThis.Date = class extends R { constructor(...a) { if (a.length) super(...a); else super(fixed); } static now() { return fixed; } }; })();"
        page = new_page(browser, errors, start=True, tour=True, init=CLOCK)
        page.goto(HUB)
        page.wait_for_selector("[data-start-screen]")
        check("(st) a fresh open at home shows the start screen", page.is_visible("[data-start-screen]"))
        check("(st) Monday 08:30 greets with a Monday line", page.inner_text("[data-start-greeting]") in ("한 주의 시작이에요! 지난주에 다시 하고 싶은 장면이 있다면, 이번 주에 바꿔 봐요.", "월요일 아침은 문의가 몰리기 쉬워요. 저도 그걸 알고 나서야 월요일이 덜 무서워졌어요."), page.inner_text("[data-start-greeting]"))
        check("(st) the dialog has focus and draws no ring", page.evaluate("document.activeElement.hasAttribute('data-start-screen') && getComputedStyle(document.activeElement).outlineStyle === 'none'"))
        check("(st) the page behind is inert", page.evaluate("Boolean(document.getElementById('app').closest('[inert]')) && Boolean(document.querySelector('nav.appbar').closest('[inert]'))"))
        check("(st) no tour while the start screen is up", page.locator("[data-tour]").count() == 0)
        page.screenshot(path=str(OUT / "start-390.png"))
        page.keyboard.press("Enter")
        page.wait_for_selector("[data-start-screen]", state="detached")
        check("(st) Enter closes it", page.locator("[data-start-screen]").count() == 0)
        page.wait_for_selector("[data-tour]")
        check("(st) a first visit then shows the tour", page.locator("[data-tour]").count() == 1)
        check("(st) Enter does not skip the tour's first step", page.inner_text("[data-tour-count]").startswith("1"), page.inner_text("[data-tour-count]"))
        page.reload()
        page.wait_for_selector("#app > *")
        page.wait_for_timeout(300)
        check("(st) a reload in the same visit does not show it again", page.locator("[data-start-screen]").count() == 0)
        page.context.close()
        page = new_page(browser, errors, start=True)
        page.goto(HUB + "#learn")
        page.wait_for_selector("#app > *")
        page.wait_for_timeout(300)
        check("(st) #learn opens home without the start screen", page.locator("[data-start-screen]").count() == 0)
        page.goto(HUB + "sop-library/")
        page.wait_for_selector("[data-sop-list]")
        page.click("nav.appbar a >> nth=0")
        page.wait_for_selector("#app > *")
        page.wait_for_timeout(300)
        check("(st) coming back home from another page does not show it", page.locator("[data-start-screen]").count() == 0, page.url)
        page.context.close()
        for lang in ("ko", "en"):
            page = new_page(browser, errors, width=320, height=460, start=True,
                            init=f"try {{ localStorage.setItem('agent-lifecycle-course:lang', '{lang}'); }} catch (e) {{}}")
            page.goto(HUB)
            page.wait_for_selector("[data-start-screen]")
            page.wait_for_timeout(400)
            bottom = page.evaluate("document.querySelector('[data-start-go]').getBoundingClientRect().bottom")
            check(f"(st) Start is on screen at 320x460 without scrolling ({lang})", bottom <= 460, f"bottom={bottom}")
            page.context.close()
        for lang, width, scheme in (("ko", 320, "light"), ("en", 320, "light"), ("ko", 390, "dark"), ("en", 1280, "light")):
            page = new_page(browser, errors, width=width, scheme=scheme, start=True,
                            init=f"try {{ localStorage.setItem('agent-lifecycle-course:lang', '{lang}'); }} catch (e) {{}}")
            page.goto(HUB)
            page.wait_for_selector("[data-start-screen]")
            over = page.evaluate("document.documentElement.scrollWidth - window.innerWidth")
            check(f"(st) fits {width}px {lang} {scheme}", over <= 0, f"overflow={over}")
            if lang == "en":
                check(f"(st) English start screen has no Korean ({width})", not page.evaluate("/[가-힣]/.test(document.querySelector('[data-start-screen]').textContent.replace('한국어', ''))"))
            if (lang, width) == ("en", 320):
                page.screenshot(path=str(OUT / "start-320-en.png"))
            if scheme == "dark":
                page.screenshot(path=str(OUT / "start-390-dark.png"))
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
        check("(g1) eighteen situations", page.locator("[data-card]").count() == 18)
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
        check("(g3) thirty-six links", len(links) == 36, str(len(links)))
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
        page.click("[data-question='coaching-q3'] [data-option='b']")
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
        page.click("[data-question='coaching-q3'] [data-option='b']")
        page.wait_for_selector("[data-connection]:not([hidden]) a[data-guide-then]")
        check("(g6) the usual next-lesson text is hidden", "성과 개선 계획(PIP)" not in page.inner_text("[data-connection]"))
        check("(g6) the arrow stays with the last word", page.inner_text("a[data-guide-then]").endswith("\u00a0→") or page.evaluate("document.querySelector('a[data-guide-then]').textContent.endsWith('\\u00a0→')"))
        page.click("[data-next-lesson]")
        page.wait_for_function("location.hash === '#pip-0'")
        # The hash changes first; the page drops ?guide when it redraws on hashchange, a moment later.
        try:
            page.wait_for_function("!location.search.includes('guide=')", timeout=3000)
        except Exception:
            pass
        check("(g6) moving on drops ?guide from the address", "guide=" not in page.evaluate("location.href"), page.evaluate("location.href"))
        page.goto(HUB + "sop-library/?guide=s1#home")
        page.wait_for_selector("a[data-sop]")
        check("(g6) the list drops ?guide too", "guide=" not in page.url, page.url)
        page.context.close()

        # (v) storage blocked
        page = new_page(browser, errors, init=BLOCK_STORAGE)
        for path, ko, en in (("glossary/", "용어집", "Glossary"), ("references/", "참고 자료", "References"), ("staffing-calculator/", "인력 산정 실험실", "Staffing Lab"), ("sop-library/", "팀장 SOP 라이브러리", "TL SOP Library"), ("codex/", "Codex 원페이저", "Codex One-Pagers"), ("guide/", "팀장 상황별 길잡이", "TL Situation Guide")):
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
            check(f"(x) {width}: my role, then the tutorial, follow Language", heads[:3] == ["언어", "내 직급", "튜토리얼"], str(heads))
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

        # (r) the role question (2026-11-25): asked once on home, then home follows the pick
        page = new_page(browser, errors, role=True)
        page.goto(HUB)
        page.wait_for_selector("[data-role-sheet] [role=dialog]")
        check("(r1) a first visit asks for the role", page.locator("[data-pick-role]").count() == 5)
        fits = page.evaluate("(() => { const r = document.querySelector('.rs-sheet').getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth; })()")
        check("(r1) the role sheet fits the phone", fits)
        page.click("[data-pick-role='sme']")
        page.wait_for_selector("[data-role-sheet]", state="detached")
        check("(r2) picking SME puts the SME course first", page.get_attribute("#learn a", "href") == "./sme/")
        page.reload()
        page.wait_for_selector("#app > *")
        check("(r3) the question is not asked again", page.locator("[data-role-sheet]").count() == 0)
        page.goto(HUB + "codex/#career")
        page.wait_for_selector("[data-level]")
        check("(r4) the career matrix opens on SME", page.get_attribute("[data-level='sme']", "aria-pressed") == "true")
        page.goto(HUB + "sme/#firstday-0")
        page.wait_for_selector("[data-counter]")
        check("(r5) the SME lesson opens", page.inner_text("#app h1") == "직무전문가가 된 첫날")
        page.goto(HUB + "settings/")
        page.wait_for_timeout(1500)  # let the page's own late redraws (offline status) finish first
        page.click("[data-set-role='om']")
        page.wait_for_url(HUB)  # a new role in Settings opens that role's home (2026-11-26)
        page.wait_for_selector("[data-soon='first-steps']")
        check("(r6) a role without a course sees coming-soon cards", page.locator("[data-soon] a").count() >= 2 and page.locator("#learn a.card[href='./excel/']").count() == 1)
        box = page.evaluate("""() => {
          const st = (el) => { const c = getComputedStyle(el); return { pad: c.paddingTop + ' ' + c.paddingLeft, bg: c.backgroundColor, radius: c.borderTopLeftRadius, bw: c.borderTopWidth }; };
          const soon = document.querySelector('#learn [data-soon]');
          const ready = document.querySelector('#learn a.card');
          return { soon: st(soon), ready: st(ready), title: getComputedStyle(soon.querySelector('strong')).display, text: getComputedStyle(soon.querySelector('[data-soon-text]')).display };
        }""")
        check("(r7) a coming-soon card is boxed like a ready card", box["soon"] == box["ready"] and box["title"] == "block" and box["text"] == "block")
        page.context.close()

        # (q) review quiz (2026-11-25): an SME who finished the course takes the quiz and gets the badge
        seed = "try { localStorage.setItem('queuecraft:role', 'sme'); localStorage.setItem('sme-course:v1', JSON.stringify({ completed: ['firstday','newcomer','escalation','peer','lead','priority','knowledge'] })); } catch (e) {}"
        page = new_page(browser, errors, init=seed)
        page.goto(HUB)
        page.wait_for_selector("a[data-review-quiz]")
        check("(q1) the home quiz card leads to the SME quiz", page.get_attribute("a[data-review-quiz]", "href") == "./review/#sme")
        page.click("a[data-review-quiz]")
        page.wait_for_selector("[data-question]")
        from_data = page.evaluate("async () => (await import(new URL('./data.js', location.href).href)).QUIZZES.sme.questions.map((q) => q.answer)")
        for a in from_data:
            page.click(f"[data-option='{a}']")
            page.click("[data-next]")
        page.wait_for_selector("[data-score]")
        check("(q1) a full run scores 6 of 6", "6" in page.inner_text("[data-score]") and page.locator("[data-new-badge]").count() == 1)
        page.goto(HUB + "practice/")
        page.wait_for_selector("#app > *")
        got = page.evaluate("JSON.parse(localStorage.getItem('kb-practice:v1') || '{}').badges || {}")
        check("(q2) the badge is kept for the practice page", "review-sme" in got, str(got))
        page.goto(HUB + "review/")
        page.wait_for_selector("[data-start-quiz='sme']")
        page.click("[data-start-quiz='sme']")
        page.wait_for_selector("[data-question]")
        check("(q3) starting from the list puts the quiz in the address", page.url.endswith("review/#sme"), page.url)
        page.reload()
        page.wait_for_selector("#app > *")
        check("(q3) a reload reopens that quiz at question 1", page.locator("[data-question='sme-q1']").count() == 1)
        page.go_back()
        page.wait_for_selector("[data-quiz]")
        check("(q3) Back returns to the list", page.locator("[data-start-quiz]").count() >= 1)
        page.context.close()

        # (qa) agent review quiz (2026-11-27): an agent who finished First Steps and the SOP Library passes it and gets the badge
        seed = ("try { localStorage.setItem('queuecraft:role', 'agent');"
                " localStorage.setItem('agent-course:v1', JSON.stringify({ completed: ['start','training','nesting','golive','customers','review','attendance','growth'] }));"
                " localStorage.setItem('agent-sop:v1', JSON.stringify({ completed: ['request','abuse','absence','huddle','kbreport','scrubfb','dispute','outage'] })); } catch (e) {}")
        page = new_page(browser, errors, init=seed)
        page.goto(HUB)
        page.wait_for_selector("a[data-review-quiz]")
        check("(qa1) the agent home quiz card leads to the agent quiz", page.get_attribute("a[data-review-quiz]", "href") == "./review/#agent")
        page.click("a[data-review-quiz]")
        page.wait_for_selector("[data-question='agent-q1']")
        answers = page.evaluate("async () => (await import(new URL('./data.js', location.href).href)).QUIZZES.agent.questions.map((q) => q.answer)")
        for a in answers:
            page.click(f"[data-option='{a}']")
            page.click("[data-next]")
        page.wait_for_selector("[data-score]")
        check("(qa1) a full agent run scores 6 of 6 and shows the badge", "6" in page.inner_text("[data-score]") and "상담사 과정 완주" in page.inner_text("[data-new-badge]"))
        page.goto(HUB + "review/")
        page.wait_for_selector("[data-quiz]")
        check("(qa2) the agent sees the agent quiz first", page.get_attribute("[data-quiz]", "data-quiz") == "agent")
        page.screenshot(path=str(OUT / "agent-review-390.png"), full_page=True)
        page.context.close()

        # (h) every role's home has the same layout; Browse has its own page (2026-11-25)
        shapes = {}
        for role in ("tl", "sme", "agent", "am", "om"):
            page = new_page(browser, errors, init=f"try {{ localStorage.setItem('queuecraft:role', '{role}'); }} catch (e) {{}}")
            page.goto(HUB)
            page.wait_for_selector("#learn")
            shapes[role] = page.evaluate("[...document.querySelector('#app').children].map((e) => e.tagName + (e.id ? '#' + e.id : ''))")
            if role == "sme":
                page.goto(HUB + "excel/")
                page.wait_for_selector("ol.ex-list")
                check("(h3) an SME's Excel page has no advanced section", page.locator("[data-advanced]").count() == 0)
            page.context.close()
        check("(h1) every role's home has the same sections in the same order", len({str(v) for v in shapes.values()}) == 1, str(shapes))
        page = new_page(browser, errors)
        page.goto(HUB)
        page.wait_for_selector("nav.appbar")
        page.click("nav.appbar a[data-item='browse']")
        page.wait_for_selector("a.card[href='../codex/']")
        check("(h2) the menu's Browse opens the Browse page", page.url.endswith("/browse/"), page.url)
        page.goto(HUB + "#browse")
        page.wait_for_url("**/browse/")
        check("(h2) the old home Browse address opens the Browse page", page.url.endswith("/browse/"), page.url)
        page.context.close()

        # (s) Support Lifecycle (2026-11-25): an SME opens it from Learn, finishes lesson 1, and home counts it
        page = new_page(browser, errors, init="try { localStorage.setItem('queuecraft:role', 'sme'); } catch (e) {}")
        page.goto(HUB)
        page.wait_for_selector("#learn a.card[href='./sme-lifecycle/']")
        page.click("#learn a.card[href='./sme-lifecycle/']")
        page.wait_for_selector("[data-stage-list]")
        check("(s1) Learn opens Support Lifecycle with five stages on the ring", page.url.endswith("/sme-lifecycle/") and page.locator("svg a[data-stage]").count() == 5 and page.locator("[data-stage-list] a").count() == 5)
        page.click("[data-stage-list] a[data-stage='trainee']")
        page.wait_for_selector("[data-counter]")
        steps = int(page.inner_text("[data-counter]").split("/")[1])
        for _ in range(steps):
            page.click("[data-next]")
        page.wait_for_selector("[data-view='checkpoint']")
        page.click("[data-question='trainee-q1'] [data-option='b']")
        page.click("[data-question='trainee-q2'] [data-option='b']")
        page.wait_for_selector("[data-connection]")
        check("(s2) the next lesson is nesting", page.get_attribute("[data-next-lesson]", "href") == "#graduate-0")
        page.goto(HUB)
        page.wait_for_selector("[data-course='sme-lifecycle']")
        check("(s2) home my learning counts the finished lesson", "1/5" in page.inner_text("[data-course='sme-lifecycle']") and page.get_attribute("a[data-next='sme-lifecycle']", "href") == "./sme-lifecycle/#graduate-0")
        page.goto(HUB + "sme-lifecycle/")
        page.wait_for_selector("[data-stage-list]")
        check("(s3) the finished stage is marked on the list", page.locator("[data-stage-list] a.is-done").count() == 1)
        page.screenshot(path=str(OUT / "sme-lifecycle-390.png"), full_page=True)
        page.context.close()

        # (p) SME SOP Library (2026-11-25): an SME opens it from Learn, finishes procedure 1, and home counts it
        page = new_page(browser, errors, init="try { localStorage.setItem('queuecraft:role', 'sme'); } catch (e) {}")
        page.goto(HUB)
        page.wait_for_selector("#learn a.card[href='./sme-sop/']")
        check("(p1) an SME's Learn has no coming-soon card left", page.locator("#learn [data-soon]").count() == 0)
        page.click("#learn a.card[href='./sme-sop/']")
        page.wait_for_selector("[data-sme-sop-list]")
        check("(p1) Learn opens the SME SOP Library with eight procedures and who takes part",
              page.url.endswith("/sme-sop/") and page.locator("[data-sme-sop-list] a").count() == 8 and page.locator("[data-roles]").count() == 8)
        page.click("[data-sme-sop-list] a[data-sme-sop='approval']")
        page.wait_for_selector("[data-counter]")
        steps = int(page.inner_text("[data-counter]").split("/")[1])
        for _ in range(steps):
            page.click("[data-next]")
        page.wait_for_selector("[data-view='checkpoint']")
        page.click("[data-question='approval-q1'] [data-option='b']")
        page.click("[data-question='approval-q2'] [data-option='b']")
        page.wait_for_selector("[data-connection]")
        check("(p2) the next SOP is scrubbing", page.get_attribute("[data-next-lesson]", "href") == "#scrubbing-0")
        page.goto(HUB)
        page.wait_for_selector("[data-course='sme-sop']")
        check("(p2) home my learning counts the finished procedure", "1/8" in page.inner_text("[data-course='sme-sop']") and page.get_attribute("a[data-next='sme-sop']", "href") == "./sme-sop/#scrubbing-0")
        page.goto(HUB + "sme-sop/")
        page.wait_for_selector("[data-sme-sop-list]")
        check("(p3) the finished procedure is marked and the menu marks Learn",
              page.locator("[data-sme-sop-list] a.is-done").count() == 1 and page.get_attribute("nav.appbar a[aria-current='page']", "data-item") == "learn")
        page.screenshot(path=str(OUT / "sme-sop-390.png"), full_page=True)
        page.context.close()

        # (ag) Agent First Steps (2026-11-26): an agent opens it from Learn, finishes lesson 1, and home counts it
        page = new_page(browser, errors, init="try { if (!localStorage.getItem('queuecraft:role')) localStorage.setItem('queuecraft:role', 'agent'); } catch (e) {}")
        page.goto(HUB)
        page.wait_for_selector("#learn a.card[href='./agent/']")
        check("(ag1) an agent's Learn shows Agent First Steps, Agent Career Lifecycle, the Agent SOP Library, then Excel",
              page.get_attribute("#learn li:nth-child(1) a.card", "href") == "./agent/" and page.get_attribute("#learn li:nth-child(2) a.card", "href") == "./agent-career/"
              and page.get_attribute("#learn li:nth-child(3) a.card", "href") == "./agent-sop/" and page.locator("#learn [data-soon]").count() == 0
              and page.get_attribute("#learn li:nth-child(4) a.card", "href") == "./excel/" and page.get_attribute("[data-start] a", "href") == "./agent/#start-0")
        page.click("#learn a.card[href='./agent/']")
        page.wait_for_selector("[data-agent-list] a")
        check("(ag2) Agent First Steps opens with 8 lessons", page.locator("[data-agent-list] a").count() == 8)
        page.click("[data-agent-list] a[href='#start-0']")
        page.wait_for_selector("[data-counter]")
        steps = int(page.inner_text("[data-counter]").split("/")[1])
        for _ in range(steps):
            page.click("[data-next]")
        page.wait_for_selector("[data-view='checkpoint']")
        check("(ag2) the checkpoint is the agent's", "상담사 체크포인트" in page.inner_text("#app"))
        for q in page.evaluate("[...document.querySelectorAll('[data-question]')].map((e) => e.dataset.question)"):
            page.click(f"[data-question='{q}'] [data-option='b']")
        page.wait_for_selector("[data-connection]")
        check("(ag2) lesson 1 leads on to lesson 2", page.get_attribute("[data-next-lesson]", "href") == "#training-0")
        page.goto(HUB)
        page.wait_for_selector("[data-course='agent']")
        check("(ag3) home my learning counts Agent First Steps", "1/8" in page.inner_text("[data-course='agent']"))
        page.goto(HUB + "agent/#customers-7")
        page.wait_for_selector("[data-counter]")
        page.click("[data-lang='en']")
        page.wait_for_timeout(200)
        check("(ag4) an agent lesson in English shows no Korean", not any("\uac00" <= ch <= "\ud7a3" for ch in page.inner_text("#app")))
        page.click("[data-lang='ko']")
        page.screenshot(path=str(OUT / "agent-390.png"), full_page=True)
        page.context.close()

        # (am) AM First Steps (2026-11-28): an AM opens it from Learn, finishes lesson 1, and home counts it
        page = new_page(browser, errors, init="try { if (!localStorage.getItem('queuecraft:role')) localStorage.setItem('queuecraft:role', 'am'); } catch (e) {}")
        page.goto(HUB)
        page.wait_for_selector("#learn a.card[href='./am/']")
        check("(am1) an AM's Learn shows AM First Steps, the AM SOP Library, then Excel",
              page.get_attribute("#learn li:nth-child(1) a.card", "href") == "./am/" and page.get_attribute("#learn li:nth-child(2) a.card", "href") == "./am-sop/" and page.locator("#learn [data-soon]").count() == 0
              and page.get_attribute("#learn li:nth-child(3) a.card", "href") == "./excel/" and page.get_attribute("[data-start] a", "href") == "./am/#firstweek-0")
        page.click("#learn a.card[href='./am/']")
        page.wait_for_selector("[data-am-list] a")
        check("(am2) AM First Steps opens with 8 lessons", page.locator("[data-am-list] a").count() == 8)
        page.click("[data-am-list] a[href='#firstweek-0']")
        page.wait_for_selector("[data-counter]")
        steps = int(page.inner_text("[data-counter]").split("/")[1])
        for _ in range(steps):
            page.click("[data-next]")
        page.wait_for_selector("[data-view='checkpoint']")
        check("(am2) the checkpoint is the AM's", "부매니저 체크포인트" in page.inner_text("#app"))
        page.click("[data-question='firstweek-q1'] [data-option='b']")
        page.click("[data-question='firstweek-q2'] [data-option='c']")
        page.wait_for_selector("[data-connection]")
        check("(am2) lesson 1 leads on to lesson 2", page.get_attribute("[data-next-lesson]", "href") == "#leaders-0")
        page.goto(HUB)
        page.wait_for_selector("[data-course='am']")
        check("(am3) home my learning counts AM First Steps", "1/8" in page.inner_text("[data-course='am']"))
        for lid in ("firstweek", "leaders", "instructions", "escalation", "review", "requests", "cover", "mentoring"):
            page.goto(HUB + f"am/#{lid}-1")
            page.wait_for_selector("[data-counter]")
            page.click("[data-lang='en']")
            page.wait_for_timeout(150)
            fits = page.evaluate("""() => [...document.querySelectorAll('svg text')].every((t) => {
              const box = t.getBBox(); const rect = t.closest('g')?.querySelector('rect');
              if (!rect) return true; const r = rect.getBBox(); return r.width < 100 || box.width <= r.width - 8; })  // stage boxes only; the small persona marker is checked elsewhere""")
            check(f"(am4) {lid} in English: no Korean, labels fit their boxes",
                  fits and not any("\uac00" <= ch <= "\ud7a3" for ch in page.inner_text("#app")))
            page.click("[data-lang='ko']")
        page.screenshot(path=str(OUT / "am-390.png"), full_page=True)
        page.context.close()

        # (ams) AM SOP Library (2026-11-28): an AM opens it from Learn, finishes procedure 1, and home counts it
        page = new_page(browser, errors, init="try { if (!localStorage.getItem('queuecraft:role')) localStorage.setItem('queuecraft:role', 'am'); } catch (e) {}")
        page.goto(HUB)
        page.wait_for_selector("#learn a.card[href='./am-sop/']")
        page.click("#learn a.card[href='./am-sop/']")
        page.wait_for_selector("[data-am-sop-list] a")
        check("(ams1) Learn opens the AM SOP Library with eight procedures", page.url.endswith("/am-sop/") and page.locator("[data-am-sop-list] a").count() == 8)
        page.click("[data-am-sop-list] a[href='#weekly-0']")
        page.wait_for_selector("[data-counter]")
        steps = int(page.inner_text("[data-counter]").split("/")[1])
        for _ in range(steps):
            page.click("[data-next]")
        page.wait_for_selector("[data-view='checkpoint']")
        check("(ams2) the checkpoint is the AM's", "부매니저 체크포인트" in page.inner_text("#app"))
        page.click("[data-question='weekly-q1'] [data-option='b']")
        page.click("[data-question='weekly-q2'] [data-option='a']")
        page.wait_for_selector("[data-connection]")
        check("(ams2) procedure 1 leads on to procedure 2", page.get_attribute("[data-next-lesson]", "href") == "#instructions-0" and "다음 SOP" in page.inner_text("#app"))
        page.goto(HUB)
        page.wait_for_selector("[data-course='am-sop']")
        check("(ams3) home my learning counts the finished procedure", "1/8" in page.inner_text("[data-course='am-sop']") and page.get_attribute("a[data-next='am-sop']", "href") == "./am-sop/#instructions-0")
        for lid in ("weekly", "instructions", "escalation", "risk", "review", "requests", "backup", "cover"):
            page.goto(HUB + f"am-sop/#{lid}-1")
            page.wait_for_selector("[data-counter]")
            page.click("[data-lang='en']")
            page.wait_for_timeout(150)
            fits = page.evaluate("""() => [...document.querySelectorAll('svg text')].every((t) => {
              const box = t.getBBox(); const rect = t.closest('g')?.querySelector('rect');
              if (!rect) return true; const r = rect.getBBox(); return r.width < 100 || box.width <= r.width - 8; })""")
            check(f"(ams4) {lid} in English: no Korean, labels fit their boxes",
                  fits and not any("\uac00" <= ch <= "\ud7a3" for ch in page.inner_text("#app")))
            page.click("[data-lang='ko']")
        page.goto(HUB + "am-sop/")
        page.wait_for_selector("[data-am-sop-list] a")
        page.click("[data-lang='en']")
        page.wait_for_timeout(200)
        check("(ams4) the English list shows no Korean", not any("\uac00" <= ch <= "\ud7a3" for ch in page.inner_text("#app")))
        page.click("[data-lang='ko']")
        page.screenshot(path=str(OUT / "am-sop-390.png"), full_page=True)
        page.context.close()

        # (ac) Agent Career Lifecycle (2026-11-26): an agent opens it from Learn, finishes lesson 1, and home counts it
        page = new_page(browser, errors, init="try { if (!localStorage.getItem('queuecraft:role')) localStorage.setItem('queuecraft:role', 'agent'); } catch (e) {}")
        page.goto(HUB)
        page.wait_for_selector("#learn a.card[href='./agent-career/']")
        page.click("#learn a.card[href='./agent-career/']")
        page.wait_for_selector("[data-stage-list]")
        check("(ac1) Learn opens Agent Career Lifecycle with a four-step operations-team ladder", page.url.endswith("/agent-career/") and page.locator("[data-ladder] a[data-rung]").count() == 4 and page.locator("[data-ladder] [data-rung='agent']").count() == 1 and page.locator(".ring").count() == 0 and page.locator("[data-stage-list] a").count() == 4)
        page.click("[data-ladder] a[data-rung='ready']")
        page.wait_for_selector("[data-counter]")
        steps = int(page.inner_text("[data-counter]").split("/")[1])
        for _ in range(steps):
            page.click("[data-next]")
        page.wait_for_selector("[data-view='checkpoint']")
        check("(ac2) the checkpoint is the agent's", "상담사 체크포인트" in page.inner_text("#app"))
        page.click("[data-question='ready-q1'] [data-option='b']")
        page.click("[data-question='ready-q2'] [data-option='c']")
        page.wait_for_selector("[data-connection]")
        check("(ac2) lesson 1 climbs on to the SME role", page.get_attribute("[data-next-lesson]", "href") == "#sme-0")
        page.goto(HUB)
        page.wait_for_selector("[data-course='agent-career']")
        check("(ac3) home my learning counts the finished lesson", "1/4" in page.inner_text("[data-course='agent-career']") and page.get_attribute("a[data-next='agent-career']", "href") == "./agent-career/#sme-0")
        page.goto(HUB + "agent-career/#tl-3")
        page.wait_for_selector("[data-counter]")
        page.click("[data-lang='en']")
        page.wait_for_timeout(200)
        check("(ac4) a career lesson in English shows no Korean", not any("\uac00" <= ch <= "\ud7a3" for ch in page.inner_text("#app")))
        page.goto(HUB + "agent-career/")
        page.wait_for_selector("[data-stage-list]")
        check("(ac4) the English ladder shows no Korean", not any("\uac00" <= ch <= "\ud7a3" for ch in page.inner_text("#app")))
        page.click("[data-lang='ko']")
        page.screenshot(path=str(OUT / "agent-career-390.png"), full_page=True)
        page.context.close()

        # (as) Agent SOP Library (2026-11-27): an agent opens it from Learn, finishes procedure 1, and home counts it
        page = new_page(browser, errors, init="try { if (!localStorage.getItem('queuecraft:role')) localStorage.setItem('queuecraft:role', 'agent'); } catch (e) {}")
        page.goto(HUB)
        page.wait_for_selector("#learn a.card[href='./agent-sop/']")
        page.click("#learn a.card[href='./agent-sop/']")
        page.wait_for_selector("[data-agent-sop-list] a")
        check("(as1) Learn opens the Agent SOP Library with eight procedures", page.url.endswith("/agent-sop/") and page.locator("[data-agent-sop-list] a").count() == 8)
        page.click("[data-agent-sop-list] a[href='#request-0']")
        page.wait_for_selector("[data-counter]")
        steps = int(page.inner_text("[data-counter]").split("/")[1])
        for _ in range(steps):
            page.click("[data-next]")
        page.wait_for_selector("[data-view='checkpoint']")
        check("(as2) the checkpoint is the agent's", "상담사 체크포인트" in page.inner_text("#app"))
        page.click("[data-question='request-q1'] [data-option='b']")
        page.click("[data-question='request-q2'] [data-option='c']")
        page.wait_for_selector("[data-connection]")
        check("(as2) procedure 1 leads on to procedure 2", page.get_attribute("[data-next-lesson]", "href") == "#abuse-0" and "다음 SOP" in page.inner_text("#app"))
        page.goto(HUB)
        page.wait_for_selector("[data-course='agent-sop']")
        check("(as3) home my learning counts the finished procedure", "1/8" in page.inner_text("[data-course='agent-sop']") and page.get_attribute("a[data-next='agent-sop']", "href") == "./agent-sop/#abuse-0")
        page.goto(HUB + "agent-sop/#outage-3")
        page.wait_for_selector("[data-counter]")
        page.click("[data-lang='en']")
        page.wait_for_timeout(200)
        check("(as4) an agent SOP in English shows no Korean", not any("\uac00" <= ch <= "\ud7a3" for ch in page.inner_text("#app")))
        page.goto(HUB + "agent-sop/")
        page.wait_for_selector("[data-agent-sop-list] a")
        check("(as4) the English list shows no Korean", not any("\uac00" <= ch <= "\ud7a3" for ch in page.inner_text("#app")))
        page.click("[data-lang='ko']")
        page.screenshot(path=str(OUT / "agent-sop-390.png"), full_page=True)
        page.context.close()

        # (tl) TL courses (2026-11-25): a team lead opens both new courses from Learn, finishes lesson 1 of each, and home counts them
        page = new_page(browser, errors, init="try { localStorage.setItem('queuecraft:role', 'tl'); } catch (e) {}")
        page.goto(HUB)
        page.wait_for_selector("#learn a.card[href='./tl/']")
        check("(tl1) a team lead's Learn lists the five cards in order",
              [page.get_attribute(f"#learn li:nth-child({i}) a.card", "href") for i in range(1, 6)] == ["./tl/", "./agent-lifecycle/", "./tl-support/", "./sop-library/", "./excel/"])
        for href, list_sel, n, first, second, done_text in (("./tl/", "[data-tl-list] a", 7, "start", "roster", "1/7"), ("./tl-support/", "[data-stage-list] a", 5, "agents", "sme", "1/5")):
            page.goto(HUB)
            page.click(f"#learn a.card[href='{href}']")
            page.wait_for_selector(list_sel)
            check(f"(tl2) {href} opens with {n} lessons", page.locator(list_sel).count() == n)
            page.click(f"{list_sel}[href='#{first}-0']")
            page.wait_for_selector("[data-counter]")
            steps = int(page.inner_text("[data-counter]").split("/")[1])
            for _ in range(steps):
                page.click("[data-next]")
            page.wait_for_selector("[data-view='checkpoint']")
            for q in page.evaluate("[...document.querySelectorAll('[data-question]')].map((e) => e.dataset.question)"):
                page.click(f"[data-question='{q}'] [data-option='b']")
            page.wait_for_selector("[data-connection]")
            check(f"(tl2) {href} lesson 1 leads on to lesson 2", page.get_attribute("[data-next-lesson]", "href") == f"#{second}-0")
            course = href.strip("./").rstrip("/")
            page.goto(HUB)
            page.wait_for_selector(f"[data-course='{course}']")
            check(f"(tl3) home my learning counts {course}", done_text in page.inner_text(f"[data-course='{course}']"))
        page.goto(HUB + "tl-support/")
        page.wait_for_selector("[data-stage-list]")
        page.screenshot(path=str(OUT / "tl-support-390.png"), full_page=True)
        page.goto(HUB + "tl/")
        page.wait_for_selector("[data-tl-list]")
        page.screenshot(path=str(OUT / "tl-390.png"), full_page=True)
        page.context.close()

        # (g) SME Situation Guide (2026-11-25): home card and menu lead an SME there; m3 leads on to its "then"
        page = new_page(browser, errors, init="try { localStorage.setItem('queuecraft:role', 'sme'); } catch (e) {}")
        page.goto(HUB)
        page.wait_for_selector("a.card[href='./sme-guide/']")
        check("(g1) the SME home guide card and menu Guide both open the SME guide",
              page.locator("[data-soon='guide']").count() == 0 and page.get_attribute("nav.appbar a[data-item='guide']", "href").endswith("/sme-guide/"))
        page.click("a.card[href='./sme-guide/']")
        page.wait_for_selector("[data-card]")
        check("(g1) the SME guide shows sixteen situations with Guide current",
              page.url.endswith("/sme-guide/") and page.locator("[data-card]").count() == 16 and page.get_attribute("nav.appbar a[aria-current='page']", "data-item") == "guide")
        page.click("[data-card='m3'] button")
        page.click("[data-card='m3'] a[data-go='first']")
        page.wait_for_selector("[data-counter]")
        check("(g2) m3 opens Support Lifecycle lesson 1", "/sme-lifecycle/" in page.url and "trainee-0" in page.url)
        steps = int(page.inner_text("[data-counter]").split("/")[1])
        for _ in range(steps):
            page.click("[data-next]")
        page.wait_for_selector("[data-view='checkpoint']")
        page.click("[data-question='trainee-q1'] [data-option='b']")
        page.click("[data-question='trainee-q2'] [data-option='b']")
        page.wait_for_selector("[data-connection] a[data-guide-then]")
        check("(g2) the lesson ends with the guide's next place", page.get_attribute("[data-connection] a[data-guide-then]", "href") == "../agent-lifecycle/#nesting-0")
        page.screenshot(path=str(OUT / "sme-guide-then-390.png"), full_page=False)
        page.context.close()

        # (ga) Agent Situation Guide (2026-11-27): home card and menu lead an agent there; a3 leads on to its "then"
        page = new_page(browser, errors, init="try { localStorage.setItem('queuecraft:role', 'agent'); } catch (e) {}")
        page.goto(HUB)
        page.wait_for_selector("a.card[href='./agent-guide/']")
        check("(ga1) the agent home guide card and menu Guide both open the agent guide",
              page.locator("[data-soon='guide']").count() == 0 and page.get_attribute("nav.appbar a[data-item='guide']", "href").endswith("/agent-guide/"))
        page.click("a.card[href='./agent-guide/']")
        page.wait_for_selector("[data-card]")
        check("(ga1) the agent guide shows sixteen situations with Guide current",
              page.url.endswith("/agent-guide/") and page.locator("[data-card]").count() == 16 and page.get_attribute("nav.appbar a[aria-current='page']", "data-item") == "guide")
        page.click("[data-card='a3'] button")
        page.click("[data-card='a3'] a[data-go='first']")
        page.wait_for_selector("[data-counter]")
        check("(ga2) a3 opens Agent First Steps lesson 3", "/agent/" in page.url and "nesting-0" in page.url)
        steps = int(page.inner_text("[data-counter]").split("/")[1])
        for _ in range(steps):
            page.click("[data-next]")
        page.wait_for_selector("[data-view='checkpoint']")
        page.click("[data-question='nesting-q1'] [data-option='b']")
        page.click("[data-question='nesting-q2'] [data-option='b']")
        page.wait_for_selector("[data-connection] a[data-guide-then]")
        check("(ga2) the lesson ends with the guide's next place", page.get_attribute("[data-connection] a[data-guide-then]", "href") == "../agent-sop/#request-0")
        page.goto(HUB + "agent-guide/")
        page.wait_for_selector("[data-card]")
        page.click("[data-lang='en']")
        page.wait_for_timeout(200)
        for b in page.locator("[data-card] button").all():
            b.click()
        check("(ga3) the English agent guide shows no Korean", not any("\uac00" <= ch <= "\ud7a3" for ch in page.inner_text("#app")))
        page.click("[data-lang='ko']")
        page.screenshot(path=str(OUT / "agent-guide-390.png"), full_page=True)
        page.context.close()
        # Seed the role once: an init script runs on every page, and these checks change the role and move on.
        once_tl = "try { if (!localStorage.getItem('queuecraft:role')) localStorage.setItem('queuecraft:role', 'tl'); } catch (e) {}"
        page = new_page(browser, errors, init=once_tl)
        page.goto(HUB)
        page.wait_for_selector("nav.appbar a[data-item='guide']")
        check("(g1) a team lead's menu Guide still opens the TL guide", page.get_attribute("nav.appbar a[data-item='guide']", "href").endswith("/kb/guide/"))
        page.goto(HUB + "settings/")
        page.wait_for_selector("[data-set-role='sme']")
        page.wait_for_timeout(1500)  # let the page's own late redraws (offline status) finish first
        page.click("[data-set-role='sme']")
        page.wait_for_url(HUB)
        page.wait_for_selector("#learn a.card[href='./sme/']")
        check("(g1) after picking SME in Settings, home opens with the SME courses and the SME guide",
              page.locator("#learn a.card[href='./tl/']").count() == 0 and page.get_attribute("nav.appbar a[data-item='guide']", "href").endswith("/sme-guide/"))
        page.context.close()

        # (rs) the role picker in the top bar (2026-11-26)
        page = new_page(browser, errors, init=once_tl)
        page.goto(HUB)
        page.wait_for_selector(".topbar select.role-switch")
        check("(rs1) home shows the role picker with the saved role, not the old name word",
              page.input_value(".topbar select.role-switch") == "tl" and page.locator(".topbar a.brand").count() == 0)
        boxes = page.evaluate("""() => {
          const r = (el) => el.getBoundingClientRect();
          const a = r(document.querySelector('.topbar select.role-switch')), b = r(document.querySelector('#lang'));
          return { overlap: !(a.right <= b.left || b.right <= a.left || a.bottom <= b.top || b.bottom <= a.top), inside: a.left >= 0 && a.right <= window.innerWidth, h: a.height };
        }""")
        check("(rs2) on a phone the picker sits beside the language buttons without overlapping", not boxes["overlap"] and boxes["inside"] and boxes["h"] >= 32, str(boxes))
        page.screenshot(path=str(OUT / "role-switch-390.png"), clip={"x": 0, "y": 0, "width": 390, "height": 80})
        for path in ("settings/", "guide/", "glossary/", "practice/", "excel/", "privacy/"):
            page.goto(HUB + path)
            page.wait_for_selector(".topbar select.role-switch")
            check(f"(rs3) {path} has the picker", page.input_value(".topbar select.role-switch") == "tl")
        # (xr) Excel per role (2026-11-26): an agent's own intro, no advanced lessons
        page.goto(HUB + "excel/")
        page.wait_for_selector(".ex-intro p")
        check("(xr1) a team lead's Excel keeps the team-lead intro and the advanced lessons",
              "팀장에게 꼭 필요한" in page.inner_text(".ex-intro p") and page.locator("[data-advanced]").count() > 0)
        page.evaluate("localStorage.setItem('queuecraft:role', 'agent')")
        page.reload()
        page.wait_for_selector(".ex-intro p")
        check("(xr2) an agent's Excel has the agent intro and no advanced lessons",
              "내 실적을 직접 확인할 때" in page.inner_text(".ex-intro p") and page.locator("[data-advanced]").count() == 0)
        page.evaluate("localStorage.setItem('queuecraft:role', 'tl')")
        # (cx) the service name (2026-11-26): CX 2회차 / CX Replay
        page.goto(HUB)
        page.wait_for_selector("#app h1")
        check("(cx1) home is titled CX 2회차 with the replay tagline", page.inner_text("#app h1") == "CX 2회차" and page.title() == "CX 2회차" and "그때 알았더라면" in page.inner_text("#app"))
        page.goto(HUB + "agent-lifecycle/")
        page.wait_for_selector("[data-kb-link]")
        check("(cx2) a course page's way home says CX 2회차", page.get_attribute("[data-kb-link]", "aria-label") == "CX 2회차")
        page.click("[data-lang='en']")
        page.wait_for_timeout(200)
        check("(cx3) in English it says CX Replay", page.get_attribute("[data-kb-link]", "aria-label") == "CX Replay" and page.text_content("[data-kb-link] .kb-text").strip() == "CX Replay")
        page.click("[data-lang='ko']")
        page.goto(HUB + "tl/")
        page.wait_for_selector("#brand")
        check("(rs4) a course page keeps its name at the top left", page.locator(".topbar select.role-switch").count() == 0 and page.inner_text("#brand") == "팀장 첫걸음")
        page.goto(HUB + "glossary/")
        page.wait_for_selector(".topbar select.role-switch")
        page.select_option(".topbar select.role-switch", "sme")
        page.wait_for_url(HUB)
        page.wait_for_selector("#learn a.card[href='./sme/']")
        check("(rs5) picking SME in the top bar opens home with the SME courses and guide",
              page.input_value(".topbar select.role-switch") == "sme" and page.get_attribute("nav.appbar a[data-item='guide']", "href").endswith("/sme-guide/"))
        page.click("[data-lang='en']")
        page.wait_for_timeout(200)
        names = page.evaluate("[...document.querySelectorAll('.topbar select.role-switch option')].map(o => o.textContent)")
        check("(rs6) the picker follows the page into English", names[2] == "Team Lead / TL" and page.get_attribute(".topbar select.role-switch", "aria-label") == "My role", str(names))
        page.click("[data-lang='ko']")
        page.goto(HUB + "sme-guide/")
        page.wait_for_selector("[data-card]")
        page.screenshot(path=str(OUT / "sme-guide-390.png"), full_page=True)
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
