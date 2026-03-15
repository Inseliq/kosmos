/**
 * order.class.js — Страница заказов / личный кабинет
 */
class OrderPage {
  constructor(root, app) {
    this.root = root; this.app = app;
    this._activeTab = 'orders'; this._unScroll = null;
  }

  get _orders() {
    return [
      { id: 'SZ-10482', flight: 'SZ-047', name: 'Орбита 400 — Станция', date: '14 апр 2025', status: 'confirmed', price: '$1 200 000', pax: 1, color: 'pink' },
      { id: 'SZ-09231', flight: 'SZ-SUB', name: 'Суборбитальный прыжок', date: '22 апр 2025', status: 'pending', price: '$85 000', pax: 2, color: 'cyan' },
      { id: 'SZ-07845', flight: 'SZ-SUB', name: 'Суборбитальный прыжок', date: '12 янв 2025', status: 'completed', price: '$85 000', pax: 1, color: 'green' },
    ];
  }

  get _docs() {
    return [
      { name: 'Договор SZ-10482', type: 'PDF', date: '15 фев 2025', size: '1.2 МБ' },
      { name: 'Мед. допуск #4821', type: 'PDF', date: '20 фев 2025', size: '0.8 МБ' },
      { name: 'Программа подготовки', type: 'PDF', date: '01 мар 2025', size: '3.4 МБ' },
      { name: 'Сертификат SZ-07845', type: 'PDF', date: '13 янв 2025', size: '0.5 МБ' },
    ];
  }

