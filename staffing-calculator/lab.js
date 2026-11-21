// The Staffing Lab page: two tabs over one set of values. "#channels" opens
// the channel comparison; anything else the 30-minute practice. Planned and
// unplanned Shrinkage are one value shared by both tabs.
import { loadLang, saveLang, t } from '../agent-lifecycle/js/engine/i18n.js';
import { renderLangToggle } from '../agent-lifecycle/js/render/langToggle.js';
import { h } from '../agent-lifecycle/js/render/dom.js';
import { initialValues } from './model.js';
import { CHANNELS, initialChannels } from './channels.js';
import { STAFFING_TEXT as T, CHANNEL_TEXT as C } from './text.js';
import { renderCalculator } from './render.js';
import { renderChannels } from './channels-render.js';

const SHARED = ['planned', 'unplanned'];

export function mountLab(app, langRoot, storage, loc) {
  let lang = loadLang(storage);
  let values = initialValues();
  let channels = initialChannels();
  let view;

  const tabOf = () => (loc.hash === '#channels' ? 'channels' : 'practice');
  const withShared = () => ({ ...channels, common: { ...channels.common, ...Object.fromEntries(SHARED.map((k) => [k, values[k]])) } });
  const setChannels = (next) => { channels = next; view.update(withShared()); };

  function tabs(tab) {
    const tr = (x) => t(x, lang).text;
    const link = (id, href, label) => h('a', {
      class: 'lab-tab', 'data-tab': id, href, 'aria-current': id === tab ? 'page' : null, text: tr(label),
    });
    return h('nav', { class: 'lab-tabs', 'data-tabs': true, 'aria-label': tr(C.tabsLabel) }, [
      link('practice', '#practice', C.tabPractice),
      link('channels', '#channels', C.tabChannels),
    ]);
  }

  function draw({ focusTab = false } = {}) {
    const tab = tabOf();
    document.documentElement.lang = lang;
    document.title = tab === 'channels' ? `${t(C.tabChannels, lang).text} · ${t(T.title, lang).text}` : t(T.title, lang).text;
    renderLangToggle(langRoot, lang, (next) => {
      lang = next;
      saveLang(storage, lang);
      draw();
      langRoot.querySelector(`[data-lang="${lang}"]`)?.focus();
    });
    if (tab === 'channels') {
      view = renderChannels(app, withShared(), lang, {
        onCommon: (id, v) => {
          if (SHARED.includes(id)) values = { ...values, [id]: v };
          else channels = { ...channels, common: { ...channels.common, [id]: v } };
          view.update(withShared());
        },
        onChannel: (kind, id, v) => setChannels({ ...channels, [kind]: { ...channels[kind], [id]: v } }),
        onToggle: (kind, on) => {
          const next = { ...channels.on, [kind]: on };
          if (!CHANNELS.some((k) => next[k])) { view.update(withShared()); return; } // the last one stays on
          const edit = next[channels.edit] ? channels.edit : CHANNELS.find((k) => next[k]);
          setChannels({ ...channels, on: next, edit });
        },
        onEdit: (kind) => setChannels({ ...channels, edit: kind }),
      });
    } else {
      view = renderCalculator(app, values, lang, {
        onInput: (id, value) => {
          values = { ...values, [id]: value };
          view.update(values);
        },
      });
    }
    app.querySelector('header')?.after(tabs(tab));
    if (focusTab) app.querySelector(`a[data-tab="${tab}"]`)?.focus({ preventScroll: true });
  }

  draw();
  return { draw };
}
