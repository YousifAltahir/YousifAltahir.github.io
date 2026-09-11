/* ============================================================
   bento-card.js — <bento-card> tile primitive.

   Design goal: content stays as readable HTML inside the tag
   (easy to edit later), the element only adds behaviour.

   Attributes:
     interactive -> hover-lift + red glyph-edge affordance
                    (for project/experience tiles)

   Example:
     <bento-card interactive>
       ...your markup...
     </bento-card>

   Placement/sizing is handled by css/layout.css (identity, the
   flagship/experience pair, the more-projects grid, skills-row),
   not by attributes on this element.
   ============================================================ */

class BentoCard extends HTMLElement {
  connectedCallback() {
    this.classList.add('tile');
    if (this.hasAttribute('interactive')) {
      this.classList.add('is-interactive');
    }
  }
}

customElements.define('bento-card', BentoCard);
