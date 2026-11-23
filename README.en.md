# Queuecraft

[한국어](README.md) · **English**

**👉 [Open the app](https://marcus30712.github.io/Contact-Center-Management/)**

A learning app on contact center operations management for new team leads: a collection of interactive lessons, one topic at a time. Add it to your phone's home screen to use it like an app; once opened, it also works offline. Miso Kim, a senior manager, greets you on the home screen and helps you pick up where you left off.

| Topic | Folder | What it is |
|---|---|---|
| Situation Guide | [`guide/`](guide/) | Pick one of 18 situations and get the lesson, SOP or one-pager to read first (Korean/English) |
| Today's Practice | [`practice/`](practice/) | Three questions a day from the lessons you've finished (lifecycle, SOP, Excel), term cards, a weekday streak and 10 badges. Miso reacts with her face (Korean/English). Records stay on your phone |
| Miso's Excel Practice | [`excel/`](excel/) | 11 Excel skills every team lead uses (from cell addresses to SUMIFS, XLOOKUP, pivot tables and conditional formatting), plus 5 advanced lessons that mix the functions you've learned. No typing: tap cards and cells to build formulas, graded by really calculating them on Miso's team call log (example) (Korean/English) |
| The Agent Lifecycle | [`agent-lifecycle/`](agent-lifecycle/) | A six-stage course for new team leads (Korean/English) |
| SOP Library | [`sop-library/`](sop-library/) | Lessons that walk through the SOPs a team lead needs to know, step by step (Korean/English) |
| Codex One-Pagers | [`codex/`](codex/) | The four chapters of the Codex (operations optimisation principles, the five core teams, the career matrix, daily work by role), one page each; tap for detail (Korean/English) |
| Staffing Lab | [`staffing-calculator/`](staffing-calculator/) | A practice screen to learn staffing with sliders (30-minute interval), and a channel comparison tab that sets phone, chat and email side by side: staff needed, weekly/monthly hours and overtime. The maths is in `staffing-calculator/erlang.js` and `channels.js` |
| Glossary | [`glossary/`](glossary/) | 49 operations terms to search and browse by category. The terms are in `glossary/terms.js` |
| References | [`references/`](references/) | The source material (BPO Contact Center Operation Codex 2.0) and the public sources consulted |
| Privacy Policy | [`privacy/`](privacy/) | States that the app collects no personal data and keeps records on the device only. The address used for store listings (Korean/English) |
| Settings | [`settings/`](settings/) | Language, appearance (system, light, dark), backup (export and import a file), offline status, how to add to the home screen, version. The fifth tab of the bottom menu (Korean/English) |

- Home: `index.html` (Miso's greeting, My learning, Learn and Browse cards). Every page shares the bottom menu (Home, Learn, Guide, Browse, Settings) (`shared/`)
- Install and offline: `manifest.webmanifest`, `sw.js`. After changing a page file, rebuild `sw.js` with `python3 tools/sw_list.py`
- Miso Kim artwork: made by Marcus Shim with Google Gemini, under CC BY-NC-ND 4.0 (`assets/miso/`, originals in `art/miso/`)
- Design documents and plans: `docs/superpowers/` (mostly in Korean)
- Change log: [`LOG.md`](LOG.md) (Korean)
- To add a topic, add a folder and one more card to the list in `home/data.js`.

A static site with no build step. To deploy on GitHub Pages, choose the root folder (`/`) of the default branch under Settings → Pages.

## Licence

| What | Licence | File |
|---|---|---|
| Code (rendering code, calculators, tests, tools) | MIT | [`LICENSE`](LICENSE) |
| Lesson content, copy and data (`agent-lifecycle/js/lessons/`, `sop-library/lessons/`, `codex/data/`, `glossary/terms.js`, `guide/data.js`, `practice/data.js`, `excel/data.js` and others), design and copy documents (`docs/`), Miso Kim artwork (`assets/miso/`, `art/miso/`, `icons/`) | CC BY-NC-ND 4.0 | [`LICENSE-CONTENT`](LICENSE-CONTENT) |

- CC BY-NC-ND 4.0: you may share it unchanged, non-commercially, with credit ("Marcus Shim, Queuecraft"). See `LICENSE-CONTENT` for the full scope.
- Versions published under MIT before 20 November 2026 remain MIT.
