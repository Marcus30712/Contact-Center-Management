import { h, s } from './dom.js';
import { t, hasFallback } from '../engine/i18n.js';
import { createPlayer } from '../engine/player.js';
import { lessonHref, HOME_HREF } from '../engine/router.js';
import { gradeAnswer } from '../engine/quiz.js';
import { visibleSteps, visibleQuestions } from '../engine/track.js';
import { orderedOptions } from '../../../shared/option-order.js';
import { renderDiagram } from './diagram.js';
import { UI } from '../i18n/ui.js';
import { GUIDE_UI } from '../../../guide/data.js';
import { castOf, segments, CAST_UI } from '../../../shared/cast.js';

// Found from this file's place, so any page that shows a lesson finds the image.
const MISO_PROUD = new URL('../../../assets/miso/proud.webp', import.meta.url).href;

// One lesson: step-through diagram, then the checkpoint questions, then the
// card that links to the next stage.
// A course other than the lifecycle one passes its own `lessonCount` and
// `text` (entries that replace the shared interface strings).
export function renderLesson(root, lesson, stepIndex, lang, {
  onNavigate, onComplete, restore, track = 'general', lessonCount = 6, text = {}, guide = null,
}) {
  const tr = (entry) => t(entry, lang).text;
  // People in this lesson: a "name (role)" row on top, role pills in body text.
  const cast = castOf(lesson);
  const rich = (entry) => {
    const text = tr(entry);
    const parts = segments(text, /[가-힣]/.test(text) ? 'ko' : 'en', cast);
    const out = [];
    for (let i = 0; i < parts.length; i += 1) {
      const part = parts[i];
      if (typeof part === 'string') { out.push(part); continue; }
      const pill = h('span', { class: 'role-pill', 'data-role-pill': true, 'data-role': part.roleKey, text: part.label });
      // The particle right after the pill (가, 에게, 's) never wraps away from it.
      const rest = typeof parts[i + 1] === 'string' ? parts[i + 1] : '';
      const glue = rest.match(/^[^\s,.;:!?)]*/)[0];
      // A Korean particle after the pill sits one space's width away from its border.
      const particle = /^[가-힣]/.test(glue);
      out.push(h('span', { class: particle ? 'pill-wrap has-particle' : 'pill-wrap', 'data-pill-wrap': true }, [pill, glue]));
      if (glue) { parts[i + 1] = rest.slice(glue.length); }
    }
    return out.filter((n) => n !== '');
  };
  const castRow = cast.length ? h('p', { class: 'cast-row', 'data-cast': true }, [
    h('span', { class: 'cast-label', 'data-cast-label': true, text: tr(CAST_UI.label) }),
    ...cast.map((person) => h('span', { class: 'role-pill cast-chip', 'data-cast-person': true, 'data-role': person.roleKey }, [
      h('strong', { text: person.name[lang] }), ` (${person.role[lang]})`,
    ])),
  ]) : null;
  const ui = { ...UI, ...text };
  // A lesson whose connection is 'home' ends its course: the card leads back to the list.
  const toList = lesson.connection.to === 'home';
  // Only the common content plus the chosen track's own is on screen.
  const steps = visibleSteps(lesson, track);
  const checkpoint = visibleQuestions(lesson, track);
  const player = createPlayer(steps.length, stepIndex);
  const answers = new Map(); // question id -> chosen option id
  let completed = false;
  let inCheckpoint = false;
  document.documentElement.lang = lang;

  // --- steps view ---
  const svg = s('svg', { class: 'diagram', 'data-diagram': true, 'aria-label': tr(lesson.title) });
  const caption = h('p', { class: 'caption', 'data-caption': true, 'aria-live': 'polite' });
  const badge = h('span', { class: 'track-badge', 'data-track-badge': true, hidden: true });
  const counter = h('span', { class: 'counter', 'data-counter': true });
  const prev = h('button', { type: 'button', class: 'btn', 'data-prev': true, text: tr(UI.prev), onclick: () => move(-1) });
  const next = h('button', { type: 'button', class: 'btn primary', 'data-next': true, text: tr(UI.next), onclick: () => move(1) });
  const dots = h('div', { class: 'dots', 'aria-hidden': 'true' }, steps.map(() => h('i')));
  const stepsView = h('section', { class: 'steps', 'data-view': 'steps' }, [
    h('div', { class: 'stage-area' }, [svg]),
    h('div', { class: 'talk' }, [
      dots,
      badge,
      caption,
      h('div', { class: 'controls' }, [prev, counter, next]),
    ]),
  ]);

  // --- checkpoint view ---
  const connection = h('div', { class: 'connection', 'data-connection': true, hidden: true }, [
    // Miso congratulates once the checkpoint is done. Both courses sit one folder below the root.
    h('div', { class: 'miso-cheer' }, [
      h('img', { src: MISO_PROUD, alt: tr(ui.misoProudAlt), width: 157, height: 227, 'data-miso': 'proud' }),
      h('p', { 'data-miso-line': true, text: tr(ui.misoCheer) }),
    ]),
    h('h3', { text: tr(ui.connection) }),
    // Opened from the guide: the usual "up next" text gives way to the guide's
    // "then go here", which comes first; the usual next lesson stays second.
    guide ? null : h('p', {}, rich(lesson.connection.text)),
    guide ? h('p', { class: 'guide-from', 'data-guide-from': true, text: `${tr(GUIDE_UI.fromGuide)} · ${tr(guide.text)}` }) : null,
    guide ? h('a', {
      class: 'btn primary', 'data-guide-then': true, href: guide.then.href,
      // The arrow never wraps onto a line of its own.
      text: tr(GUIDE_UI.thenButton).replace('{title}', tr(guide.then.title)).replace(/ →$/, '\u00a0→'),
    }) : null,
    h('a', {
      class: guide ? 'btn' : 'btn primary', 'data-next-lesson': true,
      href: toList ? HOME_HREF : lessonHref(lesson.connection.to, 0),
      text: `${tr(toList ? ui.toList ?? ui.home : ui.nextLesson)} →`,
    }),
  ]);
  const questions = checkpoint.map((q) => {
    const explanation = h('div', { class: 'explanation', 'data-explanation': true, hidden: true, 'aria-live': 'polite' });
    const buttons = orderedOptions(q).map((o) => h('button', {
      type: 'button', class: 'option', 'data-option': o.id,
      onclick: () => answer(q, o.id, buttons, explanation),
    }, rich(o.text)));
    return h('div', { class: 'question', 'data-question': q.id }, [
      h('p', { class: 'prompt', 'data-prompt': true }, rich(q.prompt)),
      h('div', { class: 'options' }, buttons),
      explanation,
    ]);
  });
  const checkpointHeading = h('h2', { tabindex: '-1', text: tr(ui.checkpoint) });
  const checkpointView = h('section', { class: 'checkpoint', 'data-view': 'checkpoint', hidden: true }, [
    checkpointHeading,
    ...questions,
    connection,
    h('button', { type: 'button', class: 'btn ghost', 'data-back': true, text: `← ${tr(UI.prev)}`, onclick: () => switchView(false) }),
  ]);

  function answer(q, optionId, buttons, explanation) {
    const { correct } = gradeAnswer(q, optionId);
    for (const b of buttons) {
      const mine = b.getAttribute('data-option') === optionId;
      b.classList.toggle('is-correct', mine && correct);
      b.classList.toggle('is-wrong', mine && !correct);
      b.setAttribute('aria-pressed', String(mine));
    }
    explanation.hidden = false;
    explanation.className = correct ? 'explanation is-correct' : 'explanation is-wrong';
    // A wrong choice first hears why that choice falls short, then the shared explanation.
    const feedback = correct ? null : q.options.find((o) => o.id === optionId)?.feedback;
    explanation.replaceChildren(...[
      h('strong', { text: `${tr(correct ? UI.correct : UI.incorrect)} ` }),
      feedback ? h('span', { 'data-feedback': true }, rich(feedback)) : null,
      feedback ? ' ' : null,
      ...rich(q.explanation).map((n) => (typeof n === 'string' ? document.createTextNode(n) : n)),
    ].filter(Boolean)); // replaceChildren would write an empty part as "null".
    answers.set(q.id, optionId);
    if (answers.size === checkpoint.length) {
      connection.hidden = false;
      if (!completed) {
        completed = true;
        onComplete(lesson.id);
      }
    }
  }

  function showCheckpoint(on) {
    inCheckpoint = on;
    checkpointView.hidden = !on;
    stepsView.hidden = on;
  }

  // Open or close the checkpoint and keep keyboard focus on what appeared.
  function switchView(on) {
    showCheckpoint(on);
    (on ? checkpointHeading : next).focus();
  }

  function drawStep() {
    const step = steps[player.index];
    renderDiagram(svg, lesson.diagram, step, lang, lesson.personaName ? { personaName: lesson.personaName } : undefined);
    caption.replaceChildren(...rich(step.caption));
    counter.textContent = `${player.index + 1} / ${steps.length}`;
    badge.hidden = !step.track;
    badge.textContent = step.track ? tr(step.track === 'tech' ? UI.trackTech : UI.trackGeneral) : '';
    prev.disabled = player.atStart;
    [...dots.children].forEach((d, i) => d.classList.toggle('on', i <= player.index));
  }

  function move(delta) {
    if (inCheckpoint) return;
    if (delta > 0 && player.atEnd) { switchView(true); return; }
    const before = player.index;
    if (delta > 0) player.next(); else player.prev();
    if (player.index === before) return;
    drawStep();
    onNavigate(lessonHref(lesson.id, player.index));
  }

  function onKey(e) {
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return; // browser shortcuts
    if (e.key === 'ArrowRight') move(1);
    else if (e.key === 'ArrowLeft') move(-1);
  }
  document.addEventListener('keydown', onKey);

  const fallback = hasFallback({ ...lesson, steps, checkpoint }, lang);
  root.replaceChildren(
    h('header', { class: 'lesson-head' }, [
      h('a', { class: 'home-link', 'data-home': true, href: HOME_HREF, text: `← ${tr(ui.home)}` }),
      h('p', { class: 'eyebrow', text: `${lesson.order} / ${lessonCount}` }),
      h('h1', { text: tr(lesson.title) }),
      h('p', { class: 'subtitle', text: tr(lesson.subtitle) }),
      h('p', { class: 'translation-note', 'data-translation-note': true, hidden: !fallback, text: fallback ? tr(UI.translationComing) : '' }),
      castRow,
    ]),
    stepsView,
    checkpointView,
  );
  drawStep();

  // Put back a checkpoint that was open before a language switch.
  if (restore?.inCheckpoint) {
    showCheckpoint(true);
    // Answers belong to the track they were given on.
    const sameTrack = restore.track === undefined || restore.track === track;
    for (const [qid, optionId] of Object.entries(sameTrack ? restore.answers ?? {} : {})) {
      checkpointView.querySelector(`[data-question="${qid}"] [data-option="${optionId}"]`)?.click();
    }
  }

  return {
    snapshot() {
      return { step: player.index, inCheckpoint, answers: Object.fromEntries(answers), track };
    },
    destroy() { document.removeEventListener('keydown', onKey); },
    // Jump to a step (used when the address changes, e.g. the back button).
    goTo(i) {
      showCheckpoint(false);
      player.goTo(i);
      drawStep();
    },
  };
}
