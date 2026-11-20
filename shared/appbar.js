// The bottom menu shared by every page (home, learn, guide, browse). Each
// page loads this file once; it draws the menu, keeps its labels in the
// page's language, and registers the offline worker.
export const APPBAR_UI = {
  label: { ko: '주 메뉴', en: 'Main menu' },
  home: { ko: '홈', en: 'Home' },
  learn: { ko: '배우기', en: 'Learn' },
  guide: { ko: '길잡이', en: 'Guide' },
  browse: { ko: '찾아보기', en: 'Browse' },
};

const LEARN_PAGES = ['agent-lifecycle/', 'sop-library/', 'practice/', 'excel/'];
const GUIDE_PAGES = ['guide/'];

// Simple line icons, drawn here so nothing else needs to load.
const ICONS = {
  home: 'M4 11 12 4l8 7v9h-5v-6H9v6H4z',
  learn: 'M4 5h6a3 3 0 0 1 2 1 3 3 0 0 1 2-1h6v14h-6a2 2 0 0 0-2 1 2 2 0 0 0-2-1H4zM12 6v14',
  guide: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm3.5 5.5-2 5-5 2 2-5z',
  browse: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
};

// Which item is current, and where each item goes, for a page inside the site.
// On the home page: which part is in view, from the scroll position and where
// the Learn and Browse sections start.
// atBottom: Browse is short and can never reach the top, so the bottom counts.
export function homeSection(scrollY, learnTop, browseTop, atBottom = false) {
  if (atBottom || scrollY >= browseTop) return 'browse';
  if (scrollY >= learnTop) return 'learn';
  return 'home';
}

// Is this address the home page? (…/, …/index.html, with any ?query or #hash)
export function isRootPage(rootUrl, href) {
  const root = new URL(rootUrl);
  const page = new URL(href);
  if (page.origin !== root.origin || !page.pathname.startsWith(root.pathname)) return false;
  const inside = page.pathname.slice(root.pathname.length);
  return inside === '' || inside === 'index.html';
}

// Move the highlight without rebuilding the menu, so focus stays where it is.
export function setCurrent(nav, id) {
  for (const a of nav.querySelectorAll('a[data-item]')) {
    if (a.dataset.item === id) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  }
}

// section: on the home page, the part in view (overrides the address).
export function appBarItems(rootUrl, pageUrl, section) {
  const root = new URL(rootUrl);
  const page = new URL(pageUrl);
  const inside = page.pathname.startsWith(root.pathname) ? page.pathname.slice(root.pathname.length) : '';
  const onRoot = inside === '' || inside === 'index.html';
  let current = 'browse';
  if (onRoot) current = section ?? (page.hash === '#learn' ? 'learn' : page.hash === '#browse' ? 'browse' : 'home');
  else if (LEARN_PAGES.some((p) => inside.startsWith(p))) current = 'learn';
  else if (GUIDE_PAGES.some((p) => inside.startsWith(p))) current = 'guide';
  const href = (rest) => new URL(rest, root).href;
  return [
    { id: 'home', href: href('./'), current: current === 'home' },
    { id: 'learn', href: href('./#learn'), current: current === 'learn' },
    { id: 'guide', href: href('./guide/'), current: current === 'guide' },
    { id: 'browse', href: href('./#browse'), current: current === 'browse' },
  ];
}

export function renderAppBar(doc, rootUrl, pageUrl, lang, section) {
  const say = (entry) => entry[lang] ?? entry.ko;
  const svgNs = 'http://www.w3.org/2000/svg';
  const nav = doc.createElement('nav');
  nav.className = 'appbar';
  nav.setAttribute('aria-label', say(APPBAR_UI.label));
  for (const item of appBarItems(rootUrl, pageUrl, section)) {
    const a = doc.createElement('a');
    a.href = item.href;
    a.dataset.item = item.id;
    if (item.current) a.setAttribute('aria-current', 'page');
    const svg = doc.createElementNS(svgNs, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    const path = doc.createElementNS(svgNs, 'path');
    path.setAttribute('d', ICONS[item.id]);
    svg.append(path);
    const label = doc.createElement('span');
    label.textContent = say(APPBAR_UI[item.id]);
    a.append(svg, label);
    nav.append(a);
  }
  return nav;
}

function mount() {
  const rootUrl = new URL('../', import.meta.url).href;
  const onRoot = isRootPage(rootUrl, location.href);
  let section;
  const draw = () => {
    const lang = document.documentElement.lang === 'en' ? 'en' : 'ko';
    const nav = renderAppBar(document, rootUrl, location.href, lang, section);
    const old = document.querySelector('nav.appbar');
    if (old) old.replaceWith(nav);
    else document.body.append(nav);
  };
  draw();
  // Pages switch language by changing <html lang>; hash changes can move "current".
  new MutationObserver(draw).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  window.addEventListener('hashchange', () => { section = undefined; draw(); });
  // On the home page, follow the part in view once the reader scrolls.
  if (onRoot) {
    const top = (id) => {
      const el = document.getElementById(id);
      return el ? el.getBoundingClientRect().top + window.scrollY - 120 : Infinity;
    };
    window.addEventListener('scroll', () => {
      const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
      const next = homeSection(window.scrollY, top('learn'), top('browse'), atBottom);
      if (next === section) return;
      section = next;
      const nav = document.querySelector('nav.appbar');
      if (nav) setCurrent(nav, next);
      else draw();
    }, { passive: true });
  }
  if (!document.querySelector('link[data-appbar-css]')) {
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = new URL('./appbar.css', import.meta.url).href;
    css.dataset.appbarCss = '';
    document.head.append(css);
  }
}

function registerOffline() {
  if (!('serviceWorker' in navigator)) return;
  const rootUrl = new URL('../', import.meta.url);
  navigator.serviceWorker.register(new URL('sw.js', rootUrl), { scope: rootUrl.pathname }).catch(() => {
    // Offline use just won't be available (private mode, blocked storage).
  });
}

if (typeof window !== 'undefined' && /^https?:$/.test(window.location.protocol)) {
  mount();
  registerOffline();
}
