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
            page = new_page(browser, errors, width=width)
            for hash_ in ["#home"] + [f"#{l}-0" for l in LESSONS]:
                open_at(page, base, hash_)
                overflow = page.evaluate("document.documentElement.scrollWidth - window.innerWidth")
                check(f"(a) no horizontal scroll {width}px {hash_}", overflow <= 0, f"overflow={overflow}")
            page.context.close()

        page = new_page(browser, errors)

        # (c) unknown lesson -> home
        open_at(page, base, "#nope-3")
        check("(c) bad lesson id shows home", page.locator("[data-stage-list] a").count() == 6)

        # (d) step past the end -> last step
        open_at(page, base, "#hiring-99")
        check("(d) step clamps to last", page.inner_text("[data-counter]") == "8 / 8", page.inner_text("[data-counter]"))

        # (i) full run of lesson 1: steps -> checkpoint -> connection -> home shows done
        open_at(page, base, "#hiring-0")
        for _ in range(8):
            page.click("[data-next]")
        check("(i) checkpoint opens after last step", page.is_visible("[data-view='checkpoint']"))
        page.click("[data-option='a']")
        page.click("[data-option='b']")
        check("(i) one explanation shown", page.locator("[data-explanation]:visible").count() == 1)
        check("(i) connection card shown", page.is_visible("[data-connection]"))
        page.click("[data-lang='en']")
        page.wait_for_function("document.querySelector('[data-back]')?.textContent.includes('Back')")
        check("(j) checkpoint survives a language switch", page.is_visible("[data-view='checkpoint']") and page.is_visible("[data-connection]"))
        page.click("[data-lang='ko']")
        page.wait_for_function("document.querySelector('[data-back]')?.textContent.includes('이전')")
        page.click("[data-next-lesson]")
        page.wait_for_function("document.querySelector('[data-counter]')?.textContent === '1 / 7'")
        check("(i) next lesson opens", "onboarding-0" in page.url)
        page.click("[data-home]")
        page.wait_for_selector("[data-stage-list]")
        check("(i) finished lesson marked done", "is-done" in (page.get_attribute("[data-stage-list] a[data-stage='hiring']", "class") or ""))
        page.go_back()
        page.wait_for_selector("[data-counter]")
        check("(i) browser back returns to lesson", page.inner_text("[data-counter]") == "1 / 7")

        # (h) language switch keeps the step and survives reload
        open_at(page, base, "#hiring-2")
        page.click("[data-lang='en']")
        page.wait_for_function("document.querySelector('[data-next]')?.textContent.trim() === 'Next'")
        check("(h) step kept after language switch", page.inner_text("[data-counter]") == "3 / 8")
        page.reload()
        page.wait_for_selector("[data-next]")
        check("(h) language kept after reload", page.inner_text("[data-next]").strip() == "Next")
        check("(h) step kept after reload", page.inner_text("[data-counter]") == "3 / 8")
        page.context.close()

        # (g) first visit follows the browser language
        page = new_page(browser, errors, locale="ko-KR")
        open_at(page, base)
        check("(g) ko-KR starts in Korean", page.inner_text("h1") == "상담사 라이프사이클", page.inner_text("h1"))
        page.screenshot(path=str(OUT / "home-390.png"), full_page=True)
        open_at(page, base, "#nesting-4")
        page.wait_for_timeout(500)
        page.screenshot(path=str(OUT / "lesson-390.png"), full_page=True)
        page.context.close()

        page = new_page(browser, errors, locale="en-US")
        open_at(page, base)
        check("(g) en-US starts in English", page.inner_text("h1") == "The Agent Lifecycle", page.inner_text("h1"))
        note_visible = page.is_visible("[data-translation-note]")
        check("(g) English translation note", note_visible == EXPECT_TRANSLATION_NOTE, f"visible={note_visible}")
        for width in (320, 390):
            page.set_viewport_size({"width": width, "height": 780})
            for hash_ in ["#home", "#hiring-1", "#nesting-5", "#career-7"]:
                open_at(page, base, hash_)
                overflow = page.evaluate("document.documentElement.scrollWidth - window.innerWidth")
                check(f"(k) English no horizontal scroll {width}px {hash_}", overflow <= 0, f"overflow={overflow}")
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
        check("(e) lesson renders with storage blocked", page.inner_text("[data-counter]") == "1 / 8")
        page.context.close()

        # (f) desktop + dark screenshots for a human look
        page = new_page(browser, errors, width=1280, height=800)
        open_at(page, base)
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

if __name__ == "__main__":
    main()
