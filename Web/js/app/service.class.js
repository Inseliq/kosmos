/**
 * service.class.js — Страница услуг и товаров Space Z
 */

class ServicePage {
  constructor(root, app) {
    this.root = root;
    this.app = app;
    this._observers = [];
    this._unScroll = null;
    this._cart = [];
    this._activeTab = 'trips';
  }

  /* ═══════════════════════════════════════════════════════
     DATA
  ═══════════════════════════════════════════════════════ */
  get _trips() {
    return [
      {
        id: 't1',
        code: 'SZ-SUB',
        badge: null,
        color: 'cyan',
        icon: `<svg viewBox="0 0 64 64" fill="none">
          <path d="M32 56V20M32 20C32 20 20 28 20 40" stroke="#00ffff" stroke-width="2" stroke-linecap="round"/>
          <path d="M32 20C32 20 44 28 44 40" stroke="#00ffff" stroke-width="2" stroke-linecap="round"/>
          <ellipse cx="32" cy="18" rx="6" ry="10" stroke="#00ffff" stroke-width="2"/>
          <circle cx="32" cy="54" r="3" fill="#00ffff" opacity="0.6"/>
          <path d="M26 56 Q32 60 38 56" stroke="#00ffff" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
        </svg>`,
        name: 'Суборбитальный прыжок',
        subtitle: 'Грань между небом и космосом',
        alt: 'Высота 120 км',
        duration: '90 мин',
        altitude: '120 км',
        people: '1–12',
        difficulty: 'Лёгкий',
        diffColor: 'green',
        desc: 'Пересечь линию Кармана и увидеть кривизну Земли — этот полёт навсегда изменит твоё восприятие мира. Три дня предполётной подготовки, 90 минут абсолютного восторга.',
        includes: ['Предполётный тренинг 3 дня', 'Скафандр SpaceZ-S3', 'Персональная видеосъёмка', 'Сертификат астронавта FAA'],
        price: '85 000',
        currency: '$',
      },
      {
        id: 't2',
        code: 'SZ-047',
        badge: 'ХИТ',
        color: 'pink',
        icon: `<svg viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="20" stroke="#ff4173" stroke-width="2" opacity="0.4"/>
          <circle cx="32" cy="32" r="12" stroke="#ff4173" stroke-width="2" opacity="0.7"/>
          <circle cx="32" cy="32" r="5" fill="#ff4173"/>
          <path d="M32 4v8M32 52v8M4 32h8M52 32h8" stroke="#ff4173" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
          <circle cx="52" cy="12" r="3" fill="#ff4173" opacity="0.8"/>
        </svg>`,
        name: 'Орбита 400 — Станция',
        subtitle: 'Жизнь на Space Z Station',
        alt: 'МКС / SZS',
        duration: '7 суток',
        altitude: '408 км',
        people: '1–6',
        difficulty: 'Средний',
        diffColor: 'cyan',
        desc: '7 дней на борту орбитальной станции. Наблюдай восход Солнца каждые 90 минут, проводи научные эксперименты и плыви сквозь невесомость. Полное погружение в жизнь астронавта.',
        includes: ['Тренинг 14 дней в Байконуре', 'Стыковка с МКС по запросу', 'Доступ к лабораториям', 'Прямой эфир для семьи', 'Личная каюта 8 м²'],
        price: '1 200 000',
        currency: '$',
      },
      {
        id: 't3',
        code: 'SZ-EVA',
        badge: 'ЭКСТРИМ',
        color: 'green',
        icon: `<svg viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="24" stroke="#28ff39" stroke-width="1.5" stroke-dasharray="5 4" opacity="0.3"/>
          <circle cx="32" cy="32" r="10" stroke="#28ff39" stroke-width="2"/>
          <path d="M32 8v8M32 48v8M8 32h8M48 32h8" stroke="#28ff39" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>
          <path d="M22 22l4 4M38 38l4 4M42 22l-4 4M18 38l4 4" stroke="#28ff39" stroke-width="1.5" stroke-linecap="round" opacity="0.4"/>
          <circle cx="32" cy="32" r="3" fill="#28ff39"/>
        </svg>`,
        name: 'Выход в открытый космос',
        subtitle: 'EVA — только ты и бесконечность',
        alt: '400 км ∙ EVA',
        duration: '6 часов',
        altitude: '400 км',
        people: '1–2',
        difficulty: 'Сложный',
        diffColor: 'pink',
        desc: 'Самый захватывающий опыт в истории коммерческой космонавтики. Страховочный трос, звёздное небо в 360°, полная тишина. Программа включает 3 недели подготовки по стандарту NASA EVA.',
        includes: ['EVA-скафандр Orlan-MK+', 'Тренировки в гидролаборатории', 'Персональный инструктор-астронавт', 'NFT-сертификат EVA', 'Эксклюзивный патч миссии'],
        price: '3 500 000',
        currency: '$',
      },
      {
        id: 't4',
        code: 'SZ-LUN',
        badge: '2026',
        color: 'white',
        icon: `<svg viewBox="0 0 64 64" fill="none">
          <path d="M48 32a16 16 0 1 1-16-16 12 12 0 0 0 16 16Z" stroke="#ffffff" stroke-width="2" fill="rgba(255,255,255,0.05)"/>
          <circle cx="24" cy="26" r="2" fill="rgba(255,255,255,0.3)"/>
          <circle cx="34" cy="34" r="3" fill="rgba(255,255,255,0.2)"/>
          <circle cx="28" cy="38" r="1.5" fill="rgba(255,255,255,0.25)"/>
          <path d="M54 10l2 4 4 2-4 2-2 4-2-4-4-2 4-2 2-4Z" fill="rgba(255,255,255,0.4)"/>
        </svg>`,
        name: 'Лунный облёт Artemis Z',
        subtitle: 'Первый шаг к другому миру',
        alt: '384 400 км',
        duration: '14 суток',
        altitude: '384 400 км',
        people: '1–4',
        difficulty: 'Элитный',
        diffColor: 'white',
        desc: 'Облёт Луны по траектории Apollo 8 с обновлённой программой 2026 года. Вид на обратную сторону Луны, возможность посадки на лунную поверхность (опция +$8M). Только 4 места на борту.',
        includes: ['Подготовка 30 дней', 'Лунный модуль Artemis-Z (опция)', 'Личный командир миссии', 'Лунный грунт в подарок (100 г)', 'Именование малой планеты'],
        price: '12 000 000',
        currency: '$',
      },
      {
        id: 't5',
        code: 'SZ-MRS',
        badge: 'СКОРО',
        color: 'orange',
        icon: `<svg viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="18" stroke="#ff6b35" stroke-width="2" fill="rgba(255,107,53,0.08)"/>
          <circle cx="26" cy="28" r="4" fill="rgba(255,107,53,0.4)"/>
          <circle cx="38" cy="36" r="6" fill="rgba(255,107,53,0.25)"/>
          <circle cx="30" cy="40" r="2" fill="rgba(255,107,53,0.3)"/>
          <ellipse cx="32" cy="32" rx="24" ry="8" stroke="#ff6b35" stroke-width="1" stroke-dasharray="3 3" opacity="0.3" transform="rotate(-20 32 32)"/>
        </svg>`,
        name: 'Марсианский транзит',
        subtitle: 'Первый рейс к красной планете',
        alt: '54.6 млн км',
        duration: '210 суток',
        altitude: '54.6M км',
        people: '1–8',
        difficulty: 'Экспедиция',
        diffColor: 'orange',
        desc: 'Программа 2027 года. Первый коммерческий рейс к Марсу: 210 дней в пути, 30 дней на орбите красной планеты и исследование с помощью марсохода SZ-Rover. Регистрация уже открыта.',
        includes: ['Годовая подготовка в изоляции', 'Участие в марсианских исследованиях', 'Связь с Землёй (задержка 3–22 мин)', 'Приоритет в программе колонизации', 'Именной участок на Марсе 1 га'],
        price: '45 000 000',
        currency: '$',
      },
      {
        id: 't6',
        code: 'SZ-DRK',
        badge: 'ЭКСКЛЮЗИВ',
        color: 'purple',
        icon: `<svg viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="4" fill="#a855f7"/>
          <circle cx="32" cy="32" r="12" stroke="#a855f7" stroke-width="1" stroke-dasharray="2 3" opacity="0.5"/>
          <circle cx="32" cy="32" r="22" stroke="#a855f7" stroke-width="1" stroke-dasharray="1 4" opacity="0.3"/>
          <path d="M32 10v4M32 50v4M10 32h4M50 32h4M18.3 18.3l2.8 2.8M42.9 42.9l2.8 2.8M45.7 18.3l-2.8 2.8M21.1 42.9l-2.8 2.8" stroke="#a855f7" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>
        </svg>`,
        name: 'Тёмная сторона Вселенной',
        subtitle: 'Дрейф в точке Лагранжа L2',
        alt: 'L2 — 1.5 млн км',
        duration: '21 сутки',
        altitude: '1.5M км',
        people: '1–2',
        difficulty: 'Ультра',
        diffColor: 'purple',
        desc: 'Самый удалённый коммерческий рейс в истории. Точка Лагранжа L2 — место, где стоит телескоп Джеймс Уэбб. Абсолютная темнота, миллиард звёзд и ощущение настоящего одиночества Вселенной.',
        includes: ['Частный аппарат на 2 человека', 'Личный телескоп 300 мм на борту', 'Доступ к данным телескопа Уэбб', 'Сеанс со специалистом ESA', 'Именная звезда в каталоге IAU'],
        price: '28 000 000',
        currency: '$',
      },
    ];
  }

