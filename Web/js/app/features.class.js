/**
 * features.class.js — Страница миссий Space Z
 */
class FeaturesPage {
  constructor(root, app) {
    this.root = root; this.app = app;
    this._observers = []; this._unScroll = null;
    this._activeFilter = 'all';
  }

  get _missions() {
    return [
      {
        id: 'm1', status: 'completed', year: '2021', cat: 'suborbital', color: 'cyan',
        code: 'SZ-001', name: 'First Light', desc: 'Первый коммерческий суборбитальный рейс. 4 пассажира, 120 км высота, 87 минут полёта. Исторический момент для частной космонавтики.',
        crew: 4, duration: '87 мин', alt: '120 км', result: 'Успех'
      },
      {
        id: 'm2', status: 'completed', year: '2022', cat: 'orbital', color: 'pink',
        code: 'SZ-012', name: 'Orbit Alpha', desc: 'Первый орбитальный рейс с коммерческими пассажирами. Стыковка с МКС, 3 дня на борту станции.',
        crew: 2, duration: '3 сут', alt: '408 км', result: 'Успех'
      },
      {
        id: 'm3', status: 'completed', year: '2022', cat: 'eva', color: 'green',
        code: 'SZ-018', name: 'Spacewalk I', desc: 'Первый коммерческий выход в открытый космос. Рекорд — 8 часов 12 минут EVA непрерывно.',
        crew: 1, duration: '8 ч 12 м', alt: '412 км', result: 'Рекорд'
      },
      {
        id: 'm4', status: 'active', year: '2024', cat: 'orbital', color: 'cyan',
        code: 'SZ-041', name: 'Station Life', desc: 'Долгосрочная программа пребывания на SZ Station. Научные эксперименты в условиях микрогравитации.',
        crew: 6, duration: '21 сут', alt: '408 км', result: 'В процессе'
      },
      {
        id: 'm5', status: 'active', year: '2025', cat: 'lunar', color: 'white',
        code: 'SZ-051', name: 'Artemis Z-I', desc: 'Первый облёт Луны. Команда из 4 человек, траектория свободного возврата, съёмка обратной стороны.',
        crew: 4, duration: '14 сут', alt: '384 000 км', result: 'Подготовка'
      },
      {
        id: 'm6', status: 'upcoming', year: '2026', cat: 'lunar', color: 'pink',
        code: 'SZ-058', name: 'Touchdown Luna', desc: 'Первая коммерческая высадка на лунную поверхность. Зона посадки — кратер Шеклтон, Южный полюс.',
        crew: 2, duration: '18 сут', alt: 'Луна', result: 'Запланировано'
      },
      {
        id: 'm7', status: 'upcoming', year: '2027', cat: 'mars', color: 'orange',
        code: 'SZ-064', name: 'Red Horizon', desc: 'Первый пилотируемый перелёт к Марсу. Орбитальная миссия с высадкой марсохода и дистанционным управлением.',
        crew: 8, duration: '210 сут', alt: '54.6M км', result: 'Разработка'
      },
      {
        id: 'm8', status: 'upcoming', year: '2028', cat: 'deep', color: 'purple',
        code: 'SZ-070', name: 'Void Station', desc: 'Строительство первой точки постоянного присутствия человека за пределами системы Земля–Луна. L4/L5.',
        crew: 12, duration: '∞', alt: '384 000 км', result: 'Концепция'
      },
    ];
  }

