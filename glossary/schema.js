// Checks the glossary data. Returns a list of error messages; empty means valid.
export const CATEGORIES = ['metric', 'role', 'process', 'tool'];

// Names the hosting page may claim for its own use as #anchors.
const RESERVED = ['home', 'settings', 'sidebar', 'customize', 'upgrade', 'downloads'];
const FIGURE = /%|\d\s*(분|명|초|주|일|min|people|sec|week|day)/;
const MAX_SENTENCES = 3;
const BANNED_KO = '진상';

const filled = (s) => typeof s === 'string' && s.trim() !== '';
const sentenceCount = (s) => (s.match(/[.?!](?=\s|$)/g) || []).length;

export function validateTerms(terms, { requireEnglish = false, lessonIds = [], sopIds } = {}) {
  const errors = [];
  const seenIds = new Set();
  for (const term of terms) {
    const where = term?.id ?? '(no id)';
    const err = (msg) => errors.push(`${where}: ${msg}`);

    if (!/^[a-z0-9-]+$/.test(term.id ?? '')) err(`id "${term.id}" must use lowercase letters, digits and hyphens`);
    if (RESERVED.includes(term.id)) err(`id "${term.id}" is reserved`);
    if (seenIds.has(term.id)) err('duplicate id');
    seenIds.add(term.id);

    if (!CATEGORIES.includes(term.category)) err(`unknown category "${term.category}"`);
    if (!filled(term.term)) err('missing term');

    for (const field of ['name', 'definition']) {
      const text = term[field] ?? {};
      if (!filled(text.ko)) err(`missing ${field}.ko`);
      if (requireEnglish && !filled(text.en)) err(`missing ${field}.en`);
      if (filled(text.ko) && text.ko.includes(BANNED_KO)) err(`${field}.ko uses the banned word ${BANNED_KO}`);
    }
    for (const lang of ['ko', 'en']) {
      const definition = term.definition?.[lang];
      if (!filled(definition)) continue;
      if (sentenceCount(definition) > MAX_SENTENCES) err(`definition.${lang} has more than ${MAX_SENTENCES} sentences`);
      if (FIGURE.test(definition)) err(`definition.${lang} contains a figure`);
    }
    for (const lessonId of term.seen ?? []) {
      if (!lessonIds.includes(lessonId)) err(`seen refers to unknown lesson "${lessonId}"`);
    }
    // Checked only when the caller passes the SOP Library's lesson ids.
    if (sopIds && term.sop !== undefined && !sopIds.includes(term.sop)) err(`sop refers to unknown SOP lesson "${term.sop}"`);
  }
  return errors;
}
