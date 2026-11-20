// Shared test utilities.
export function fakeStorage(initial = {}) {
  const map = new Map(Object.entries(initial));
  return {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => { map.set(k, String(v)); },
    removeItem: (k) => { map.delete(k); },
  };
}
export const throwingStorage = {
  getItem() { throw new Error('blocked'); },
  setItem() { throw new Error('blocked'); },
};

// Every string of one language in a lesson, joined with spaces.
export function lessonText(lesson, lang) {
  const out = [];
  const walk = (v) => {
    if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === 'object') {
      if (typeof v.ko === 'string') { if (v[lang]) out.push(v[lang]); }
      else Object.values(v).forEach(walk);
    }
  };
  walk(lesson);
  return out.join(' ');
}
