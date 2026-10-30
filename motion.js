// Shared lightweight motion utilities — no dependencies, respects prefers-reduced-motion.
(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Scroll-reveal: add class="reveal" (optionally data-stagger="N" for delay in ms)
  function initReveal() {
    const items = document.querySelectorAll('.reveal');
    if (!items.length) return;
    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach(el => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.stagger ? parseInt(entry.target.dataset.stagger, 10) : 0;
          setTimeout(() => entry.target.classList.add('is-visible'), delay);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    items.forEach(el => io.observe(el));
  }

  // Count-up: animates a number from 0 (or current text) to target over duration ms.
  window.countUp = function (el, target, opts) {
    opts = opts || {};
    const duration = opts.duration || 900;
    const prefix = opts.prefix || '';
    const suffix = opts.suffix || '';
    const decimals = opts.decimals || 0;
    if (reduceMotion) {
      el.textContent = prefix + target.toFixed(decimals) + suffix;
      return;
    }
    const start = performance.now();
    const from = 0;
    function easeOutExpo(t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); }
    function tick(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = easeOutExpo(t);
      const val = from + (target - from) * eased;
      el.textContent = prefix + val.toFixed(decimals) + suffix;
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  };

  // Pulse: brief scale-pop to signal a value just changed. Throttled via rAF per-element.
  window.pulse = function (el) {
    if (reduceMotion || !el) return;
    el.classList.remove('value-pulse');
    void el.offsetWidth; // force reflow so the animation can restart
    el.classList.add('value-pulse');
  };

  document.addEventListener('DOMContentLoaded', initReveal);
})();
