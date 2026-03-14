/**
 * layout.class.js — Общий лейаут Space Z
 * Подключается первым, до всех page-классов.
 *
 * Использование внутри любой страницы:
 *   render() {
 *     Layout.mount(this.root, { page: 'index', active: 'index' });
 *     const slot = Layout.slot();   // <main> — сюда пишем контент страницы
 *     slot.innerHTML = `...`;
 *   }
 */

class Layout {
  /* ── Публичный API ──────────────────────────────────────
   * @param {HTMLElement} root    — корневой элемент #web
   * @param {object}      opts
   *   opts.active  {string}  — ключ активного пункта nav ('index'|'service'|...)
   *   opts.footer  {boolean} — показывать футер (default: true)
  ─────────────────────────────────────────────────────── */
  static mount(root, opts = {}) {
    const { active = '', footer = true } = opts;

    root.innerHTML = `
      ${Layout._noise()}
      ${Layout._nav(active)}
      ${Layout._mobileMenu()}
      <main class="layout-slot" id="layout-slot"></main>
      ${footer ? Layout._footer() : ''}
    `;

    Layout._initBurger(root);
  }

  /* Возвращает <main>, куда страница рендерит свой контент */
  static slot() {
    return document.getElementById('layout-slot');
  }

  /* ── Noise-overlay ─────────────────────────────────────── */
  static _noise() {
    return `<div class="noise-overlay"></div>`;
  }

  /* ── Nav ───────────────────────────────────────────────── */
  static _nav(active) {
    const links = [
      { key: 'index', label: 'Главная' },
      { key: 'service', label: 'Услуги' },
      { key: 'features', label: 'Миссии' },
      { key: 'about', label: 'О нас' },
      { key: 'game', label: 'Игра' },
    ];

    const items = links.map(({ key, label }) => `
      <li>
        <a data-navigate="${key}" class="${active === key ? 'active' : ''}">
          ${label}
        </a>
      </li>
    `).join('');

    return `
      <nav class="nav" id="layout-nav">
        <a class="nav-logo" data-navigate="index">
          <img src="./Web/images/logo.svg" alt="Space Z" />
          <span>SPACE<em>Z</em></span>
        </a>

        <ul class="nav-links">${items}</ul>

        <button class="btn-ticket" data-navigate="ticket">
          <span>Купить билет</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4"
              stroke="currentColor" stroke-width="1.8"
              stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>

        <button class="nav-burger" id="navBurger" aria-label="Меню">
          <span></span><span></span><span></span>
        </button>
      </nav>
    `;
  }

  /* ── Mobile menu ───────────────────────────────────────── */
  static _mobileMenu() {
    return `
      <div class="mobile-menu" id="mobileMenu">
        <a data-navigate="index">Главная</a>
        <a data-navigate="service">Услуги</a>
        <a data-navigate="features">Миссии</a>
        <a data-navigate="about">О нас</a>
        <a data-navigate="game">Игра</a>
        <a data-navigate="ticket" class="mobile-ticket">Купить билет</a>
      </div>
    `;
  }

  /* ── Footer ────────────────────────────────────────────── */
  static _footer() {
    return `
      <footer class="footer">
        <div class="footer-inner">
          <a class="footer-logo" data-navigate="index">
            <img src="./Web/images/logo.svg" alt="Space Z" />
            <span>SPACE<em>Z</em></span>
          </a>

          <nav class="footer-links">
            <a data-navigate="service">Услуги</a>
            <a data-navigate="features">Миссии</a>
            <a data-navigate="about">О нас</a>
            <a data-navigate="ticket">Билеты</a>
            <a data-navigate="order">Заказы</a>
          </nav>

          <p class="footer-copy">© 2025 Space Z. Все права защищены.</p>
        </div>
      </footer>
    `;
  }

  /* ── Burger logic ──────────────────────────────────────── */
  static _initBurger(root) {
    const burger = root.querySelector('#navBurger');
    const menu = root.querySelector('#mobileMenu');
    if (!burger || !menu) return;

    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      menu.classList.toggle('open');
    });

    menu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        burger.classList.remove('open');
        menu.classList.remove('open');
      });
    });
  }

  /* ── Nav scroll-shadow ─────────────────────────────────── */
  static initScrollShadow() {
    const nav = document.getElementById('layout-nav');
    if (!nav) return;

    const handler = () => {
      nav.classList.toggle('scrolled', window.scrollY > 30);
    };

    window.addEventListener('scroll', handler, { passive: true });

    // Вернём функцию для отписки в destroy()
    return () => window.removeEventListener('scroll', handler);
  }
}