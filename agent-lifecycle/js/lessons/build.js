// Small helpers that keep lesson files readable.
// tx('한국어', 'English') makes a text entry; English is added after the
// Korean copy is approved.
export const tx = (ko, en) => (en ? { ko, en } : { ko });
export const node = (id, ko, x, y, en) => ({ id, label: tx(ko, en), x, y });
export const edge = (from, to) => ({ id: `${from}-${to}`, from, to });
export const step = (caption, show, highlight, persona) => ({ caption, show, highlight, persona });
export const option = (id, text) => ({ id, text });

// Content that shows only on one support track ('general' or 'tech').
export const trackStep = (track, caption, show, highlight, persona) => ({ ...step(caption, show, highlight, persona), track });
export const trackQuestion = (track, question) => ({ ...question, track });
