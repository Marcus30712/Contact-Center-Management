// Checkpoint options in a per-question shuffled order (2026-11-26). The
// approved copy mostly keeps the right answer at b; showing the options in a
// fixed shuffle keeps the copy as approved while the position gives nothing
// away. The seed is the question's id and Korean prompt (ids repeat across
// courses), so a question looks the same on the lesson, in Today's Practice and
// on every visit. Same idea as Excel's displayOrder (excel/engine.js).
function hash(text) {
  let h = 2166136261;
  for (const c of text) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return h >>> 0;
}

export function orderedOptions(q) {
  const order = q.options.map((_, i) => i);
  let h = hash(`options|${q.id}|${q.prompt?.ko ?? ''}`);
  for (let i = order.length - 1; i > 0; i -= 1) {
    h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0;
    const j = h % (i + 1);
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order.map((i) => q.options[i]);
}
