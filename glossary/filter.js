// Search and category filtering for the glossary. Pure functions, no DOM.

// Terms that match the search text and the chosen category, in their original
// order. The search is plain text: case-insensitive, no pattern characters.
export function filterTerms(terms, { query = '', category = 'all', lang = 'ko' } = {}) {
  const needle = String(query).trim().toLowerCase();
  return terms.filter((term) => {
    if (category !== 'all' && term.category !== category) return false;
    if (needle === '') return true;
    const haystack = [
      term.term,
      term.name?.ko,
      term.name?.en,
      term.definition?.[lang] || term.definition?.ko,
    ].filter(Boolean).join('\n').toLowerCase();
    return haystack.includes(needle);
  });
}

// The term a page address points at ("#aht"), or null.
export function findTerm(terms, hash) {
  const id = String(hash ?? '').replace(/^#/, '');
  if (id === '') return null;
  return terms.find((term) => term.id === id) ?? null;
}
