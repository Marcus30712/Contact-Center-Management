// 등장인물 줄 · 본문 직급 표시 (2026-11-28). The people who appear in lessons,
// and a display-time rewrite of body text: a name becomes a role pill
// (하린에게 → [직무전문가]에게, "Give Harin" → "Give the [SME]"). Lesson files and
// copy docs keep the names; only what is drawn changes.
// Spec: docs/superpowers/specs/2026-11-28-cast-and-roles-design.md

const p = (ko, en, roleKo, roleEn, roleKey) => ({ name: { ko, en }, role: { ko: roleKo, en: roleEn }, roleKey });

// In role order; the cast row keeps this order.
export const CAST = [
  p('지민', 'Jimin', '상담사', 'Agent', 'agent'),
  p('서준', 'Seojun', '상담사', 'Agent', 'agent'),
  p('준호', 'Junho', '선임 상담사', 'Senior agent', 'agent'),
  p('하린', 'Harin', '직무전문가', 'SME', 'sme'),
  p('도현', 'Dohyun', '품질전문가', 'QA', 'qa'),
  p('유나', 'Yuna', '트레이너', 'Trainer', 'qa'),
  p('수진', 'Sujin', '팀장', 'TL', 'tl'),
  p('유키', 'Yuki', '팀장', 'TL', 'tl'),
  p('태오', 'Taeo', '팀장', 'TL', 'tl'),
  p('민석', 'Minseok', '부매니저', 'AM', 'am'),
  p('정은', 'Jeongeun', '매니저', 'Manager', 'mgr'),
];

export const CAST_UI = { label: { ko: '등장인물', en: 'People' } };

// Words that name a role in running text, folded into the pill with the name.
const ROLE_WORDS = {
  ko: { 상담사: ['선임 상담사', '상담사'], '선임 상담사': ['선임 상담사', '선임'], 지원자: ['지원자'], 직무전문가: ['직무전문가'], 품질전문가: ['품질전문가', 'QA'], 트레이너: ['트레이너'], 팀장: ['팀장'], 부매니저: ['부매니저'], 매니저: ['매니저'] },
  en: { Applicant: ['applicant'], Agent: ['senior agent', 'agent'], 'Senior agent': ['senior agent'], SME: ['SME'], QA: ['QA'], Trainer: ['trainer'], TL: ['team leader', 'TL'], AM: ['assistant manager', 'AM'], Manager: ['project manager', 'manager'] },
};

const HANGUL = /[가-힣]/;
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Every body text of a lesson, both languages.
export function bodyTexts(lesson) {
  const out = [];
  for (const s of lesson.steps ?? []) if (s.caption) out.push(s.caption);
  for (const q of lesson.checkpoint ?? []) {
    out.push(q.prompt, q.explanation);
    for (const o of q.options ?? []) { out.push(o.text); if (o.feedback) out.push(o.feedback); }
  }
  if (lesson.connection?.text) out.push(lesson.connection.text);
  return out.filter(Boolean);
}

function mentions(text, person) {
  const re = new RegExp(esc(person.name.ko), 'g');
  for (const m of text.matchAll(re)) {
    const before = text[m.index - 1];
    if (!before || !HANGUL.test(before)) return true;
  }
  return false;
}

// A person can hold another role in one lesson: Jimin has moved to QA in the
// later SOPs and is still an applicant while being hired. Keyed by lesson title.
const QA_ROLE = { role: { ko: '품질전문가', en: 'QA' }, roleKey: 'qa' };
export const ROLE_OVERRIDES = {
  캘리브레이션: { 지민: QA_ROLE },
  '대규모 이슈 대응': { 지민: QA_ROLE },
  '신규 프로젝트 론칭': { 지민: QA_ROLE },
  '채용 및 선발': { 지민: { role: { ko: '지원자', en: 'Applicant' }, roleKey: 'agent' } },
};

// The people a lesson mentions (Korean text decides), in CAST order.
export function castOf(lesson) {
  const texts = bodyTexts(lesson).map((t) => t.ko ?? '');
  const over = ROLE_OVERRIDES[lesson.title?.ko] ?? {};
  return CAST.filter((person) => texts.some((t) => mentions(t, person)))
    .map((person) => (over[person.name.ko] ? { ...person, ...over[person.name.ko] } : person));
}

// The person as this lesson sees them (with any role override).
const personIn = (cast, test) => cast.find(test) ?? CAST.find(test);

