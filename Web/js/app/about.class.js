/**
 * about.class.js — Страница «О нас»
 */
class AboutPage {
  constructor(root, app) {
    this.root = root; this.app = app;
    this._observers = []; this._unScroll = null;
  }

  get _team() {
    return [
      {
        name: 'Алекс Воронов', role: 'Основатель & CEO', since: '2019', glyph: '◈',
        bio: 'Бывший военный лётчик, инженер-ракетчик. Прошёл отбор в Роскосмос, основал Space Z после 15 лет в авиации.'
      },
      {
        name: 'Юи Танака', role: 'Chief Engineer', since: '2019', glyph: '◉',
        bio: 'Доктор аэрокосмической инженерии MIT. Разработала двигатель Methane-X — основу всего флота Space Z.'
      },
      {
        name: 'Маркус Брэдли', role: 'Chief Safety Officer', since: '2020', glyph: '◆',
        bio: '20 лет в NASA. Руководил программой Orion. Автор системы тройного резервирования SZ-Safe.'
      },
      {
        name: 'Наиля Ахмедова', role: 'Head of Passenger UX', since: '2021', glyph: '◇',
        bio: 'Психолог и дизайнер опыта. Создала программу подготовки пассажиров, снизившую тревожность на 94%.'
      },
      {
        name: 'Дин Чэнь', role: 'Lead Propulsion', since: '2020', glyph: '⬡',
        bio: 'Соавтор двух патентов на многоразовые ступени. До Space Z — SpaceX Falcon 9 первых ступеней.'
      },
      {
        name: 'Карина Волк', role: 'CFO & Legal', since: '2022', glyph: '◍',
        bio: 'Лицензировала Space Z в 12 юрисдикциях. Привлекла $4.2B инвестиций от ведущих фондов мира.'
      },
    ];
  }

  get _timeline() {
    return [
      { year: '2019', title: 'Основание', desc: 'Space Z зарегистрирована в Байконуре. Первые 12 сотрудников, гараж и большая мечта.' },
      { year: '2020', title: 'Прототип', desc: 'Первый запуск тестового двигателя Methane-X. Успешное зажигание с третьей попытки.' },
      { year: '2021', title: 'First Light', desc: 'Первый коммерческий суборбитальный рейс. 4 пассажира, 120 км, мировые СМИ.' },
      { year: '2022', title: 'Орбита', desc: 'Выход на орбиту. Стыковка с МКС. Первый EVA-рекорд — 8 часов 12 минут.' },
      { year: '2023', title: 'Масштаб', desc: 'Открытие SZ Station. Регулярные рейсы 2 раза в месяц. 1000+ пассажиров.' },
      { year: '2024', title: 'Сегодня', desc: '12 400 пассажиров. Офисы в 4 странах. Подготовка лунной программы 2025.' },
    ];
  }

