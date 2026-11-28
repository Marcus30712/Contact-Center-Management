// Writes every body sentence the cast pills change, before → after, for review.
// Run: node tools/cast_review.mjs > docs/superpowers/reviews/2026-11-28-cast-transform-review.md
import { COURSE_INFO } from '../shared/courses.js';
import { castOf, segments, bodyTexts } from '../shared/cast.js';

const show = (text, lang, cast) => segments(text, lang, cast).map((s) => (typeof s === 'string' ? s : `[${s.label}]`)).join('');
const out = ['# 등장인물 · 본문 직급 표시 — 바뀌는 문장 전체 (검토용)', '', '`[직급]`은 화면에서 색 테두리 알약으로 보이는 부분입니다. 따옴표 안의 이름은 바꾸지 않습니다.', ''];
let count = 0;
for (const [id, course] of Object.entries(COURSE_INFO)) {
  out.push(`## ${id}`, '');
  for (const lesson of course.lessons) {
    const cast = castOf(lesson);
    if (!cast.length) continue;
    out.push(`### ${lesson.title.ko} / ${lesson.title.en}`, '', `등장인물: ${cast.map((p) => `${p.name.ko} (${p.role.ko})`).join(' · ')} — People: ${cast.map((p) => `${p.name.en} (${p.role.en})`).join(' · ')}`, '');
    for (const t of bodyTexts(lesson)) {
      for (const lang of ['ko', 'en']) {
        const after = show(t[lang], lang, cast);
        if (after === t[lang]) continue;
        out.push(`- ${lang}: ${after}`);
        count += 1;
      }
    }
    out.push('');
  }
}
out.splice(3, 0, `바뀌는 문장 ${count}개.`, '');
console.log(out.join('\n'));
