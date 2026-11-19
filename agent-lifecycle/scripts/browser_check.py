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


def new_page(browser, errors, width=390, height=780, locale="ko-KR", init=None, scheme="light"):
    ctx = browser.new_context(viewport={"width": width, "height": height}, locale=locale, color_scheme=scheme)
    if init:
        ctx.add_init_script(init)
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
        check("(i) two questions on the general track", page.locator("[data-question]").count() == 2)
        page.click("[data-question='hiring-q1'] [data-option='a']")
        page.click("[data-question='hiring-q1'] [data-option='b']")
        check("(i) one explanation per answered question", page.locator("[data-explanation]:visible").count() == 1)
        check("(i) connection waits for every question", not page.is_visible("[data-connection]"))
        page.click("[data-question='hiring-general'] [data-option='b']")
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
        check("(r) hub shows five cards", cards.count() == 5, str(cards.count()))
        for href, title in (("./agent-lifecycle/", "상담사 라이프사이클"), ("./sop-library/", "SOP 라이브러리"), ("./staffing-calculator/", "인력 산정 실험실"), ("./glossary/", "용어집"), ("./references/", "참고 자료")):
            page.goto(HUB)
            page.click(f"a.card[href='{href}']")
            page.wait_for_selector("#app h1")
            check(f"(r) card opens {href}", page.inner_text("#app h1") == title, page.inner_text("#app h1"))
        for path, link in (("glossary/", "[data-back]"), ("references/", "[data-back]"), ("staffing-calculator/", "[data-back]"), ("agent-lifecycle/", "[data-kb-link]"), ("sop-library/", "[data-kb-link]")):
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
                for path in ("", "glossary/", "references/", "staffing-calculator/", "sop-library/", "sop-library/#coaching-6"):
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
        pdf = page.request.get(HUB + "references/" + page.get_attribute("a[data-codex-pdf]", "href").lstrip("./"))
        check("(x) Codex PDF is served", pdf.status == 200 and pdf.headers.get("content-type", "").startswith("application/pdf"), str(pdf.status))

        # (w) the language chosen in the course carries over
        page.goto(HUB + "agent-lifecycle/")
        page.wait_for_selector("[data-lang='en']")
        page.click("[data-lang='en']")
        page.goto(HUB + "glossary/")
        page.wait_for_selector("#app h1")
        check("(w) glossary follows the course language", page.inner_text("#app h1") == "Glossary", page.inner_text("#app h1"))
        check("(w) English glossary needs no translation note", not page.is_visible("[data-translation-note]"))
        check("(w) English glossary lists every term", page.locator("[data-term]").count() == 46, str(page.locator("[data-term]").count()))
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
        SOP_STEPS = {"escalation": 10, "coaching": 11, "pip": 11, "calibration": 11}
        LABELS_FIT = """[...document.querySelectorAll('[data-node]:not(.is-hidden)')].every((g) => {
            const r = g.querySelector('rect').getBoundingClientRect();
            const t = g.querySelector('text').getBoundingClientRect();
            return t.left >= r.left - 0.5 && t.right <= r.right + 0.5;
        })"""
        page = new_page(browser, errors)
        page.goto(SOP)
        page.wait_for_selector("[data-sop-list]")
        check("(s1) list shows four SOPs", page.locator("[data-sop-list] a[data-sop]").count() == 4)
        page.screenshot(path=str(OUT / "sop-list-390.png"), full_page=True)
        ids = list(SOP_STEPS)
        for i, (sop, steps) in enumerate(SOP_STEPS.items()):
            page.goto(SOP + f"#{sop}-0")
            page.wait_for_selector("[data-counter]")
            check(f"(s1) {sop} starts at 1 / {steps}", page.inner_text("[data-counter]") == f"1 / {steps}", page.inner_text("[data-counter]"))
            check(f"(s1) {sop} is {i + 1} of 4", page.inner_text(".eyebrow") == f"{i + 1} / 4")
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
            page.click(f"[data-question='{sop}-q1'] [data-option='b']")
            check(f"(s1) {sop} connection waits for both answers", not page.is_visible("[data-connection]"))
            page.click(f"[data-question='{sop}-q2'] [data-option='a']")
            check(f"(s1) {sop} wrong answer is marked", page.locator(f"[data-question='{sop}-q2'] .explanation.is-wrong").count() == 1)
            page.click(f"[data-question='{sop}-q2'] [data-option='b']")
            check(f"(s1) {sop} connection card shown", page.is_visible("[data-connection]"))
            page.click("[data-next-lesson]")
            if i < 3:
                page.wait_for_function(f"location.hash === '#{ids[i + 1]}-0'")
            else:
                page.wait_for_selector("[data-sop-list]")
                check("(s4) the last SOP returns to the list", page.url.endswith("#home"), page.url)
        done = page.locator("[data-sop-list] a.is-done").count()
        check("(s3) all four SOPs marked done", done == 4, str(done))
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
            check(f"(s5) {bad} opens the list", page.locator("[data-sop-list]").count() == 1)
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

        # (v) storage blocked
        page = new_page(browser, errors, init=BLOCK_STORAGE)
        for path, ko, en in (("glossary/", "용어집", "Glossary"), ("references/", "참고 자료", "References"), ("staffing-calculator/", "인력 산정 실험실", "Staffing Lab"), ("sop-library/", "SOP 라이브러리", "SOP Library")):
            page.goto(HUB + path)
            page.wait_for_selector("#app h1")
            check(f"(v) {path} opens in Korean with storage blocked", page.inner_text("#app h1") == ko)
            page.click("[data-lang='en']")
            page.wait_for_function(f"document.querySelector('#app h1')?.textContent === '{en}'")
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
