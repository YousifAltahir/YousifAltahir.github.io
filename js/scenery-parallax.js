/* ============================================================
   scenery-parallax.js — scroll-driven scenery behaviour.

   1) Mountain growth: as the page scrolls down, each mountain
      layer scales UP, and because every layer's transform-origin
      is pinned to the same top-middle point of the shared SVG
      viewBox (set in CSS via transform-box: view-box), scaling
      from that anchor makes all four layers visually converge
      toward that top-middle point as they grow. Each layer moves
      at its own rate (parallax), so the four don't move as one
      flat unit. Skipped under prefers-reduced-motion.

   2) Section-label contrast: the "01 Flagship" / "02 Experience"
      labels sit directly on the page background, so wherever they
      cross the sun/moon they'd otherwise be the same color as it.
      Rather than mix-blend-mode (which needs an unbroken
      compositing path to the fixed scenery — an ancestor here has
      its own stacking context from the entrance animation, which
      silently breaks blending), this checks real geometry: on
      scroll, does each label's box actually overlap the
      sun/moon's box? If so, toggle .on-celestial, which swaps the
      label to var(--bg) (the opposite of --ink, correct in both
      themes). Always active, independent of reduced-motion.
   ============================================================ */

(function () {
  var layers = document.querySelectorAll('.scenery__layer');
  var celestial = document.querySelector('.scenery__celestial');
  // Only "Experience" sits low enough to actually cross the moon in
  // practice, and it's the only one meant to flip — "Flagship" stays
  // as-is even if it technically overlaps.
  var labels = document.querySelectorAll('.section-label[data-i18n="labelExperience"]');

  if (!layers.length && !(celestial && labels.length)) return;

  var prefersReducedMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Back-to-front growth rates — each layer moves on its own.
  var RATES = [0.35, 0.55, 0.8, 1.15];
  var MAX_EXTRA_SCALE = 0.9; // at full-page scroll, the fastest layer is up to 1 + 1.15*0.9 ≈ 2x

  function growMountains() {
    if (prefersReducedMotion || !layers.length) return;

    var scrollY = window.scrollY || window.pageYOffset || 0;
    var maxScroll = Math.max(
      document.documentElement.scrollHeight - window.innerHeight,
      1
    );
    var progress = Math.min(scrollY / maxScroll, 1);

    layers.forEach(function (layer, i) {
      var rate = RATES[i] !== undefined ? RATES[i] : 0.6;
      var scale = 1 + progress * rate * MAX_EXTRA_SCALE;
      layer.style.transform = 'scale(' + scale.toFixed(3) + ')';
    });
  }

  function rectsOverlap(a, b) {
    return !(
      a.right < b.left ||
      a.left > b.right ||
      a.bottom < b.top ||
      a.top > b.bottom
    );
  }

  function updateLabelContrast() {
    if (!celestial || !labels.length) return;
    var moonRect = celestial.getBoundingClientRect();
    if (moonRect.width === 0) return; // display:none (reduced transparency, etc.)

    labels.forEach(function (label) {
      var labelRect = label.getBoundingClientRect();
      var overlaps = rectsOverlap(labelRect, moonRect);
      label.classList.toggle('on-celestial', overlaps);
    });
  }

  var ticking = false;
  function update() {
    growMountains();
    updateLabelContrast();
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();
