# CX Replay

[한국어](README.md) · **English**

**👉 [Open the app](https://marcus30712.github.io/Contact-Center-Management/)**

A learning app for getting ready for your next contact center role, from agent to manager. On first open you pick the role you are preparing for (Agent, SME, Team Lead, Assistant Manager, Operation Manager); that role's course comes first, and you can change it in Settings. It is a collection of interactive lessons, one topic at a time. Add it to your phone's home screen to use it like an app; once opened, it also works offline. Miso Kim, a senior manager, greets you on the home screen and helps you pick up where you left off.

| Topic | Folder | What it is |
|---|---|---|
| Situation Guide | [`guide/`](guide/) | Pick one of 18 situations and get the lesson, SOP or one-pager to read first (Korean/English) |
| SME Situation Guide | [`sme-guide/`](sme-guide/) | Pick one of 16 situations a new SME meets and get the SME lesson or SOP to read first (Korean/English) |
| Agent Situation Guide | [`agent-guide/`](agent-guide/) | Pick one of 16 situations a new agent meets and get the agent lesson or SOP to read first (Korean/English) |
| Today's Practice | [`practice/`](practice/) | Three questions a day from the lessons you've finished (three agent courses, four TL courses, three SME courses, Excel), term cards, a weekday streak and 13 badges. Miso reacts with her face (Korean/English). Records stay on your phone |
| Miso's Excel Practice | [`excel/`](excel/) | 11 Excel skills every team lead uses (from cell addresses to SUMIFS, XLOOKUP, pivot tables and conditional formatting), plus 5 advanced lessons that mix the functions you've learned. No typing: tap cards and cells to build formulas, graded by really calculating them on Miso's team call log (example) (Korean/English) |
| TL First Steps | [`tl/`](tl/) | Seven lessons for new team leaders: the roster, individual results, listening to calls and reading tickets, the team's contribution, first one-on-ones, and getting direction from the AM or OM (Korean/English) |
| Agent First Steps | [`agent/`](agent/) | Eight lessons for new agents: the first day, training, how to ask, the first call, difficult customers, score reviews, attendance and getting comfortable (Korean/English) |
| Agent Career Lifecycle | [`agent-career/`](agent-career/) | Four lessons up the operations-team ladder: getting ready for SME, the SME role, getting ready for team leader, the team leader role (Korean/English) |
| Agent SOP Library | [`agent-sop/`](agent-sop/) | Eight standard procedures an agent follows: requesting an escalation, handling abusive callers and ending the call, reporting an absence or sick day, applying a client update from the huddle, reporting a knowledge base error, taking scrubbing feedback, disputing a quality score and responding to a system outage (Korean/English) |
| AM First Steps | [`am/`](am/) | Eight lessons for new assistant managers: managing team leaders, passing on instructions, checking escalation reports, preparing business reviews, gathering client requests, covering for the manager and mentoring new team leaders (Korean/English) |
| AM SOP Library | [`am-sop/`](am-sop/) | The eight standard procedures an assistant manager repeats every week and month: the weekly meeting, passing on instructions, checking escalation reports, the risk register, business review prep, client requests, team leader backups and covering for the manager (Korean/English) |
| The Agent Lifecycle | [`agent-lifecycle/`](agent-lifecycle/) | A six-stage course for new team leads (Korean/English) |
| TL Support Lifecycle | [`tl-support/`](tl-support/) | Five lessons on how a team leader supports agents, the SME, QA, trainers and the whole team (Korean/English) |
| SME First Steps | [`sme/`](sme/) | Seven lessons for agents who have just become SMEs: the first day; supporting new hires, existing agents, former peers and the team leader; when requests pile up; giving knowledge back (Korean/English) |
| SME Support Lifecycle | [`sme-lifecycle/`](sme-lifecycle/) | Five lessons on the support procedure an SME follows at each stage as one agent grows from training through Nesting and regular work to senior, plus supporting the team leader (Korean/English) |
| SME SOP Library | [`sme-sop/`](sme-sop/) | Eight standard procedures an SME runs: escalation approval, scrubbing, contact trend summaries, covering attendance, client update huddles, calibration, VOC reporting and knowledge base update requests (Korean/English) |
| Review Quiz | [`review/`](review/) | Six scenario questions that open once your role's courses are done (team lead: Lifecycle and TL SOP; SME: SME First Steps; agent: Agent First Steps and Agent SOP). Pass with 5 or more right to earn a badge (Korean/English) |
| TL SOP Library | [`sop-library/`](sop-library/) | Lessons that walk through the SOPs a team lead needs to know, step by step (Korean/English) |
| Codex One-Pagers | [`codex/`](codex/) | The four chapters of the Codex (operations optimisation principles, the five core teams, the career matrix, daily work by role), one page each; tap for detail (Korean/English) |
| Staffing Lab | [`staffing-calculator/`](staffing-calculator/) | A practice screen to learn staffing with sliders (30-minute interval), and a channel comparison tab that sets phone, chat and email side by side: staff needed, weekly/monthly hours and overtime. The maths is in `staffing-calculator/erlang.js` and `channels.js` |
| Glossary | [`glossary/`](glossary/) | 49 operations terms to search and browse by category. The terms are in `glossary/terms.js` |
| References | [`references/`](references/) | The source material (BPO Contact Center Operation Codex 2.0) and the public sources consulted |
| Privacy Policy | [`privacy/`](privacy/) | States that the app collects no personal data and keeps records on the device only. The address used for store listings (Korean/English) |
| Settings | [`settings/`](settings/) | Language, your role, appearance (system, light, dark), backup (export and import a file), offline status, how to add to the home screen, version. The fifth tab of the bottom menu (Korean/English) |

- Home: `index.html` (Miso's greeting, My learning, Today's Practice, the situation guide, Learn). Every role gets the same layout; only the guide and Learn cards change by role (`home/role-home.js`), and courses not built yet show as "Coming soon" cards. The Browse cards have their own page, `browse/`. Every page shares the bottom menu (Home, Learn, Guide, Browse, Settings) (`shared/`)
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
| Lesson content, copy and data (`agent-lifecycle/js/lessons/`, `sop-library/lessons/`, `codex/data/`, `glossary/terms.js`, `guide/data.js`, `sme-guide/data.js`, `agent-guide/data.js`, `practice/data.js`, `excel/data.js`, `sme/lessons/`, `sme-lifecycle/lessons/`, `sme-sop/lessons/`, `tl/lessons/`, `tl-support/lessons/`, `agent/lessons/`, `agent-career/lessons/`, `agent-sop/lessons/`, `am/lessons/` and others), design and copy documents (`docs/`), Miso Kim artwork (`assets/miso/`, `art/miso/`, `icons/`) | CC BY-NC-ND 4.0 | [`LICENSE-CONTENT`](LICENSE-CONTENT) |

- CC BY-NC-ND 4.0: you may share it unchanged, non-commercially, with credit ("Marcus Shim, CX 2회차 (CX Replay)"). See `LICENSE-CONTENT` for the full scope.
- Versions published under MIT before 20 November 2026 remain MIT.