  render() {
    Layout.mount(this.root, { active: 'about' });
    const slot = Layout.slot();
    slot.innerHTML = `
      <!-- HERO -->
      <div class="ab-hero">
        <div class="ab-hero__inner">
          <div class="ab-hero__label reveal-item">// О компании</div>
          <h1 class="ab-hero__title reveal-item">
            Люди, которые<br/>делают <em class="ab-cyan">космос</em><br/>реальным
          </h1>
          <p class="ab-hero__desc reveal-item">
            Space Z — это не просто компания. Это 1 200 человек, объединённых одной целью: сделать так, чтобы любой человек на Земле мог однажды посмотреть на неё сверху.
          </p>
        </div>
        <div class="ab-hero__visual reveal-item">
          <div class="ab-globe">
            <div class="ab-globe__ring ab-globe__ring--1"></div>
            <div class="ab-globe__ring ab-globe__ring--2"></div>
            <div class="ab-globe__ring ab-globe__ring--3"></div>
            <div class="ab-globe__core">
              <img src="./Web/images/logo.svg" alt="Space Z"/>
            </div>
            <div class="ab-globe__dot d1"></div>
            <div class="ab-globe__dot d2"></div>
            <div class="ab-globe__dot d3"></div>
            <div class="ab-globe__dot d4"></div>
          </div>
        </div>
      </div>

      <!-- VALUES -->
      <section class="ab-section ab-values">
        <div class="ab-section__inner">
          <div class="ab-section__label reveal-item">// Ценности</div>
          <div class="ab-values__grid">
            ${[
        { n: '01', title: 'Безопасность', icon: '◈', color: 'cyan', text: '3 400 точек контроля на каждый рейс. Нулевой компромисс с безопасностью — это не лозунг, это архитектура.' },
        { n: '02', title: 'Открытость', icon: '◉', color: 'green', text: 'Каждый человек заслуживает видеть Землю с орбиты. Мы снижаем цену каждый год на пути к этой цели.' },
        { n: '03', title: 'Инновации', icon: '◆', color: 'pink', text: 'Собственные двигатели, ИИ-навигация, многоразовые ступени — мы строим технологии будущего сегодня.' },
        { n: '04', title: 'Прозрачность', icon: '◇', color: 'cyan', text: 'Публичные данные о всех рейсах, open-source навигационное ПО и ежеквартальные отчёты о безопасности.' },
      ].map(v => `
              <div class="ab-value reveal-item">
                <div class="ab-value__top">
                  <span class="ab-value__num">${v.n}</span>
                  <span class="ab-value__icon ab-val--${v.color}">${v.icon}</span>
                </div>
                <h3 class="ab-value__title">${v.title}</h3>
                <p class="ab-value__text">${v.text}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- TIMELINE -->
      <section class="ab-section ab-history">
        <div class="ab-section__inner">
          <div class="ab-section__label reveal-item">// История</div>
          <h2 class="ab-section__title reveal-item">5 лет.<br/><em class="ab-cyan">Вечность</em> впереди.</h2>
          <div class="ab-timeline">
            ${this._timeline.map((t, i) => `
              <div class="ab-tl-item reveal-item">
                <div class="ab-tl-year">${t.year}</div>
                <div class="ab-tl-connector">
                  <div class="ab-tl-dot"></div>
                  ${i < this._timeline.length - 1 ? '<div class="ab-tl-line"></div>' : ''}
                </div>
                <div class="ab-tl-body">
                  <h4>${t.title}</h4>
                  <p>${t.desc}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- TEAM -->
      <section class="ab-section ab-team">
        <div class="ab-section__inner">
          <div class="ab-section__label reveal-item">// Команда</div>
          <h2 class="ab-section__title reveal-item">Люди за<br/><em class="ab-pink">миссией</em></h2>
          <div class="ab-team__grid">
            ${this._team.map(p => `
              <div class="ab-member reveal-item">
                <div class="ab-member__avatar">
                  <span class="ab-member__glyph">${p.glyph}</span>
                  <div class="ab-member__ring"></div>
                </div>
                <div class="ab-member__body">
                  <div class="ab-member__since">с ${p.since}</div>
                  <h3 class="ab-member__name">${p.name}</h3>
                  <p class="ab-member__role">${p.role}</p>
                  <p class="ab-member__bio">${p.bio}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- OFFICES -->
      <section class="ab-section ab-offices">
        <div class="ab-section__inner">
          <div class="ab-section__label reveal-item">// Офисы</div>
          <div class="ab-offices__grid">
            ${[
        { city: 'Байконур', role: 'Штаб-квартира & Космодром', coords: '45.6°N 63.3°E', color: 'cyan' },
        { city: 'Хьюстон', role: 'Центр управления полётами', coords: '29.7°N 95.3°W', color: 'pink' },
        { city: 'Токио', role: 'R&D & Азиатский хаб', coords: '35.6°N 139.6°E', color: 'green' },
        { city: 'Дубай', role: 'Продажи & VIP-клиенты', coords: '25.2°N 55.2°E', color: 'white' },
      ].map(o => `
              <div class="ab-office reveal-item">
                <div class="ab-office__dot ab-dot--${o.color}"></div>
                <h3 class="ab-office__city">${o.city}</h3>
                <p class="ab-office__role">${o.role}</p>
                <span class="ab-office__coords">${o.coords}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    `;
    this._initReveal();
    this._unScroll = Layout.initScrollShadow();
  }

  _initReveal() {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); } });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    this.root.querySelectorAll('.reveal-item').forEach((el, i) => {
      el.style.transitionDelay = (i % 4) * 90 + 'ms'; obs.observe(el);
    });
    this._observers.push(obs);
  }

  destroy() { this._observers.forEach(o => o.disconnect()); if (this._unScroll) this._unScroll(); }
}
App.register('about', AboutPage);