  get _accessories() {
    return [
      {
        id: 'a1', color: 'cyan',
        icon: `<svg viewBox="0 0 56 56" fill="none">
          <path d="M28 48V18M28 18C28 18 18 25 18 35" stroke="#00ffff" stroke-width="2" stroke-linecap="round"/>
          <path d="M28 18C28 18 38 25 38 35" stroke="#00ffff" stroke-width="2" stroke-linecap="round"/>
          <ellipse cx="28" cy="16" rx="5" ry="8" stroke="#00ffff" stroke-width="1.5"/>
          <circle cx="28" cy="47" r="2.5" fill="#00ffff" opacity="0.5"/>
        </svg>`,
        name: 'Ракета SpaceZ-S3', subtitle: 'Масштабная модель 1:72',
        desc: 'Точная копия нашего флагманского носителя. Металл + смола, ручная роспись, подставка из нержавеющей стали.',
        price: '12 900', tag: 'Бестселлер',
      },
      {
        id: 'a2', color: 'white',
        icon: `<svg viewBox="0 0 56 56" fill="none">
          <path d="M28 10a18 18 0 1 0 18 18A14 14 0 0 1 28 10Z" stroke="#ffffff" stroke-width="1.5" fill="rgba(255,255,255,0.05)"/>
          <circle cx="22" cy="24" r="2" fill="rgba(255,255,255,0.4)"/>
          <circle cx="30" cy="32" r="3" fill="rgba(255,255,255,0.3)"/>
          <circle cx="26" cy="36" r="1.5" fill="rgba(255,255,255,0.2)"/>
        </svg>`,
        name: 'Обломок метеорита', subtitle: 'Хондрит Сеймчан · 47 г',
        desc: 'Железо-каменный метеорит Сеймчан. Возраст 4.5 млрд лет. С сертификатом подлинности и координатами находки.',
        price: '38 000', tag: 'Редкость',
      },
      {
        id: 'a3', color: 'pink',
        icon: `<svg viewBox="0 0 56 56" fill="none">
          <rect x="16" y="12" width="24" height="32" rx="4" stroke="#ff4173" stroke-width="1.5"/>
          <rect x="20" y="16" width="16" height="12" rx="2" fill="rgba(255,65,115,0.15)" stroke="#ff4173" stroke-width="1"/>
          <circle cx="24" cy="36" r="2" stroke="#ff4173" stroke-width="1.5"/>
          <circle cx="32" cy="36" r="2" stroke="#ff4173" stroke-width="1.5"/>
          <path d="M20 32h16" stroke="#ff4173" stroke-width="1" stroke-dasharray="2 2" opacity="0.5"/>
        </svg>`,
        name: 'Бортовой журнал миссии', subtitle: 'Кожаный · A5 · 200 стр.',
        desc: 'Реплика официального дневника астронавта. Гравировка с позывным, внутри — карты орбит и бланки отчётов.',
        price: '4 200', tag: null,
      },
      {
        id: 'a4', color: 'green',
        icon: `<svg viewBox="0 0 56 56" fill="none">
          <circle cx="28" cy="28" r="18" stroke="#28ff39" stroke-width="1.5" opacity="0.4"/>
          <circle cx="28" cy="28" r="10" stroke="#28ff39" stroke-width="1.5"/>
          <path d="M28 14v4M28 38v4M14 28h4M38 28h4" stroke="#28ff39" stroke-width="1.5" stroke-linecap="round" opacity="0.7"/>
          <circle cx="28" cy="28" r="3" fill="#28ff39" opacity="0.8"/>
        </svg>`,
        name: 'Астрограф SZ-200', subtitle: 'Телескоп-рефлектор 200 мм',
        desc: 'Профессиональный телескоп для наблюдений с автонаведением. Виден Юпитер с кольцами, галактика Андромеды.',
        price: '127 000', tag: 'Выбор экспертов',
      },
      {
        id: 'a5', color: 'cyan',
        icon: `<svg viewBox="0 0 56 56" fill="none">
          <rect x="14" y="20" width="28" height="20" rx="10" stroke="#00ffff" stroke-width="1.5"/>
          <circle cx="22" cy="30" r="4" stroke="#00ffff" stroke-width="1.5"/>
          <circle cx="34" cy="30" r="4" stroke="#00ffff" stroke-width="1.5"/>
          <path d="M10 30h4M42 30h4" stroke="#00ffff" stroke-width="1.5" stroke-linecap="round"/>
          <path d="M22 20v-4M34 20v-4" stroke="#00ffff" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
        </svg>`,
        name: 'Шлем Replica EVA', subtitle: 'Полноразмерный · 1:1',
        desc: 'Точная реплика шлема программы EVA. Внутренняя подсветка, регулируемое забрало, фирменный логотип Space Z.',
        price: '89 000', tag: null,
      },
      {
        id: 'a6', color: 'white',
        icon: `<svg viewBox="0 0 56 56" fill="none">
          <path d="M20 44V28L28 12L36 28V44" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M20 36h16" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"/>
          <path d="M22 44h12" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"/>
          <circle cx="28" cy="20" r="3" fill="rgba(255,255,255,0.5)"/>
        </svg>`,
        name: 'Лунный грунт (реголит)', subtitle: 'Сертифицированный аналог · 50 г',
        desc: 'Официальный аналог лунного реголита, идентичный по составу. Используется в тренировках астронавтов NASA. В запаянной колбе.',
        price: '9 800', tag: 'Лимитировано',
      },
      {
        id: 'a7', color: 'pink',
        icon: `<svg viewBox="0 0 56 56" fill="none">
          <rect x="12" y="18" width="32" height="22" rx="3" stroke="#ff4173" stroke-width="1.5"/>
          <path d="M12 26h32" stroke="#ff4173" stroke-width="1" opacity="0.4"/>
          <circle cx="20" cy="22" r="1.5" fill="#ff4173" opacity="0.6"/>
          <circle cx="26" cy="22" r="1.5" fill="#ff4173" opacity="0.6"/>
          <rect x="16" y="30" width="24" height="6" rx="1.5" stroke="#ff4173" stroke-width="1" opacity="0.6"/>
          <path d="M22 40v4M34 40v4" stroke="#ff4173" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
        </svg>`,
        name: 'Набор Space Z Junior', subtitle: 'Конструктор ракеты · 6–14 лет',
        desc: 'Образовательный конструктор из 340 деталей. Модель настоящей ракеты с реактивным двигателем на воде. Запускается на высоту 30 м.',
        price: '3 600', tag: null,
      },
      {
        id: 'a8', color: 'green',
        icon: `<svg viewBox="0 0 56 56" fill="none">
          <path d="M28 10C28 10 12 18 12 30C12 40 20 46 28 46C36 46 44 40 44 30C44 18 28 10 28 10Z" stroke="#28ff39" stroke-width="1.5"/>
          <path d="M20 30C20 26 24 22 28 22C32 22 36 26 36 30" stroke="#28ff39" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>
          <circle cx="28" cy="34" r="4" stroke="#28ff39" stroke-width="1.5"/>
        </svg>`,
        name: 'Топливо для мечты', subtitle: 'Виски «Methane Ignition» 0.7 л',
        desc: 'Лимитированный виски в форме топливного бака. Выдержка 12 лет, шотландский односолодовый. Коллаборация с Glenfarclas.',
        price: '18 500', tag: 'Коллаборация',
      },
      {
        id: 'a9', color: 'purple',
        icon: `<svg viewBox="0 0 56 56" fill="none">
          <rect x="14" y="14" width="28" height="28" rx="4" stroke="#a855f7" stroke-width="1.5"/>
          <path d="M20 28h16M28 20v16" stroke="#a855f7" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
          <circle cx="28" cy="28" r="6" stroke="#a855f7" stroke-width="1.5"/>
          <circle cx="28" cy="28" r="2" fill="#a855f7" opacity="0.8"/>
          <path d="M14 20h4M14 28h4M14 36h4M42 20h-4M42 28h-4M42 36h-4" stroke="#a855f7" stroke-width="1" stroke-linecap="round" opacity="0.3"/>
        </svg>`,
        name: 'Звёздная карта «My Sky»', subtitle: 'Персонализированная · 60×90 см',
        desc: 'Карта звёздного неба в любую дату, время и координаты. Печать на алюминиевой пластине, рамка из анодированного металла.',
        price: '7 400', tag: null,
      },
    ];
  }

