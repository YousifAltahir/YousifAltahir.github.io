/* ============================================================
   theme-toggle.js — <theme-toggle> custom element.
   Light is the base. Persists choice in localStorage.

   Classic script (no ES modules) so it also works when the
   page is opened directly from disk (file://), not just over http.

   NOTE: the initial data-theme is set by a tiny inline script
   in <head> to avoid a flash; this element renders the button
   and flips the attribute on click.
   ============================================================ */

(function () {
  var KEY = 'yousif-theme';

  var SUN =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  var MOON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>';

  class ThemeToggle extends HTMLElement {
    connectedCallback() {
      this.btn = document.createElement('button');
      this.btn.className = 'icon-btn';
      this.btn.type = 'button';
      this.append(this.btn);
      this.render();
      this.btn.addEventListener('click', this.toggle.bind(this));
    }

    get current() {
      return document.documentElement.getAttribute('data-theme') === 'dark'
        ? 'dark'
        : 'light';
    }

    toggle() {
      var next = this.current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem(KEY, next); } catch (e) { /* private mode */ }
      this.render();
    }

    render() {
      var isDark = this.current === 'dark';
      // Show the icon of the mode you'd switch TO.
      this.btn.innerHTML = isDark ? SUN : MOON;
      var label = isDark ? 'Switch to light mode' : 'Switch to dark mode';
      this.btn.setAttribute('aria-label', label);
      this.btn.setAttribute('title', label);
    }
  }

  customElements.define('theme-toggle', ThemeToggle);
})();
