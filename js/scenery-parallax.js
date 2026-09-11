/* ============================================================
   scenery-parallax.js — scroll-driven growth for the mountain
   scenery (css/scenery.css).

   As the page scrolls down, each mountain layer scales UP, and
   because every layer's transform-origin is pinned to the same
   top-middle point of the shared SVG viewBox (set in CSS via
   transform-box: view-box), scaling from that anchor makes all
   four layers visually converge toward that top-middle point
   as they grow — rather than just puffing up in place.

   Each layer moves at its own rate (classic parallax: the back,
   hazier layers grow slower; the bold front layer grows fastest),
   so the four don't move as one flat unit.
   ============================================================ */

(function () {
  var layers = document.querySelectorAll('.scenery__layer');
  if (!layers.length) return;

  var prefersReducedMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return; // leave layers at their static CSS scale

  // Back-to-front growth rates — each layer moves on its own.
  var RATES = [0.35, 0.55, 0.8, 1.15];
  var MAX_EXTRA_SCALE = 0.9; // at full-page scroll, the fastest layer is up to 1 + 1.15*0.9 ≈ 2x

  var ticking = false;

  function update() {
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
