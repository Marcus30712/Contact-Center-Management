"""Write excel/advanced.js from the approved advanced-lesson copy files.

Run from the repository root after changing either copy file:
    python3 tools/excel_advanced.py
agent-lifecycle/tests/excel-advanced.test.js checks the result against both files.
"""
import json
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SPECS = ROOT / 'docs' / 'superpowers' / 'specs'
LANGS = {
    'ko': dict(file='2026-11-21-excel-advanced-copy.md', lesson='## 레슨 ', cards='### 설명 카드', summary='### 요약', ui='## 화면 문구',
               types={'객관식': 'choice', '빈칸': 'blank', '수식 조립': 'build'},
               keys={'질문': 'prompt', '보기': 'options', '정답': 'answer', '해설': 'explanation', '수식': 'template', '칩': 'chips',
                     '결과 값': 'result', '카드(정답 순서)': 'cards', '헷갈림 카드': 'decoys', '오답': 'wrong'}),
    'en': dict(file='2026-11-21-excel-advanced-copy.en.md', lesson='## Lesson ', cards='### Cards', summary='### Summary', ui='## Screen wording',
               types={'choice': 'choice', 'blank': 'blank', 'build': 'build'},
               keys={'Question': 'prompt', 'Options': 'options', 'Answer': 'answer', 'Explanation': 'explanation', 'Formula': 'template',
                     'Chips': 'chips', 'Result': 'result', 'Cards (answer order)': 'cards', 'Decoy cards': 'decoys', 'Wrong': 'wrong'}),
}
REQUIRES = {'12': ['4', '6'], '13': ['3', '6'], '14': ['3', '6'], '15': ['7'], '16': ['5', '8']}


def unquote(s):
    return re.sub(r'^`|`$', '', s.strip())


def items(s):
    return [unquote(x) for x in s.split(' · ')]


def args_of(cards, start):
    """Top-level arguments (as card lists) of the call opened at cards[start], and the index of its ')'."""
    depth, args, cur = 0, [], []
    for i in range(start + 1, len(cards)):
        c = cards[i]
        if c.endswith('(') and depth >= 0:
            depth += 1
        elif c == ')':
            if depth == 0:
                args.append(cur)
                return args, i
            depth -= 1
        if c == ',' and depth == 0:
            args.append(cur)
            cur = []
            continue
        cur.append(c)
    raise ValueError('unclosed call')


FLIP = {'>=': '<=', '<=': '>=', '>': '<', '<': '>', '=': '=', '<>': '<>'}


def operand_bounds(cards, k):
    """The cards left and right of the comparison at k, up to the nearest ',' or bracket at the same depth."""
    depth, i = 0, k - 1
    while i >= 0:
        c = cards[i]
        if c == ')':
            depth += 1
        elif c.endswith('('):
            if depth == 0:
                break
            depth -= 1
        elif c == ',' and depth == 0:
            break
        i -= 1
    depth, j = 0, k + 1
    while j < len(cards):
        c = cards[j]
        if c.endswith('('):
            depth += 1
        elif c == ')':
            if depth == 0:
                break
            depth -= 1
        elif c == ',' and depth == 0:
            break
        j += 1
    return i + 1, j


def one_step(cards):
    """True rewrites one change away: AND/OR conditions in the other order,
    COUNTIFS's two range/criteria pairs swapped, or a comparison written the
    other way round (A>=B as B<=A)."""
    out = []
    for i, c in enumerate(cards):
        if c in ('AND(', 'OR(', 'COUNTIFS('):
            args, end = args_of(cards, i)
            if c == 'COUNTIFS(' and len(args) == 4:
                args = [args[2], args[3], args[0], args[1]]
            elif c in ('AND(', 'OR(') and len(args) == 2:
                args = [args[1], args[0]]
            else:
                continue
            body = []
            for k, a in enumerate(args):
                body += ([','] if k else []) + a
            out.append(cards[:i + 1] + body + cards[end:])
        if c in FLIP:
            a, b = operand_bounds(cards, i)
            out.append(cards[:a] + cards[i + 1:b] + [FLIP[c]] + cards[a:i] + cards[b:])
    return out


def rewrites(cards):
    """Every card order reachable by true rewrites; any other order grades wrong."""
    seen = {tuple(cards)}
    todo = [cards]
    while todo:
        for nxt in one_step(todo.pop()):
            if tuple(nxt) not in seen and len(seen) < 64:
                seen.add(tuple(nxt))
                todo.append(nxt)
    return [list(x) for x in seen if list(x) != cards]