  render() {
    Layout.mount(this.root, { active: '' });
    const slot = Layout.slot();
    slot.innerHTML = `
      <div class="or-wrap">
        <!-- SIDEBAR -->
        <aside class="or-sidebar">
          <div class="or-profile">
            <div class="or-profile__avatar">
              <span>ИИ</span>
              <div class="or-profile__ring"></div>
            </div>
            <div class="or-profile__info">
              <div class="or-profile__name">Иван Иванов</div>
              <div class="or-profile__badge">
                <span class="or-badge-dot"></span> Верифицирован
              </div>
            </div>
          </div>

          <nav class="or-nav">
            ${[
        { key: 'orders', icon: '◈', label: 'Мои рейсы' },
        { key: 'docs', icon: '◉', label: 'Документы' },
        { key: 'prep', icon: '◆', label: 'Подготовка' },
        { key: 'pass', icon: '◇', label: 'Пропуск' },
      ].map(n => `
              <button class="or-nav__item ${n.key === 'orders' ? 'or-nav--active' : ''}" data-tab="${n.key}">
                <span class="or-nav__icon">${n.icon}</span>
                <span>${n.label}</span>
              </button>
            `).join('')}
          </nav>

          <div class="or-sidebar__cta">
            <p>Хотите добавить ещё один рейс?</p>
            <button class="btn-primary" data-navigate="ticket" style="width:100%;justify-content:center;margin-top:12px">Забронировать</button>
          </div>
        </aside>

        <!-- MAIN CONTENT -->
        <main class="or-main">
          <!-- ORDERS TAB -->
          <div class="or-tab" id="or-tab-orders">
            <div class="or-tab__head">
              <h2>Мои рейсы</h2>
              <span class="or-count">${this._orders.length} заказа</span>
            </div>
            <div class="or-orders">
              ${this._orders.map(o => this._orderCard(o)).join('')}
            </div>
          </div>

          <!-- DOCS TAB -->
          <div class="or-tab or-tab--hidden" id="or-tab-docs">
            <div class="or-tab__head"><h2>Документы</h2></div>
            <div class="or-docs">
              ${this._docs.map(d => `
                <div class="or-doc">
                  <div class="or-doc__icon">
                    <svg viewBox="0 0 32 32" fill="none">
                      <rect x="6" y="4" width="20" height="24" rx="3" stroke="#00ffff" stroke-width="1.5"/>
                      <path d="M10 12h12M10 17h8M10 22h6" stroke="#00ffff" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>
                    </svg>
                  </div>
                  <div class="or-doc__info">
                    <div class="or-doc__name">${d.name}</div>
                    <div class="or-doc__meta">${d.type} · ${d.size} · ${d.date}</div>
                  </div>
                  <button class="or-doc__dl">↓ Скачать</button>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- PREP TAB -->
          <div class="or-tab or-tab--hidden" id="or-tab-prep">
            <div class="or-tab__head"><h2>Программа подготовки</h2></div>
            <div class="or-prep">
              ${[
        { week: 'Неделя 1–2', title: 'Медицинское обследование', status: 'done', desc: 'Полный скрининг: сердце, вестибулярный аппарат, психология. Допуск подтверждён.' },
        { week: 'Неделя 3–4', title: 'Физическая подготовка', status: 'done', desc: 'Тренировки на центрифуге (до 6G), силовые нагрузки, аэробика в гипокамере.' },
        { week: 'Неделя 5–6', title: 'Скафандр и процедуры', status: 'active', desc: 'Примерка и обучение использованию скафандра, процедуры аварийного выхода.' },
        { week: 'Неделя 7', title: 'Симуляция полёта', status: 'upcoming', desc: 'Полная симуляция старта, невесомости и посадки в тренажёре SZ-Sim.' },
        { week: 'Неделя 8', title: 'Брифинг и старт', status: 'upcoming', desc: 'Финальный медосмотр, брифинг с командой, переезд на космодром.' },
      ].map((p, i) => `
                <div class="or-prep-item">
                  <div class="or-prep__status or-ps--${p.status}">
                    ${p.status === 'done' ? '✓' : p.status === 'active' ? '▶' : String(i + 1)}
                  </div>
                  <div class="or-prep__body">
                    <div class="or-prep__week">${p.week}</div>
                    <h4 class="or-prep__title">${p.title}</h4>
                    <p class="or-prep__desc">${p.desc}</p>
                  </div>
                  ${i < 4 ? '<div class="or-prep__connector"></div>' : ''}
                </div>
              `).join('')}
            </div>
          </div>

          <!-- PASS TAB -->
          <div class="or-tab or-tab--hidden" id="or-tab-pass">
            <div class="or-tab__head"><h2>Пропуск на космодром</h2></div>
            <div class="or-pass-wrap">
              <div class="or-pass">
                <div class="or-pass__head">
                  <img src="./Web/images/logo.svg" alt="Space Z" style="width:40px"/>
                  <div>
                    <div class="or-pass__title">SPACE Z PASS</div>
                    <div class="or-pass__sub">Космодром Байконур</div>
                  </div>
                  <div class="or-pass__status-dot"></div>
                </div>
                <div class="or-pass__body">
                  <div class="or-pass__row"><span>Пассажир</span><b>ИВАНОВ ИВАН</b></div>
                  <div class="or-pass__row"><span>Рейс</span><b>SZ-047</b></div>
                  <div class="or-pass__row"><span>Дата</span><b>14 АПР 2025</b></div>
                  <div class="or-pass__row"><span>Класс</span><b>STANDARD</b></div>
                  <div class="or-pass__row"><span>Место</span><b>A-04</b></div>
                </div>
                <div class="or-pass__barcode">
                  ${Array.from({ length: 40 }, () => `<div class="or-bc-bar" style="height:${20 + Math.random() * 24}px;width:${Math.random() > 0.6 ? 2 : 1}px"></div>`).join('')}
                </div>
                <div class="or-pass__code">SZ047-A04-1042B</div>
              </div>
              <p class="or-pass__note">Предъявите пропуск при входе на космодром за 6 часов до старта. Документ должен совпадать с паспортом.</p>
            </div>
          </div>
        </main>
      </div>
    `;
    this._initTabs();
    this._unScroll = Layout.initScrollShadow();
  }

  _orderCard(o) {
    const statusLabel = { confirmed: 'Подтверждён', pending: 'На рассмотрении', completed: 'Завершён' }[o.status];
    return `
      <div class="or-order or-order--${o.color}">
        <div class="or-order__stripe"></div>
        <div class="or-order__left">
          <div class="or-order__id">${o.id}</div>
          <h3 class="or-order__name">${o.name}</h3>
          <div class="or-order__meta">
            <span>✈ ${o.flight}</span>
            <span>📅 ${o.date}</span>
            <span>👤 ${o.pax} пасс.</span>
          </div>
        </div>
        <div class="or-order__right">
          <div class="or-order__price">${o.price}</div>
          <div class="or-status or-status--${o.status}">${statusLabel}</div>
          <button class="or-order__detail">Детали →</button>
        </div>
      </div>
    `;
  }

  _initTabs() {
    this.root.querySelectorAll('.or-nav__item').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        this.root.querySelectorAll('.or-nav__item').forEach(b => b.classList.remove('or-nav--active'));
        btn.classList.add('or-nav--active');
        this.root.querySelectorAll('.or-tab').forEach(t => t.classList.add('or-tab--hidden'));
        document.getElementById(`or-tab-${tab}`).classList.remove('or-tab--hidden');
      });
    });
    this.root.querySelectorAll('.or-order__detail').forEach(btn => {
      btn.addEventListener('click', () => { btn.textContent = 'Скоро...'; setTimeout(() => btn.textContent = 'Детали →', 1500); });
    });
    this.root.querySelectorAll('.or-doc__dl').forEach(btn => {
      btn.addEventListener('click', () => { btn.textContent = '✓ Готово'; setTimeout(() => btn.textContent = '↓ Скачать', 2000); });
    });
  }

  destroy() { if (this._unScroll) this._unScroll(); }
}
App.register('order', OrderPage);