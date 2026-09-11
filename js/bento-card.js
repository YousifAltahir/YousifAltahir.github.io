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