def parse(lang):
    t = LANGS[lang]
    lines = (SPECS / t['file']).read_text(encoding='utf8').split('\n')
    ui = {}
    for line in lines[lines.index(t['ui']) + 4:]:
        if not line.startswith('|'):
            break
        k, v = line[2:-2].split(' | ')
        ui[k] = v
    lessons, lesson, q, section = [], None, None, None
    for line in lines:
        if line.startswith(t['lesson']):
            m = re.match(r'^## \S+ (\d+) · (.+)$', line)
            lesson = dict(id=m[1], title=m[2], cards=[], summary=[], questions=[])
            lessons.append(lesson)
            section = None
        elif lesson is None:
            continue
        elif line == t['cards']:
            section = 'cards'
        elif line == t['summary']:
            section = 'summary'
        elif line.startswith('#### '):
            m = re.match(r'^#### (\d+-\d+) · (.+)$', line)
            q = dict(id=m[1], type=t['types'][m[2]], wrong=[])
            lesson['questions'].append(q)
            section = 'q'
        elif section == 'cards' and re.match(r'^\d+\. ', line):
            lesson['cards'].append(re.sub(r'^\d+\. ', '', line))
        elif section == 'summary' and line.startswith('- '):
            lesson['summary'].append(line[2:])
        elif section == 'q' and line.startswith('- '):
            i = line.index(': ')
            key = t['keys'][line[2:i]]
            if key == 'wrong':
                q['wrong'].append(line[i + 2:].split(' → '))
            else:
                q[key] = line[i + 2:]
    return ui, lessons


def run_value(formula, lang):
    # The result to store is what the calculator gives, so "284.8…" in the copy becomes the full number.
    js = ("import('./excel/formula.js').then(async (f) => { const { SHEETS } = await import('./excel/data.js');"
          f"const r = f.evaluate({json.dumps(formula)}, SHEETS.{lang}); console.log(JSON.stringify(r.ok ? r.value : null)); }})")
    return json.loads(subprocess.run(['node', '-e', js], cwd=ROOT, capture_output=True, text=True, check=True).stdout)


def main():
    (ui_ko, ko), (ui_en, en) = parse('ko'), parse('en')
    bi = lambda a, b: {'ko': a, 'en': b}
    out_lessons, feedback = [], {}
    for lk, le in zip(ko, en):
        qs = []
        for qk, qe in zip(lk['questions'], le['questions']):
            q = dict(id=qk['id'], type=qk['type'], prompt=bi(qk['prompt'], qe['prompt']), explanation=bi(qk['explanation'], qe['explanation']))
            if q['type'] in ('choice', 'blank'):
                field = 'options' if q['type'] == 'choice' else 'chips'
                a, b = items(qk[field]), items(qe[field])
                if q['type'] == 'blank':
                    q['template'] = bi(unquote(qk['template']), unquote(qe['template']))
                q[field] = [bi(x, y) for x, y in zip(a, b)]
                q['answer'] = a.index(qk['answer'])
                fb = {}
                for (pick, text_ko), (_, text_en) in zip(qk['wrong'], qe['wrong']):
                    fb[a.index(pick)] = bi(text_ko, text_en)
                feedback[q['id']] = fb
            if q['type'] == 'build':
                q['cards'] = bi(items(qk['cards']), items(qe['cards']))
                q['decoys'] = bi(items(qk['decoys']), items(qe['decoys']))
                q['result'] = bi(run_value('=' + ' '.join(q['cards']['ko']), 'ko'), run_value('=' + ' '.join(q['cards']['en']), 'en'))
                # Advanced builds grade by exact card order, plus these true rewrites.
                q['exact'] = True
                q['alternatives'] = bi(rewrites(q['cards']['ko']), rewrites(q['cards']['en']))
            elif q['type'] == 'blank':
                fill = lambda lang: q['template'][lang].replace('___', q['chips'][q['answer']][lang])
                q['result'] = bi(run_value(fill('ko'), 'ko'), run_value(fill('en'), 'en'))
            qs.append(q)
        out_lessons.append(dict(id=lk['id'], requires=REQUIRES[lk['id']], title=bi(lk['title'], le['title']),
                                cards=[bi(a, b) for a, b in zip(lk['cards'], le['cards'])],
                                summary=[bi(a, b) for a, b in zip(lk['summary'], le['summary'])], questions=qs))
    dump = lambda v: json.dumps(v, ensure_ascii=False, indent=2)
    src = ('// Miso\'s Excel practice, advanced lessons 12–16: mixing the functions learned in 1–11.\n'
           '// Generated by tools/excel_advanced.py from docs/superpowers/specs/2026-11-21-excel-advanced-copy.md\n'
           '// (Korean, approved 2026-11-21) and its English (.en.md); tests check every field against both files.\n'
           '// requires: the basic lessons that must be finished first.\n\n'
           f'export const ADVANCED_UI = {dump({k: bi(ui_ko[k], ui_en[k]) for k in ui_ko})};\n\n'
           f'export const EXCEL_ADVANCED = {dump(out_lessons)};\n\n'
           '// Why a wrong pick falls short, keyed by option or chip index (before on-screen shuffling).\n'
           f'export const ADVANCED_FEEDBACK = {dump(feedback)};\n')
    (ROOT / 'excel' / 'advanced.js').write_text(src, encoding='utf8')
    print('wrote excel/advanced.js:', len(out_lessons), 'lessons')


if __name__ == '__main__':
    main()
