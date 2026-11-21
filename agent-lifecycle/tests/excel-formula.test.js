import { test } from 'node:test';
import assert from 'node:assert/strict';
import { evaluate } from '../../excel/formula.js';

const ROWS = [
  ['S01', '김하늘', 'A팀', 52, 15600, 44, 55],
  ['S02', '이도윤', 'B팀', 47, 13160, 38, 45],
  ['S03', '박서연', 'A팀', 61, 17080, 55, 55],
  ['S04', '최지호', 'B팀', 39, 12480, 30, 45],
  ['S05', '정민서', 'A팀', 55, 14850, 47, 55],
  ['S06', '강예준', 'B팀', 44, 14520, 35, 45],
  ['S07', '조수아', 'A팀', 58, 15080, 51, 55],
  ['S08', '윤시우', 'A팀', 50, 16000, 42, 55],
];
const sheet = { cells: { A1: 'ID', B1: '이름', C1: '팀', D1: '콜', E1: '처리(초)', F1: '30초 내', G1: '목표' } };
ROWS.forEach((r, i) => r.forEach((v, j) => { sheet.cells[`${'ABCDEFG'[j]}${i + 2}`] = v; }));

const val = (f) => {
  const r = evaluate(f, sheet);
  assert.ok(r.ok, `${f}: ${r.error}`);
  return r.value;
};
const close = (a, b) => assert.ok(Math.abs(a - b) < 1e-9, `${a} vs ${b}`);

test('numbers, cells, ranges, $ refs and arithmetic', () => {
  assert.equal(val('=D2+1'), 53);
  assert.equal(val('=$D$2*2'), 104);
  assert.equal(val('=SUM(D2:D9)'), 406);
  assert.equal(val('=SUM($D$2:$D$9)'), 406);
  assert.equal(val('=E2/D2'), 300);
  assert.equal(val('=2+3*4'), 14);
  assert.equal(val('=(2+3)*4'), 20);
  assert.equal(val('=-D2+100'), 48);
  assert.equal(val('=F2/D2>=0.8'), true);
  assert.equal(val('=D2<G2'), true);
  assert.equal(val('=D2=52'), true);
  assert.equal(val('=D2<>52'), false);
  assert.equal(val('=B2&"님"'), '김하늘님');
  assert.equal(val('=" a "'), ' a ');
});

test('each function', () => {
  close(val('=AVERAGE(D2:D9)'), 50.75);
  assert.equal(val('=MIN(E2:E9)'), 12480);
  assert.equal(val('=MAX(D2:D9)'), 61);
  assert.equal(val('=COUNT(D2:D9)'), 8);
  assert.equal(val('=COUNT(B2:B9)'), 0);
  close(val('=ROUND(F2/D2, 2)'), 0.85);
  close(val('=ROUND(F2/D2,1)'), 0.8);
  assert.equal(val('=ROUND(F2/D2,0)'), 1);
  assert.equal(val('=COUNTIF(D2:D9, ">=50")'), 5);
  assert.equal(val('=COUNTIFS(C2:C9, "A팀", D2:D9, ">=55")'), 3);
  assert.equal(val('=COUNTIFS(D2:D9, ">=55", C2:C9, "A팀")'), 3);
  assert.equal(val('=SUMIF(C2:C9, "A팀", D2:D9)'), 276);
  assert.equal(val('=SUMIF(C2:C9, "A팀")'), 0);
  assert.equal(val('=SUMIFS(E2:E9, C2:C9, "A팀")'), 78610);
  assert.equal(val('=AVERAGEIFS(E2:E9, C2:C9, "A팀")'), 15722);
  close(val('=AVERAGEIFS(D2:D9, C2:C9, "B팀")'), 130 / 3);
  assert.equal(val('=IF(D2>=G2, "달성", "미달")'), '미달');
  assert.equal(val('=IF(D4>=G4, "달성", "미달")'), '달성');
  assert.equal(val('=IF(E9>15000, "확인", "")'), '확인');
  assert.equal(val('=IF(E2>15600, "확인", "")'), '');
  assert.equal(val('=XLOOKUP("S07", A2:A9, B2:B9)'), '조수아');
  assert.equal(val('=VLOOKUP("S02", A2:G9, 3, FALSE)'), 'B팀');
  assert.equal(val('=VLOOKUP("S08", A2:G9, 4, FALSE)'), 50);
  assert.equal(val('=INT(330/60)'), 5);
  assert.equal(val('=INT(E5/D5/60)'), 5);
  assert.equal(val('=MOD(280, 60)'), 40);
  assert.equal(val('=TEXT(E2/D2/86400, "m:ss")'), '5:00');
  assert.equal(val('=TEXT(E3/D3/86400, "m:ss")'), '4:40');
  assert.equal(val('=TEXT(SUM(F2:F9)/SUM(D2:D9), "0.0%")'), '84.2%');
  assert.equal(val('=TEXT(0.846, "0%")'), '85%');
  assert.equal(val('=FALSE'), false);
  assert.equal(val('=TRUE'), true);
  assert.equal(val('=""'), '');
});