function label(person, lang, cast) {
  const shared = cast.filter((c) => c.role.ko === person.role.ko).length > 1;
  if (!shared) return person.role[lang];
  return lang === 'ko' ? `${person.name.ko} ${person.role.ko}` : `${person.role.en} ${person.name.en}`;
}

// Ranges inside double quotes ("…" or “…”) are left alone.
function quoted(text) {
  const spans = [];
  for (const re of [/"[^"]*"/g, /“[^”]*”/g]) for (const m of text.matchAll(re)) spans.push([m.index, m.index + m[0].length]);
  return (i) => spans.some(([a, b]) => i >= a && i < b);
}

const PARTICLES = [['으로', '로'], ['이나', '나'], ['이랑', '랑'], ['은', '는'], ['이', '가'], ['을', '를'], ['과', '와']];
// What may follow a particle inside the same word (과의, 로서, 으로부터, 이랑도).
const FOLLOW = { 으로: /^(서|부터|는|도|만)/, 로: /^(서|부터|는|도|만)/, 과: /^(의|는|도)/, 와: /^(의|는|도)/, 이랑: /^(은|도|의)/, 랑: /^(은|도|의)/ };
function hasBatchim(word) {
  const c = word.charCodeAt(word.length - 1);
  return c >= 0xac00 && c <= 0xd7a3 && (c - 0xac00) % 28 !== 0;
}
function particleFor(after, word) {
  for (const [withB, without] of PARTICLES) {
    for (const form of [withB, without]) {
      if (!after.startsWith(form)) continue;
      const next = after[form.length];
      if (next && HANGUL.test(next) && !FOLLOW[form]?.test(after.slice(form.length))) continue;
      return { length: form.length, text: hasBatchim(word) ? withB : without };
    }
  }
  return null;
}

function koSegments(text, cast) {
  const inQuote = quoted(text);
  const out = [];
  let at = 0;
  const names = CAST.map((c) => esc(c.name.ko)).join('|');
  const roleAlt = [...new Set(Object.values(ROLE_WORDS.ko).flat())].sort((a, b) => b.length - a.length).map(esc).join('|');
  const re = new RegExp(`(?:(${roleAlt}) )?(${names})(?: (${roleAlt}))?`, 'g');
  for (const m of text.matchAll(re)) {
    const person = personIn(cast, (c) => c.name.ko === m[2]);
    const words = ROLE_WORDS.ko[person.role.ko];
    let start = m.index;
    let end = m.index + m[0].length;
    const nameAt = m.index + (m[1] ? m[1].length + 1 : 0);
    // Only a whole name, and only a role word that is this person's.
    const prev = text[nameAt - 1];
    if (prev && HANGUL.test(prev) && !m[1]) continue;
    if (m[1] && !words.includes(m[1])) start = nameAt;
    const trail = m[3] && words.includes(m[3]);
    if (m[3] && !trail) end = nameAt + m[2].length;
    if (start < at || inQuote(nameAt)) continue;
    const lab = label(person, 'ko', cast);
    out.push(text.slice(at, start), { label: lab, roleKey: person.roleKey, person });
    at = end;
    if (!trail) {
      const pt = particleFor(text.slice(end), lab);
      if (pt) { out.push(pt.text); at = end + pt.length; }
    }
  }
  out.push(text.slice(at));
  return out;
}

const DETERMINERS = /\b(the|a|an|your|our|his|her|their|new|experienced|senior|another|each|every)\s+$/i;

function enSegments(text, cast) {
  const inQuote = quoted(text);
  const out = [];
  let at = 0;
  const names = CAST.map((c) => esc(c.name.en)).join('|');
  const roleAlt = [...new Set(Object.values(ROLE_WORDS.en).flat())].sort((a, b) => b.length - a.length).map(esc).join('|');
  const re = new RegExp(`(?:\\b(the |a )?(${roleAlt}) )?\\b(${names})\\b((,)? (?:the|her|his|your|their|our)(?: new| experienced)? (${roleAlt})\\b(,(?= ))?| from QA)?`, 'gi');
  for (const m of text.matchAll(re)) {
    const person = personIn(cast, (c) => c.name.en === m[3]);
    if (!person) continue;
    const words = ROLE_WORDS.en[person.role.en].map((w) => w.toLowerCase());
    const nameAt = m.index + (m[2] ? (m[1] ?? '').length + m[2].length + 1 : 0);
    let start = m.index;
    let lead = m[1] ?? '';
    if (m[2] && !words.includes(m[2].toLowerCase())) { start = nameAt; lead = ''; }
    let end = nameAt + m[3].length;
    // ", her TL," / " the SME" / " from QA" after the name say the role again: fold them in.
    // A comma after them is the sentence's own unless one also opened the apposition.
    const folds = m[4] && (m[4] === ' from QA' ? person.roleKey === 'qa' : words.includes((m[6] ?? '').toLowerCase()));
    // Keep that closing comma too when a new clause starts after it ("with Jeongeun, the manager, Minseok writes").
    const keepComma = m[7] && (!m[5] || /^\s*[A-Z]/.test(text.slice(m.index + m[0].length)));
    if (folds) end = nameAt + m[3].length + m[4].length - (keepComma ? 1 : 0);
    if (start < at || inQuote(nameAt)) continue;
    const lab = label(person, 'en', cast);
    let before = text.slice(at, start);
    if (!lab.includes(person.name.en) && !lead && !DETERMINERS.test(text.slice(0, start))) {
      const head = text.slice(0, start).trimEnd();
      const startOfSentence = head === '' || /[.?!:]$/.test(head) || /(^|\s)[“"]$/.test(head);
      before += startOfSentence ? 'The ' : 'the ';
    }
    // A consumed "the" ("the team leader Taeo") stays in front of the pill.
    out.push(before + lead, { label: lab, roleKey: person.roleKey, person });
    at = end;
  }
  out.push(text.slice(at));
  return out;
}

// Sentences that introduce who is who, or where the role is already said
// beside the name, keep the names: a pill there would say "the TL is the [TL]".
// Matched by a piece of the sentence, either language.
export const KEEP_NAMES = [
  '이제 QA입니다', 'is in QA now', 'QA인 지민', 'now in QA', '지민에게 QA 직무를 제안', 'suggest the QA role to Jimin', 'QA가 된 지민',
  '준호의 경험은 팀의 자원', "Junho's experience is a resource", '준호는 선임으로', 'Junho, as a senior agent',
  '준호 같은 선임 상담사', 'a senior agent like Junho', '지민 같은 상담사에게', 'an agent like Jimin',
  '이미 선임이 된 준호', 'already has a senior, Junho', 'Seojun, a regular agent',
  '시간이 흘러 지민은', 'is an agent the team relies on', "In Minseok's first week as AM", "Dohyun's QA records", 'Follow one applicant',
  '첫 주에는 사람을 익히는', 'Spend the first week learning who is who',
  '서준은 입사 3주 차', 'Seojun is a trainee',
  '준호는 팀의 선임 상담사입니다', "Junho is the team's senior agent",
  '지민은 이제 정식 상담사입니다', 'Jimin is now a regular agent',
  '지민은 2년째 일하는 상담사입니다', 'Jimin has been an agent for two years',
];

// "QA" naming the people who score quality (no name given) is a pill too:
// 품질전문가 in Korean, QA in English. QA as a score, a definition, a role name
// or a course name stays text.
const QA_PERSON = { name: { ko: '', en: '' }, role: { ko: '품질전문가', en: 'QA' }, roleKey: 'qa' };
const QA_NOT = {
  ko: /^(?: (?:점수|정확도|결과|평가|품질|일|직무|담당|자리|지원|전환|도현)|\()/,
  en: /^(?: (?:score|scores|accuracy|results?|records?|quality|support|role|analyst|analysis|staff|work|review|evaluation)\b| ?\()/,
};
function qaPills(text, lang) {
  const inQuote = quoted(text);
  const out = [];
  let at = 0;
  const re = lang === 'ko' ? /(?<![A-Za-z])QA(?![A-Za-z])/g : /\bQA\b/g;
  for (const m of text.matchAll(re)) {
    if (inQuote(m.index) || QA_NOT[lang].test(text.slice(m.index + 2))) continue;
    out.push(text.slice(at, m.index), { label: QA_PERSON.role[lang], roleKey: 'qa', person: QA_PERSON });
    at = m.index + 2;
  }
  out.push(text.slice(at));
  return out;
}

// text: one language's string. Returns strings and pills { label, roleKey, person }.
export function segments(text, lang, cast) {
  if (KEEP_NAMES.some((k) => text.includes(k))) return [text];
  const parts = (lang === 'ko' ? koSegments(text, cast) : enSegments(text, cast))
    .flatMap((part) => (typeof part === 'string' ? qaPills(part, lang) : [part]));
  const merged = [];
  for (const part of parts) {
    if (part === '') continue;
    if (typeof part === 'string' && typeof merged[merged.length - 1] === 'string') merged[merged.length - 1] += part;
    else merged.push(part);
  }
  return merged;
}
