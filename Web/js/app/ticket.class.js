/**
 * ticket.class.js — Страница бронирования билетов
 */
class TicketPage {
  constructor(root, app) {
    this.root = root; this.app = app;
    this._step = 1; this._totalSteps = 4;
    this._data = { flight: '', passengers: 1, class: 'standard', name: '', email: '', phone: '', note: '' };
    this._unScroll = null;
  }

  get _flights() {
    return [
      { id: 'SZ-SUB', name: 'Суборбитальный прыжок', date: '22 апр 2025', seats: 5, price: '$85 000', color: 'cyan' },
      { id: 'SZ-047', name: 'Орбита 400 — Станция', date: '14 апр 2025', seats: 3, price: '$1 200 000', color: 'pink' },
      { id: 'SZ-EVA', name: 'EVA — Открытый космос', date: '10 мая 2025', seats: 1, price: '$3 500 000', color: 'green' },
      { id: 'SZ-LUN', name: 'Лунный облёт Artemis Z', date: '10 июн 2025', seats: 2, price: '$12 000 000', color: 'white' },
    ];
  }

  render() {
    Layout.mount(this.root, { active: 'ticket' });
    const slot = Layout.slot();
    slot.innerHTML = `
      <div class="tk-wrap">
        <!-- HEADER -->
        <div class="tk-header">
          <div class="tk-header__inner">
            <div class="tk-header__label">// Бронирование</div>
            <h1 class="tk-header__title">Твой рейс<br/><em class="tk-cyan">начинается здесь</em></h1>
            <!-- Steps -->
            <div class="tk-steps" id="tk-steps">
              ${['Рейс', 'Данные', 'Класс', 'Подтверждение'].map((s, i) => `
                <div class="tk-step ${i === 0 ? 'tk-step--active' : ''}" data-step="${i + 1}">
                  <div class="tk-step__circle"><span>${i + 1}</span></div>
                  <span class="tk-step__label">${s}</span>
                  ${i < 3 ? '<div class="tk-step__line"></div>' : ''}
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- FORM BODY -->
        <div class="tk-body">
          <div class="tk-body__inner">
            <!-- Step 1: Choose flight -->
            <div class="tk-pane" id="tk-pane-1">
              <h2 class="tk-pane__title">Выберите рейс</h2>
              <div class="tk-flights-grid">
                ${this._flights.map(f => `
                  <label class="tk-flight-opt" data-id="${f.id}">
                    <input type="radio" name="flight" value="${f.id}" style="display:none"/>
                    <div class="tk-fo__inner tk-fo--${f.color}">
                      <div class="tk-fo__head">
                        <span class="tk-fo__code">${f.id}</span>
                        <span class="tk-fo__seats">${f.seats} мест</span>
                      </div>
                      <h3 class="tk-fo__name">${f.name}</h3>
                      <div class="tk-fo__meta">
                        <span>📅 ${f.date}</span>
                      </div>
                      <div class="tk-fo__price">${f.price}</div>
                      <div class="tk-fo__check">✓</div>
                    </div>
                  </label>
                `).join('')}
              </div>
            </div>

            <!-- Step 2: Personal data -->
            <div class="tk-pane tk-pane--hidden" id="tk-pane-2">
              <h2 class="tk-pane__title">Личные данные</h2>
              <div class="tk-form-grid">
                <div class="tk-field tk-field--full">
                  <label>Полное имя <span>*</span></label>
                  <input type="text" id="tk-name" placeholder="Иванов Иван Иванович" class="tk-input"/>
                </div>
                <div class="tk-field">
                  <label>Email <span>*</span></label>
                  <input type="email" id="tk-email" placeholder="cosmonaut@example.com" class="tk-input"/>
                </div>
                <div class="tk-field">
                  <label>Телефон <span>*</span></label>
                  <input type="tel" id="tk-phone" placeholder="+7 (999) 000-00-00" class="tk-input"/>
                </div>
                <div class="tk-field">
                  <label>Количество пассажиров</label>
                  <div class="tk-counter">
                    <button class="tk-counter__btn" id="tk-dec">−</button>
                    <span id="tk-pax-val">1</span>
                    <button class="tk-counter__btn" id="tk-inc">+</button>
                  </div>
                </div>
                <div class="tk-field tk-field--full">
                  <label>Особые пожелания</label>
                  <textarea id="tk-note" placeholder="Диета, медицинские особенности, пожелания к каюте..." class="tk-input tk-textarea"></textarea>
                </div>
              </div>
            </div>

            <!-- Step 3: Class -->
            <div class="tk-pane tk-pane--hidden" id="tk-pane-3">
              <h2 class="tk-pane__title">Класс обслуживания</h2>
              <div class="tk-classes">
                ${[
        { id: 'standard', name: 'Standard', price: '+$0', color: 'cyan', perks: ['Место в общем отсеке', 'Стандартное питание', 'Базовый скафандр', 'Видеозапись старта'] },
        { id: 'premium', name: 'Premium', price: '+$120 000', color: 'pink', perks: ['Приоритетная каюта', 'Меню от шеф-повара', 'Скафандр Premium', 'Личный консьерж', 'Живая трансляция семье'] },
        { id: 'vip', name: 'VIP Zero-G', price: '+$450 000', color: 'green', perks: ['Частная капсула', 'Персональный пилот', 'Custom скафандр', 'Именной патч миссии', 'Сувенир из космоса', 'Приём в штабе'] },
      ].map(c => `
                  <label class="tk-class-opt" data-id="${c.id}">
                    <input type="radio" name="class" value="${c.id}" style="display:none"/>
                    <div class="tk-co__inner tk-co--${c.color}">
                      <div class="tk-co__head">
                        <h3>${c.name}</h3>
                        <span class="tk-co__price">${c.price}</span>
                      </div>
                      <ul class="tk-co__perks">
                        ${c.perks.map(p => `<li><span class="tk-co__dot"></span>${p}</li>`).join('')}
                      </ul>
                      <div class="tk-co__check">✓</div>
                    </div>
                  </label>
                `).join('')}
              </div>
            </div>

            <!-- Step 4: Confirm -->
            <div class="tk-pane tk-pane--hidden" id="tk-pane-4">
              <h2 class="tk-pane__title">Подтверждение</h2>
              <div class="tk-summary" id="tk-summary">
                <!-- filled by JS -->
              </div>
              <div class="tk-agree">
                <label class="tk-checkbox">
                  <input type="checkbox" id="tk-agree-check"/>
                  <span class="tk-checkbox__box"></span>
                  <span>Я согласен с <a href="#">условиями полёта</a> и <a href="#">политикой безопасности</a></span>
                </label>
              </div>
            </div>

            <!-- Navigation -->
            <div class="tk-nav">
              <button class="btn-ghost tk-btn-back" id="tk-back" style="display:none">← Назад</button>
              <button class="btn-primary tk-btn-next" id="tk-next">Далее →</button>
            </div>
          </div>

          <!-- Side info -->
          <div class="tk-aside">
            <div class="tk-aside__card">
              <div class="tk-aside__label">Контакт менеджера</div>
              <p class="tk-aside__text">Персональный менеджер доступен 24/7 для ответов на любые вопросы.</p>
              <div class="tk-aside__contact">
                <div>📞 +7 (495) 000-00-01</div>
                <div>✉️ book@spacez.com</div>
              </div>
            </div>
            <div class="tk-aside__card">
              <div class="tk-aside__label">Безопасность оплаты</div>
              <p class="tk-aside__text">Депозит 10%, остаток — за 30 дней до рейса. Полный возврат при отмене за 60+ дней.</p>
            </div>
          </div>
        </div>
      </div>
    `;
    this._initForm();
    this._unScroll = Layout.initScrollShadow();
  }

  _initForm() {
    // Flight select
    this.root.querySelectorAll('.tk-flight-opt').forEach(opt => {
      opt.addEventListener('click', () => {
        this.root.querySelectorAll('.tk-flight-opt').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        opt.querySelector('input').checked = true;
        this._data.flight = opt.dataset.id;
      });
    });

    // Class select
    this.root.querySelectorAll('.tk-class-opt').forEach(opt => {
      opt.addEventListener('click', () => {
        this.root.querySelectorAll('.tk-class-opt').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        this._data.class = opt.dataset.id;
      });
    });

    // Pax counter
    const paxVal = document.getElementById('tk-pax-val');
    document.getElementById('tk-dec').addEventListener('click', () => {
      if (this._data.passengers > 1) { this._data.passengers--; paxVal.textContent = this._data.passengers; }
    });
    document.getElementById('tk-inc').addEventListener('click', () => {
      if (this._data.passengers < 6) { this._data.passengers++; paxVal.textContent = this._data.passengers; }
    });

    // Next/Back
    document.getElementById('tk-next').addEventListener('click', () => this._nextStep());
    document.getElementById('tk-back').addEventListener('click', () => this._prevStep());
  }

  _nextStep() {
    if (this._step === 1 && !this._data.flight) { this._shake('tk-pane-1'); return; }
    if (this._step === 2) {
      const name = document.getElementById('tk-name').value;
      const email = document.getElementById('tk-email').value;
      if (!name || !email) { this._shake('tk-pane-2'); return; }
      this._data.name = name;
      this._data.email = email;
      this._data.phone = document.getElementById('tk-phone').value;
      this._data.note = document.getElementById('tk-note').value;
    }
    if (this._step === 4) { this._submit(); return; }
    this._goToStep(this._step + 1);
  }

  _prevStep() { this._goToStep(this._step - 1); }

  _goToStep(n) {
    document.getElementById(`tk-pane-${this._step}`).classList.add('tk-pane--hidden');
    this._step = n;
    document.getElementById(`tk-pane-${this._step}`).classList.remove('tk-pane--hidden');
    this.root.querySelectorAll('.tk-step').forEach((el, i) => {
      el.classList.toggle('tk-step--active', i + 1 === this._step);
      el.classList.toggle('tk-step--done', i + 1 < this._step);
    });
    document.getElementById('tk-back').style.display = this._step > 1 ? '' : 'none';
    document.getElementById('tk-next').textContent = this._step === 4 ? 'Отправить заявку ✓' : 'Далее →';
    if (this._step === 4) this._buildSummary();
  }

  _buildSummary() {
    const f = this._flights.find(x => x.id === this._data.flight) || {};
    const classLabel = { standard: 'Standard', premium: 'Premium', vip: 'VIP Zero-G' }[this._data.class];
    document.getElementById('tk-summary').innerHTML = `
      <div class="tk-sum-row"><span>Рейс</span><b>${f.id || '—'} — ${f.name || '—'}</b></div>
      <div class="tk-sum-row"><span>Дата</span><b>${f.date || '—'}</b></div>
      <div class="tk-sum-row"><span>Пассажиры</span><b>${this._data.passengers}</b></div>
      <div class="tk-sum-row"><span>Класс</span><b>${classLabel}</b></div>
      <div class="tk-sum-row"><span>Имя</span><b>${this._data.name || '—'}</b></div>
      <div class="tk-sum-row"><span>Email</span><b>${this._data.email || '—'}</b></div>
      <div class="tk-sum-sep"></div>
      <div class="tk-sum-row tk-sum-total"><span>Базовая цена</span><b>${f.price || '—'}</b></div>
    `;
  }

  _submit() {
    const agreed = document.getElementById('tk-agree-check').checked;
    if (!agreed) { this._shake('tk-pane-4'); return; }
    const body = document.getElementById('tk-pane-4');
    body.innerHTML = `
      <div class="tk-success">
        <div class="tk-success__icon">🚀</div>
        <h2>Заявка принята!</h2>
        <p>Номер заявки: <b>SZ-${Math.floor(Math.random() * 90000 + 10000)}</b></p>
        <p>Ожидайте подтверждения на <b>${this._data.email}</b> в течение 24 часов.</p>
        <button class="btn-primary" data-navigate="index" style="margin-top:32px">На главную</button>
      </div>
    `;
    document.getElementById('tk-next').style.display = 'none';
    document.getElementById('tk-back').style.display = 'none';
  }

  _shake(paneId) {
    const el = document.getElementById(paneId);
    el.classList.add('tk-shake');
    setTimeout(() => el.classList.remove('tk-shake'), 600);
  }

  destroy() { if (this._unScroll) this._unScroll(); }
}
App.register('ticket', TicketPage);