test('criteria strings', () => {
  assert.equal(val('=COUNTIF(C2:C9, "A팀")'), 5);
  assert.equal(val('=COUNTIF(D2:D9, ">50")'), 4);
  assert.equal(val('=COUNTIF(D2:D9, "50")'), 1);
  assert.equal(val('=COUNTIF(C2:C9, "<>B팀")'), 5);
  assert.equal(val('=COUNTIF(D2:D9, "<45")'), 2);
  assert.equal(val('=COUNTIF(D2:D9, "<=44")'), 2);
});

test('cells read are reported', () => {
  const r = evaluate('=SUM(D2:D9)', sheet);
  assert.deepEqual(r.cells, ['D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9']);
  assert.deepEqual(evaluate('=F2/D2', sheet).cells, ['F2', 'D2']);
  assert.deepEqual(evaluate('=$D$2*2', sheet).cells, ['D2']);
});

test('errors never throw', () => {
  for (const f of ['=', '=)', '=SUM(', '=SUM(D2:D9 D2:D9)', '=FOO(1)', '=INT(280,60)', '=AVERAGEIFS(D2:D9,C2:C9,">=45")',
    '=B2+1', '=1/0', '=SUM(D2:D9))', '=,', '=D2:D9', '=D2 D3', '=XLOOKUP("S99", A2:A9, B2:B9)', '=VLOOKUP("S02", A2:G9, 9, FALSE)',
    '=TEXT(1, "yyyy")', '=COUNTIF(D2:D9)', 'SUM(D2:D9)', '=Z99+1', '="abc', '=IF(1)', '=MIN()']) {
    let r;
    assert.doesNotThrow(() => { r = evaluate(f, sheet); }, f);
    assert.equal(r.ok, false, f);
  }
  assert.equal(evaluate(null, sheet).ok, false);
});

test('comparing different kinds follows Excel: numbers < text < TRUE/FALSE', () => {
  assert.equal(val('=D2<"52"'), true);
  assert.equal(val('=D2="52"'), false);
  assert.equal(val('="미달">=D8'), true);
  assert.equal(val('=TRUE>"z"'), true);
  assert.equal(val('="a"="A"'), true);
});

test('Excel edges: numbers stored as text, fractional ROUND digits, VLOOKUP ignores case', () => {
  const s2 = { cells: { ...sheet.cells, H2: '52', H3: 52, H4: 'x' } };
  const v2 = (f) => { const r = evaluate(f, s2); assert.ok(r.ok, `${f}: ${r.error}`); return r.value; };
  assert.equal(v2('=COUNTIF(H2:H4, "52")'), 2, 'text "52" and number 52 both match "52"');
  assert.equal(v2('=COUNTIF(H2:H4, ">50")'), 1, 'a comparison only counts real numbers');
  assert.equal(val('=ROUND(1.5, 0.5)'), 2, 'digits are truncated to whole numbers');
  assert.equal(val('=VLOOKUP("s02", A2:G9, 2, FALSE)'), '이도윤');
});

// ---------- 2026-11-21: functions for the advanced lessons ----------
test('AND, OR and IFERROR', () => {
  assert.equal(val('=AND(1>0, 2>3)'), false);
  assert.equal(val('=AND(D4>=G4, F4/D4>=0.85)'), true);
  assert.equal(val('=OR(1>0, 2>3)'), true);
  assert.equal(val('=OR(D2>=G2, F2/D2>=0.85)'), false);
  assert.equal(val('=IF(OR(D2<G2, F2/D2<0.8), "점검", "")'), '점검');
  assert.equal(evaluate('=AND()', sheet).ok, false);
  assert.equal(val('=IFERROR(XLOOKUP("S99", A2:A9, D2:D9), "없음")'), '없음');
  assert.equal(val('=IFERROR(XLOOKUP("S03", A2:A9, D2:D9), "없음")'), 61);
  assert.equal(val('=IFERROR(1/0, 0)'), 0);
  assert.equal(val('=IFERROR(5, 0)'), 5);
  assert.equal(evaluate('=IFERROR(1/0)', sheet).ok, false, 'two values are needed');
  assert.equal(evaluate('=IF(XLOOKUP("S09", A2:A9, D2:D9), "없음")', sheet).ok, false, 'IF does not catch errors');
});

test('AND/OR work out every condition and take ranges; IFERROR catches only errors Excel also gives', () => {
  assert.equal(evaluate('=AND(1>2, 1/0)', sheet).ok, false, 'Excel gives #DIV/0! here too');
  assert.equal(evaluate('=OR(1>0, 1/0)', sheet).ok, false);
  assert.equal(val('=AND(D2:D3)'), true, 'numbers in a range count; nonzero is TRUE');
  assert.equal(val('=OR(B2:B3, 0)'), false, 'text in a range is skipped');
  assert.equal(evaluate('=AND(B2:B3)', sheet).ok, false, 'a range with no numbers or TRUE/FALSE is an error');
  assert.equal(val('=IFERROR(1/0, "x")'), 'x');
  assert.equal(val('=IFERROR(XLOOKUP("S99", A2:A9, D2:D9), "x")'), 'x');
  assert.equal(val('=IFERROR(AVERAGEIFS(D2:D9, C2:C9, "C팀"), "x")'), 'x');
  assert.equal(evaluate('=IFERROR(VLOOKUP("S02", A2:G9, 3, TRUE), "x")', sheet).ok, false, 'a limit of this calculator is not hidden');
  assert.equal(evaluate('=IFERROR(ROUND(1), "x")', sheet).ok, false, 'Excel refuses a wrong number of values outright');
});
