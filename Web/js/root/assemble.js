/**
 * assemble.js — Space Z Router & Assembler
 * Handles SPA routing, dynamic page loading, and page lifecycle.
 */

(function () {
  'use strict';

  /* ─── Loader ─────────────────────────────────────────── */
  function createLoader() {
    const el = document.createElement('div');
    el.id = 'sz-loader';
    el.innerHTML = `
      <div class="szl-orbit szl-orbit--outer">
        <div class="szl-dot szl-dot--cyan"></div>
      </div>
      <div class="szl-orbit szl-orbit--inner">
        <div class="szl-dot szl-dot--pink"></div>
      </div>
      <div class="szl-core">
        <img src="./Web/images/logo.svg" alt="Space Z" class="szl-logo" />
      </div>
      <p class="szl-label">ИНИЦИАЛИЗАЦИЯ</p>
    `;
    document.body.appendChild(el);
    return el;
  }

  /* ─── Assembler class ─────────────────────────────────── */
  class Assembler {
    constructor() {
      this.root = document.getElementById('web');
      this.pages = new Map();
      this.current = null;
      this.loader = createLoader();
      this._pagesReady = false; // флаг: все модули загружены

      this._setupRouter();
      this._loadPages();
    }

    /* Public: register a page class by route name */
    register(name, PageClass) {
      this.pages.set(name, PageClass);
    }

    /* Public: navigate to a route */
    navigate(path) {
      if (window.location.pathname === '/' + path) return;
      history.pushState({ page: path }, '', '/' + path);
      this._render(path);
    }

    /* ── Private ──────────────────────────────────────── */
    _showLoader(label = 'ЗАГРУЗКА') {
      const lbl = this.loader.querySelector('.szl-label');
      if (lbl) lbl.textContent = label;
      this.loader.classList.add('active');
    }

    _hideLoader() {
      this.loader.classList.remove('active');
      this.loader.classList.add('fade-out');
      setTimeout(() => this.loader.classList.remove('fade-out'), 700);
    }

    _render(path) {
      const PageClass = this.pages.get(path);

      if (!PageClass) {
        // Модули ещё не загружены — _loadPages сам вызовет _render после.
        // Если модули уже готовы — страница реально не существует → на главную.
        if (this._pagesReady) {
          console.warn(`[Assembler] Unknown route: "${path}" → redirect to /index`);
          history.replaceState({}, '', '/index');
          this._render('index');
        }
        return;
      }

      this._showLoader('ПЕРЕХОД');

      if (this.current && typeof this.current.destroy === 'function') {
        this.current.destroy();
      }

      setTimeout(() => {
        this.root.setAttribute('page', path);
        this.root.innerHTML = '';

        this.current = new PageClass(this.root, this);
        this.current.render();

        this._hideLoader();
      }, 520);
    }

    _setupRouter() {
      window.addEventListener('popstate', () => {
        this._render(this._currentPath());
      });

      document.addEventListener('click', (e) => {
        const link = e.target.closest('[data-navigate]');
        if (link) {
          e.preventDefault();
          this.navigate(link.dataset.navigate);
        }
      });
    }

    _currentPath() {
      return window.location.pathname
        .replace(/^\//, '')
        .replace(/\.html$/, '')
        || 'index';
    }

    _loadPages() {
      const base = './Web/js/app/';
      const modules = [
        'layout.class.js',   // ← всегда первым, до всех страниц
        'index.class.js',
        'service.class.js',
        'features.class.js',
        'about.class.js',
        'game.class.js',
        'ticket.class.js',
        'order.class.js',
      ];

      const load = (src) =>
        new Promise((resolve) => {
          const s = document.createElement('script');
          s.src = base + src;
          s.defer = true;
          s.onload = resolve;
          s.onerror = resolve; // пропускаем отсутствующие — не блокируем
          document.head.appendChild(s);
        });

      this._showLoader('ИНИЦИАЛИЗАЦИЯ');

      Promise.all(modules.map(load)).then(() => {
        this._pagesReady = true;          // ← все модули загружены
        const path = this._currentPath();
        this._render(path);
      });
    }
  }

  /* ─── Boot ────────────────────────────────────────────── */
  window.App = new Assembler();

})();