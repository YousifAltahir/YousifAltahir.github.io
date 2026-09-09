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
    btn.setAttribute('aria-expanded', String(!open));
    btn.querySelector('.more-btn__text').textContent =
      open ? 'View more projects' : 'Hide projects';
    panel.hidden = open;                 // show when currently closed
  });
}