  render() {
    Layout.mount(this.root, { active: 'features' });
    const slot = Layout.slot();
    slot.innerHTML = `
      <!-- HERO -->
      <div class="ft-hero">
        <div class="ft-hero__bg">
          <div class="ft-grid-lines"></div>
        </div>
        <div class="ft-hero__inner">
          <div class="ft-hero__label reveal-item">// Хроника миссий</div>
          <h1 class="ft-hero__title reveal-item">
            Каждый старт —<br/><em class="ft-accent">история</em>
          </h1>
          <p class="ft-hero__desc reveal-item">
            8 миссий, 4 категории, один вектор — вперёд.<br/>
            Смотри хронологию наших полётов и будущих экспедиций.
          </p>
          <div class="ft-hero__counters reveal-item">
            <div class="ft-counter"><span class="ft-c-n">3</span><span class="ft-c-l">Завершены</span></div>
            <div class="ft-counter"><span class="ft-c-n ft-c-cyan">2</span><span class="ft-c-l">Активные</span></div>
            <div class="ft-counter"><span class="ft-c-n ft-c-pink">3</span><span class="ft-c-l">Предстоящие</span></div>
          </div>
        </div>
      </div>

      <!-- TIMELINE FILTERS -->
      <div class="ft-filters reveal-item">
        <div class="ft-filters__inner">
          ${[
        { key: 'all', label: 'Все миссии', n: 8 },
        { key: 'suborbital', label: 'Суборбитальные', n: 1 },
        { key: 'orbital', label: 'Орбитальные', n: 2 },
        { key: 'eva', label: 'EVA', n: 1 },
        { key: 'lunar', label: 'Лунные', n: 2 },
        { key: 'mars', label: 'Марс', n: 1 },
        { key: 'deep', label: 'Deep Space', n: 1 },
      ].map(f => `
            <button class="ft-filter ${f.key === 'all' ? 'ft-filter--active' : ''}" data-filter="${f.key}">
              ${f.label} <span>${f.n}</span>
            </button>
          `).join('')}
        </div>
      </div>

      <!-- TIMELINE -->
      <div class="ft-timeline" id="ft-timeline">
        <div class="ft-timeline__line"></div>
        ${this._missions.map((m, i) => this._missionItem(m, i)).join('')}
      </div>

      <!-- STATS STRIP -->
      <div class="ft-stats reveal-item">
        <div class="ft-stats__inner">
          <div class="ft-stat"><span class="fs-n">247</span><span class="fs-l">Суммарно рейсов</span></div>
          <div class="ft-stat"><span class="fs-n">1 840</span><span class="fs-l">Дней в космосе</span></div>
          <div class="ft-stat"><span class="fs-n">14 200 км/с</span><span class="fs-l">Макс. скорость</span></div>
          <div class="ft-stat"><span class="fs-n">0</span><span class="fs-l">Критических инцидентов</span></div>
        </div>
      </div>
    `;
    this._initFilters();
    this._initReveal();
    this._unScroll = Layout.initScrollShadow();
  }

  _missionItem(m, i) {
    const side = i % 2 === 0 ? 'left' : 'right';
    const statusLabel = { completed: 'Завершена', active: 'Активна', upcoming: 'Предстоит' }[m.status];
    return `
      <div class="ft-item ft-item--${side} ft-item--${m.status} reveal-item" data-cat="${m.cat}">
        <div class="ft-item__dot ft-dot--${m.color}"></div>
        <div class="ft-item__year">${m.year}</div>
        <div class="ft-card ft-card--${m.color}">
          <div class="ft-card__head">
            <span class="ft-card__code">${m.code}</span>
            <span class="ft-card__status ft-status--${m.status}">${statusLabel}</span>
          </div>
          <h3 class="ft-card__name">${m.name}</h3>
          <p class="ft-card__desc">${m.desc}</p>
          <div class="ft-card__specs">
            <div class="ft-spec"><span>Экипаж</span><b>${m.crew} чел.</b></div>
            <div class="ft-spec"><span>Время</span><b>${m.duration}</b></div>
            <div class="ft-spec"><span>Высота</span><b>${m.alt}</b></div>
            <div class="ft-spec"><span>Итог</span><b class="ft-result--${m.color}">${m.result}</b></div>
          </div>
        </div>
      </div>
    `;
  }

  _initFilters() {
    const btns = this.root.querySelectorAll('.ft-filter');
    btns.forEach(btn => btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('ft-filter--active'));
      btn.classList.add('ft-filter--active');
      const f = btn.dataset.filter;
      this.root.querySelectorAll('.ft-item').forEach(el => {
        const show = f === 'all' || el.dataset.cat === f;
        el.style.display = show ? '' : 'none';
      });
    }));
  }

  _initReveal() {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); } });
    }, { threshold: 0.1 });
    this.root.querySelectorAll('.reveal-item').forEach((el, i) => {
      el.style.transitionDelay = (i % 4) * 90 + 'ms';
      obs.observe(el);
    });
    this._observers.push(obs);
  }

  destroy() {
    this._observers.forEach(o => o.disconnect());
    if (this._unScroll) this._unScroll();
  }
}
App.register('features', FeaturesPage);