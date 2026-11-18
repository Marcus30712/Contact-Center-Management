// Tiny element builders shared by the renderers.
const SVG_NS = 'http://www.w3.org/2000/svg';

function build(el, attrs, children) {
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v === false || v == null) continue;
    if (k === 'class') el.setAttribute('class', v);
    else if (k === 'text') el.textContent = v;
    else if (k === 'hidden') el.hidden = Boolean(v);
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const c of [].concat(children || [])) {
    if (c != null) el.append(c);
  }
  return el;
}

export const h = (tag, attrs, children) => build(document.createElement(tag), attrs, children);
export const s = (tag, attrs, children) => build(document.createElementNS(SVG_NS, tag), attrs, children);