  /* ═══════════════════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════════════════ */
  render() {
    Layout.mount(this.root, { active: 'service' });
    const slot = Layout.slot();

    slot.innerHTML = `
      <!-- PAGE HEADER -->
      <div class="srv-hero">
        <div class="srv-hero__inner">
          <div class="srv-hero__label">// Каталог Space Z</div>
          <h1 class="srv-hero__title">
            Услуги<br/>&amp; <em class="accent-cyan">Товары</em>
          </h1>
          <p class="srv-hero__desc">
            Выбери миссию своей жизни или возьми кусочек космоса домой.
            Каждый продукт — часть большой истории.
          </p>
          <!-- Tab switcher -->
          <div class="srv-tabs">
            <button class="srv-tab srv-tab--active" data-tab="trips">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 14V6M8 6C8 6 4 9 4 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M8 6C8 6 12 9 12 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <ellipse cx="8" cy="5" rx="2.5" ry="4" stroke="currentColor" stroke-width="1.5"/>
              </svg>
              Рейсы и миссии
              <span class="srv-tab__count">6</span>
            </button>
            <button class="srv-tab" data-tab="accessories">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="3" y="3" width="10" height="10" rx="2" stroke="currentColor" stroke-width="1.5"/>
                <path d="M6 8h4M8 6v4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              Аксессуары
              <span class="srv-tab__count">9</span>
            </button>
          </div>
        </div>
        <!-- Декоративные орбиты -->
        <div class="srv-hero__deco">
          <div class="deco-ring dr1"></div>
          <div class="deco-ring dr2"></div>
          <div class="deco-ring dr3"></div>
          <div class="deco-dot dd1"></div>
          <div class="deco-dot dd2"></div>
          <div class="deco-dot dd3"></div>
        </div>
      </div>

      <!-- TRIPS PANEL -->
      <div class="srv-panel" id="panel-trips">
        <div class="srv-panel__inner">
          <div class="trips-grid" id="trips-grid">
            ${this._trips.map(t => this._tripCard(t)).join('')}
          </div>
        </div>
      </div>

      <!-- ACCESSORIES PANEL -->
      <div class="srv-panel srv-panel--hidden" id="panel-accessories">
        <div class="srv-panel__inner">
          <div class="acc-grid" id="acc-grid">
            ${this._accessories.map(a => this._accCard(a)).join('')}
          </div>
        </div>
      </div>

      <!-- CART TOAST -->
      <div class="cart-toast" id="cartToast">
        <span class="cart-toast__icon">✓</span>
        <span class="cart-toast__text">Добавлено в корзину</span>
      </div>
    `;

    this._initTabs();
    this._initCards();
    this._initScrollReveal();
    this._unScroll = Layout.initScrollShadow();
  }

