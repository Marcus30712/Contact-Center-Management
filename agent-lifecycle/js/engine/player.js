// Step cursor for a lesson. The index never leaves [0, stepCount - 1].
export function createPlayer(stepCount, startIndex = 0) {
  const last = Math.max(0, stepCount - 1);
  const clamp = (i) => Math.min(last, Math.max(0, Number.isFinite(i) ? Math.trunc(i) : 0));
  let index = clamp(startIndex);
  return {
    get index() { return index; },
    get atStart() { return index === 0; },
    get atEnd() { return index === last; },
    next() { index = clamp(index + 1); },
    prev() { index = clamp(index - 1); },
    goTo(i) { index = clamp(i); },
  };
}
