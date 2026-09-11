/* ============================================================
   more-projects.js — reveal/hide the extra projects.

   Progressive enhancement: the button lives in the HTML, this
   just wires it up. Accessible (aria-expanded / aria-controls),
   and honours prefers-reduced-motion via CSS.
   ============================================================ */

const btn = document.querySelector('.more-btn');
const panel = document.getElementById('more-projects');

if (btn && panel) {
  btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') === 'true';
    const nextKey = open ? 'moreBtnShow' : 'moreBtnHide';
    btn.setAttribute('aria-expanded', String(!open));
    const textEl = btn.querySelector('.more-btn__text');
    textEl.setAttribute('data-i18n', nextKey);
    // Use the shared translator (js/lang-toggle.js) so the label is
    // correct in whichever language is currently active.
    textEl.textContent = window.i18n ? window.i18n.t(nextKey)
      : (open ? 'View more projects' : 'Hide');
    panel.hidden = open;                 // show when currently closed
  });
}
