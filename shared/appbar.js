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

const LEARN_PAGES = ['agent-lifecycle/', 'sop-library/', 'practice/'];
const GUIDE_PAGES = ['guide/'];

// Simple line icons, drawn here so nothing else needs to load.
const ICONS = {
  home: 'M4 11 12 4l8 7v9h-5v-6H9v6H4z',
  learn: 'M4 5h6a3 3 0 0 1 2 1 3 3 0 0 1 2-1h6v14h-6a2 2 0 0 0-2 1 2 2 0 0 0-2-1H4zM12 6v14',
  guide: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm3.5 5.5-2 5-5 2 2-5z',
  browse: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
};

// Which item is current, and where each item goes, for a page inside the site.
export function appBarItems(rootUrl, pageUrl) {
  const root = new URL(rootUrl);
  const page = new URL(pageUrl);
  const inside = page.pathname.startsWith(root.pathname) ? page.pathname.slice(root.pathname.length) : '';
  const onRoot = inside === '' || inside === 'index.html';
  let current = 'browse';
  if (onRoot) current = page.hash === '#learn' ? 'learn' : page.hash === '#browse' ? 'browse' : 'home';
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

export function renderAppBar(doc, rootUrl, pageUrl, lang) {
  const say = (entry) => entry[lang] ?? entry.ko;
  const svgNs = 'http://www.w3.org/2000/svg';
  const nav = doc.createElement('nav');
  nav.className = 'appbar';
  nav.setAttribute('aria-label', say(APPBAR_UI.label));
  for (const item of appBarItems(rootUrl, pageUrl)) {
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
  const draw = () => {
    const lang = document.documentElement.lang === 'en' ? 'en' : 'ko';
    const nav = renderAppBar(document, rootUrl, location.href, lang);
    const old = document.querySelector('nav.appbar');
    if (old) old.replaceWith(nav);
    else document.body.append(nav);
  };
  draw();
  // Pages switch language by changing <html lang>; hash changes can move "current".
  new MutationObserver(draw).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  window.addEventListener('hashchange', draw);
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
