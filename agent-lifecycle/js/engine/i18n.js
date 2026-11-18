export const LANG_KEY = 'agent-lifecycle-course:lang';
const LANGS = ['ko', 'en'];

export function loadLang(storage, navigatorLanguage) {
  try {
    const saved = storage.getItem(LANG_KEY);
    if (LANGS.includes(saved)) return saved;
  } catch { /* use the browser language */ }
  return String(navigatorLanguage || '').toLowerCase().startsWith('ko') ? 'ko' : 'en';
}

export function saveLang(storage, lang) {
  try {
    storage.setItem(LANG_KEY, lang);
  } catch { /* choice just won't persist */ }
}

// Pick one language out of { ko, en? }. Korean is the source text, so a
// missing English string falls back to it and reports that it did.
export function t(text, lang) {
  if (lang === 'en') {
    if (text.en) return { text: text.en, fallback: false };
    return { text: text.ko, fallback: true };
  }
  return { text: text.ko, fallback: false };
}

// True when anything inside `value` (a lesson, a list of lessons) would fall
// back to Korean in the given language.
export function hasFallback(value, lang) {
  if (lang !== 'en') return false;
  if (Array.isArray(value)) return value.some((v) => hasFallback(v, lang));
  if (value && typeof value === 'object') {
    if (typeof value.ko === 'string') return !value.en;
    return Object.values(value).some((v) => hasFallback(v, lang));
  }
  return false;
}
