/* ============================================================
   bento-card.js — <bento-card> tile primitive.

   Design goal: content stays as readable HTML inside the tag
   (easy to edit later), the element only adds behaviour.

   Attributes:
     interactive     -> hover-lift affordance (for project/exp tiles)
     data-span="1..4"-> grid column span   (styled in layout.css)
     data-rows="2"   -> grid row span      (styled in layout.css)

   Example:
     <bento-card interactive data-span="2">
       ...your markup...
     </bento-card>

   Corner hardware: each tile gets 2-4 (never a guaranteed all-4)
   randomly placed bolts/screws at its corners — see
   css/corner-hardware.css for the 5 bolt-* / 5 screw-* variants
   this picks from. Decided once per page load, not re-rolled.
   ============================================================ */

const CORNERS = ['tl', 'tr', 'bl', 'br'];
const VARIANTS = [
  'bolt-1', 'bolt-2', 'bolt-3', 'bolt-4', 'bolt-5',
  'screw-1', 'screw-2', 'screw-3', 'screw-4', 'screw-5',
];

function pickCorners() {
  // 2, 3, or 4 corners — deliberately not always all four.
  const count = 2 + Math.floor(Math.random() * 3);
  const pool = [...CORNERS];
  const chosen = [];
  for (let i = 0; i < count; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    chosen.push(pool.splice(idx, 1)[0]);
  }
  return chosen;
}

function randomVariant() {
  return VARIANTS[Math.floor(Math.random() * VARIANTS.length)];
}

function randomSize(edge) {
  // Normal pieces: 16-26px, inset from the corner.
  // "Edge" pieces: 30-44px, bigger than the corner itself, centered
  // right on the vertex so they visibly overhang the tile's edge.
  return edge
    ? Math.round(30 + Math.random() * 14)
    : Math.round(16 + Math.random() * 10);
}

class BentoCard extends HTMLElement {
  connectedCallback() {
    this.classList.add('tile');
    if (this.hasAttribute('interactive')) {
      this.classList.add('is-interactive');
    }
    this.addCornerHardware();
  }

  addCornerHardware() {
    pickCorners().forEach((corner) => {
      // ~1 in 3 pieces straddles the corner vertex instead of sitting
      // politely inset — bigger than the corner, overhanging the edge.
      const edge = Math.random() < 0.32;
      const piece = document.createElement('span');
      piece.className =
        `corner-hw corner-hw--${corner} ${randomVariant()}` +
        (edge ? ' corner-hw--edge' : '');
      piece.style.setProperty('--hw-size', `${randomSize(edge)}px`);
      piece.setAttribute('aria-hidden', 'true');

      const body = document.createElement('span');
      body.className = 'corner-hw__body';
      piece.appendChild(body);

      const mark = document.createElement('span');
      mark.className = 'corner-hw__mark';
      piece.appendChild(mark);

      this.appendChild(piece);
    });
  }
}

customElements.define('bento-card', BentoCard);
