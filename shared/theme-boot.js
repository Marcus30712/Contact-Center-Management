// Runs in each page's <head> before anything is drawn, so a chosen light or
// dark display shows from the first frame. Same key as settings/engine.js.
// Also re-applied when the browser brings a page back from its back/forward cache.
(function () {
  function apply() {
    var v = null;
    try { v = window.localStorage.getItem('queuecraft:theme'); } catch (e) { /* storage blocked: follow the phone */ }
    if (v === 'light' || v === 'dark') document.documentElement.setAttribute('data-theme', v);
    else document.documentElement.removeAttribute('data-theme');
  }
  apply();
  window.addEventListener('pageshow', function (event) { if (event.persisted) apply(); });
})();
