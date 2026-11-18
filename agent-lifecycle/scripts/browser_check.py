"""Opens the course in a real browser and checks the things unit tests can't:
layout at phone/desktop widths, bad addresses, blocked storage, language
switching, and one full lesson run. Prints failed check names; exit 1 on any.

Usage: python3 scripts/browser_check.py   (run from the project root)
"""
import functools
import http.server
import pathlib
import sys
import threading

from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "scripts" / "out"
LESSONS = ["hiring", "onboarding", "nesting", "coaching", "retention", "career"]
TRACK_KEY = "agent-lifecycle-course:track"
STEPS = {  # steps each track sees, per lesson
    "general": {"hiring": 9, "onboarding": 10, "nesting": 9, "coaching": 12, "retention": 9, "career": 9},
    "tech": {"hiring": 10, "onboarding": 10, "nesting": 9, "coaching": 12, "retention": 9, "career": 9},
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

    handler = functools.partial(Quiet, directory=str(ROOT))
    server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    return server, f"http://127.0.0.1:{server.server_address[1]}/index.html"


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
        page.wait_for_function("document.querySelector('[data-counter]')?.textContent === '1 / 10'")
        check("(i) next lesson opens", "onboarding-0" in page.url)
        page.click("[data-home]")
        page.wait_for_selector("[data-stage-list]")
        check("(i) finished lesson marked done", "is-done" in (page.get_attribute("[data-stage-list] a[data-stage='hiring']", "class") or ""))
        page.go_back()
        page.wait_for_selector("[data-counter]")
        check("(i) browser back returns to lesson", page.inner_text("[data-counter]") == "1 / 10")

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
        open_at(page, base, "#nesting-8")
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
        page.click("[data-lang='ko']")
        bar = page.evaluate("document.querySelector('.topbar').getBoundingClientRect().height")
        check("(p) header takes at most two rows at 320px in Korean", bar <= 110, f"height={bar}")
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
        check("(e) lesson renders with storage blocked", page.inner_text("[data-counter]") == "1 / 9")
        page.click("[data-track='tech']")
        page.wait_for_function("document.querySelector('[data-track=tech]')?.getAttribute('aria-pressed') === 'true'")
        check("(e) track switch works with storage blocked", page.inner_text("[data-counter]") == "1 / 9")
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
