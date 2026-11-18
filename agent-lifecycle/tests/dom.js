// jsdom setup for renderer tests. Call setupDom() at the top of a test; it
// returns a fresh document and installs the globals the renderers use.
import { JSDOM } from 'jsdom';

export function setupDom() {
  const dom = new JSDOM('<!doctype html><html lang="ko"><body><main id="app"></main></body></html>');
  globalThis.window = dom.window;
  globalThis.document = dom.window.document;
  return { document: dom.window.document, root: dom.window.document.getElementById('app'), window: dom.window };
}

export function click(el) {
  el.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
}

export function key(name) {
  document.dispatchEvent(new window.KeyboardEvent('keydown', { key: name, bubbles: true }));
}