  /* ═══════════════════════════════════════════════════════
     TRIP CARD TEMPLATE
  ═══════════════════════════════════════════════════════ */
  _tripCard(t) {
    const diff = {
      green: 'accent-green', cyan: 'accent-cyan',
      pink: 'accent-pink', white: '', orange: 'accent-orange', purple: 'accent-purple',
    }[t.diffColor] || '';

    const includes = t.includes.map(i => `
      <li class="trip-include">
        <span class="ti-dot"></span>${i}
      </li>`).join('');

    return `
      <article class="trip-card trip-card--${t.color} reveal-item" data-id="${t.id}">
        ${t.badge ? `<div class="trip-badge trip-badge--${t.color}">${t.badge}</div>` : ''}

        <div class="trip-card__top">
          <div class="trip-card__icon">${t.icon}</div>
          <div class="trip-card__meta-top">
            <span class="trip-code">${t.code}</span>
            <span class="trip-alt">${t.alt}</span>
          </div>
        </div>

        <div class="trip-card__body">
          <h3 class="trip-name">${t.name}</h3>
          <p class="trip-subtitle">${t.subtitle}</p>
          <p class="trip-desc">${t.desc}</p>
        </div>

        <div class="trip-card__specs">
          <div class="spec-item">
            <span class="spec-l">Длительность</span>
            <span class="spec-v">${t.duration}</span>
          </div>
          <div class="spec-item">
            <span class="spec-l">Высота</span>
            <span class="spec-v">${t.altitude}</span>
          </div>
          <div class="spec-item">
            <span class="spec-l">Пассажиры</span>
            <span class="spec-v">${t.people}</span>
          </div>
          <div class="spec-item">
            <span class="spec-l">Сложность</span>
            <span class="spec-v ${diff}">${t.difficulty}</span>
          </div>
        </div>

        <ul class="trip-includes">${includes}</ul>

        <div class="trip-card__footer">
          <div class="trip-price">
            <span class="tp-from">от</span>
            <span class="tp-val">${t.currency}${t.price}</span>
          </div>
          <button class="btn-book" data-id="${t.id}" data-name="${t.name}" data-price="${t.price}">
            Забронировать
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </article>
    `;
  }

  /* ═══════════════════════════════════════════════════════
     ACCESSORY CARD TEMPLATE
  ═══════════════════════════════════════════════════════ */
  _accCard(a) {
    return `
      <article class="acc-card acc-card--${a.color} reveal-item" data-id="${a.id}">
        ${a.tag ? `<div class="acc-badge">${a.tag}</div>` : ''}
        <div class="acc-card__icon">${a.icon}</div>
        <div class="acc-card__body">
          <h3 class="acc-name">${a.name}</h3>
          <p class="acc-subtitle">${a.subtitle}</p>
          <p class="acc-desc">${a.desc}</p>
        </div>
        <div class="acc-card__footer">
          <span class="acc-price">₽ ${a.price}</span>
          <button class="btn-cart" data-id="${a.id}" data-name="${a.name}" data-price="${a.price}">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 2h1.5l1 6h7l1-4H5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="7" cy="13" r="1" fill="currentColor"/>
              <circle cx="11" cy="13" r="1" fill="currentColor"/>
            </svg>
            В корзину
          </button>
        </div>
      </article>
    `;
  }

  /* ═══════════════════════════════════════════════════════
     TABS
  ═══════════════════════════════════════════════════════ */
  _initTabs() {
    const tabs = this.root.querySelectorAll('.srv-tab');
    const panels = { trips: document.getElementById('panel-trips'), accessories: document.getElementById('panel-accessories') };

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const key = tab.dataset.tab;
        if (this._activeTab === key) return;
        this._activeTab = key;

        tabs.forEach(t => t.classList.remove('srv-tab--active'));
        tab.classList.add('srv-tab--active');

        Object.entries(panels).forEach(([k, panel]) => {
          if (k === key) {
            panel.classList.remove('srv-panel--hidden');
            panel.classList.add('srv-panel--visible');
            // re-trigger reveal for this panel
            setTimeout(() => {
              panel.querySelectorAll('.reveal-item').forEach((el, i) => {
                el.style.transitionDelay = (i % 6) * 60 + 'ms';
                el.classList.add('revealed');
              });
            }, 50);
          } else {
            panel.classList.add('srv-panel--hidden');
            panel.classList.remove('srv-panel--visible');
          }
        });
      });
    });
  }

  /* ═══════════════════════════════════════════════════════
     BOOK / CART BUTTONS
  ═══════════════════════════════════════════════════════ */
  _initCards() {
    this.root.addEventListener('click', (e) => {
      const book = e.target.closest('.btn-book');
      const cart = e.target.closest('.btn-cart');

      if (book) {
        this._flashButton(book, 'Запрос отправлен!');
        this._showToast(`Бронирование: ${book.dataset.name}`);
      }
      if (cart) {
        this._flashButton(cart, '✓ Добавлено');
        this._showToast(`В корзину: ${cart.dataset.name}`);
      }
    });
  }

  _flashButton(btn, text) {
    const orig = btn.innerHTML;
    btn.textContent = text;
    btn.disabled = true;
    btn.classList.add('btn--success');
    setTimeout(() => { btn.innerHTML = orig; btn.disabled = false; btn.classList.remove('btn--success'); }, 2200);
  }

  _showToast(msg) {
    const toast = document.getElementById('cartToast');
    toast.querySelector('.cart-toast__text').textContent = msg;
    toast.classList.add('active');
    setTimeout(() => toast.classList.remove('active'), 2800);
  }

  /* ═══════════════════════════════════════════════════════
     SCROLL REVEAL
  ═══════════════════════════════════════════════════════ */
  _initScrollReveal() {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

    // Trips panel visible by default — trigger immediately
    this.root.querySelectorAll('#panel-trips .reveal-item').forEach((el, i) => {
      el.style.transitionDelay = (i % 6) * 80 + 'ms';
      obs.observe(el);
    });

    this._observers.push(obs);
  }

  /* ═══════════════════════════════════════════════════════
     DESTROY
  ═══════════════════════════════════════════════════════ */
  destroy() {
    this._observers.forEach(o => o.disconnect());
    if (this._unScroll) this._unScroll();
  }
}

App.register('service', ServicePage);