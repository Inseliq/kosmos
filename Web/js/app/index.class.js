/**
 * index.class.js — Главная страница Space Z
 */

class IndexPage {
  constructor(root, app) {
    this.root = root;
    this.app = app;
    this.canvas = null;
    this.ctx = null;
    this.stars = [];
    this.meteors = [];
    this.animFrame = null;
    this._onResize = this._handleResize.bind(this);
    this._unScroll = null;
    this._observers = [];
  }

  /* ─────────────────────────────────────────────────────
     RENDER
  ───────────────────────────────────────────────────── */
  render() {
    Layout.mount(this.root, { active: 'index' });
    const slot = Layout.slot();

    slot.innerHTML = `
      <canvas class="starfield" id="starfield"></canvas>

      <!-- ══ HERO ══════════════════════════════════════ -->
      <section class="hero">
        <div class="hero-content">
          <div class="hero-badge" data-anim="0">
            <span class="badge-dot"></span>
            Рейсы открыты — 2025
          </div>
          <h1 class="hero-title">
            <span class="tl tl--1" data-anim="1">ИССЛЕДОВАТЬ</span>
            <span class="tl tl--2" data-anim="2"><em class="accent-cyan">КОСМОС</em></span>
            <span class="tl tl--3" data-anim="3">С НАМИ</span>
          </h1>
          <p class="hero-desc" data-anim="4">
            Первая коммерческая программа суборбитальных и орбитальных путешествий.
            Твой полёт начинается здесь.
          </p>
          <div class="hero-actions" data-anim="5">
            <button class="btn-primary" data-navigate="ticket">Забронировать рейс</button>
            <button class="btn-ghost" data-navigate="service">
              Как это работает
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M4 9h10M10 5l4 4-4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
          <div class="hero-stats" data-anim="6">
            <div class="stat"><span class="stat-n">247</span><span class="stat-l">Рейсов</span></div>
            <div class="stat-sep"></div>
            <div class="stat"><span class="stat-n">12 400<small>+</small></span><span class="stat-l">Пассажиров</span></div>
            <div class="stat-sep"></div>
            <div class="stat"><span class="stat-n">99.8<small>%</small></span><span class="stat-l">Успех</span></div>
          </div>
        </div>

        <div class="hero-visual" data-anim="7">
          <div class="planet-wrap">
            <div class="planet-glow"></div>
            <div class="planet">
              <div class="planet-surface"></div>
              <div class="planet-atmosphere"></div>
            </div>
            <div class="planet-ring-wrap"><div class="planet-ring"></div></div>
          </div>
          <div class="orbit o1"><span class="odot odot--green"></span></div>
          <div class="orbit o2"><span class="odot odot--pink"></span></div>
          <div class="orbit o3"><span class="odot odot--cyan"></span></div>
          <div class="float-tag ft1">ISS <span>↑ 408 km</span></div>
          <div class="float-tag ft2">MOON <span>↑ 384 000 km</span></div>
        </div>
      </section>

      <div class="scroll-hint">
        <div class="scroll-line"></div>
        <span>Прокрути вниз</span>
      </div>

      <!-- ══ 1. О КОМПАНИИ ══════════════════════════════ -->
      <section class="section s-about reveal-section">
        <div class="s-about__inner">
          <div class="s-about__label reveal-item">// 001 — О КОМПАНИИ</div>
          <div class="s-about__grid">
            <div class="s-about__left reveal-item">
              <h2 class="sec-title">Мы делаем<br/><em class="accent-pink">космос</em><br/>доступным</h2>
            </div>
            <div class="s-about__right">
              <p class="sec-text reveal-item">
                Space Z — первая в мире частная компания, открывшая регулярные
                коммерческие рейсы за пределы атмосферы Земли. С 2019 года мы
                переписываем правила того, что значит путешествовать.
              </p>
              <p class="sec-text reveal-item">
                Наша штаб-квартира находится в Байконуре, операционные центры —
                в Хьюстоне, Токио и Дубае. Более 1 200 инженеров, пилотов и
                учёных работают над тем, чтобы каждый полёт был безупречным.
              </p>
              <div class="s-about__tags reveal-item">
                <span class="tag tag--cyan">Лицензия FAA</span>
                <span class="tag tag--green">ISO 9001</span>
                <span class="tag tag--pink">NASA Partner</span>
                <span class="tag">ROSCOSMOS</span>
              </div>
            </div>
          </div>
          <div class="s-about__numbers">
            <div class="abt-num reveal-item">
              <span class="abt-n" data-count="2019">2019</span>
              <span class="abt-l">Год основания</span>
            </div>
            <div class="abt-num reveal-item">
              <span class="abt-n" data-count="1200">1 200<small>+</small></span>
              <span class="abt-l">Сотрудников</span>
            </div>
            <div class="abt-num reveal-item">
              <span class="abt-n" data-count="6">6</span>
              <span class="abt-l">Типов ракет</span>
            </div>
            <div class="abt-num reveal-item">
              <span class="abt-n" data-count="38">38</span>
              <span class="abt-l">Стран клиентов</span>
            </div>
          </div>
        </div>
      </section>

      <!-- ══ 2. ЧТО МЫ ДЕЛАЕМ ═══════════════════════════ -->
      <section class="section s-what reveal-section">
        <div class="s-what__inner">
          <div class="s-what__head">
            <div class="s-what__label reveal-item">// 002 — ЧТО МЫ ДЕЛАЕМ</div>
            <h2 class="sec-title reveal-item">Три направления<br/><em class="accent-cyan">одной мечты</em></h2>
          </div>
          <div class="s-what__cards">
            <div class="what-card reveal-item">
              <div class="what-card__icon">
                <svg viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="24" r="22" stroke="#00ffff" stroke-width="1.5" opacity="0.3"/>
                  <path d="M24 8v8M24 32v8M8 24h8M32 24h8" stroke="#00ffff" stroke-width="1.5" stroke-linecap="round"/>
                  <circle cx="24" cy="24" r="7" stroke="#00ffff" stroke-width="2"/>
                  <circle cx="24" cy="24" r="2" fill="#00ffff"/>
                </svg>
              </div>
              <span class="what-card__num">01</span>
              <h3>Суборбитальные<br/>путешествия</h3>
              <p>90 минут в состоянии невесомости. Вид на кривизну Земли. Незабываемый опыт для тех, кто ищет новое.</p>
              <div class="what-card__footer">
                <span class="what-card__price">от $85 000</span>
                <a data-navigate="service" class="what-card__link">Подробнее →</a>
              </div>
            </div>

            <div class="what-card what-card--featured reveal-item">
              <div class="what-card__badge">Хит</div>
              <div class="what-card__icon">
                <svg viewBox="0 0 48 48" fill="none">
                  <ellipse cx="24" cy="24" rx="22" ry="10" stroke="#ff4173" stroke-width="1.5" opacity="0.4"/>
                  <ellipse cx="24" cy="24" rx="14" ry="6" stroke="#ff4173" stroke-width="1.5" opacity="0.6"/>
                  <circle cx="24" cy="24" r="5" fill="#ff4173" opacity="0.9"/>
                  <path d="M24 2v10M24 36v10M2 24h10M36 24h10" stroke="#ff4173" stroke-width="1" stroke-linecap="round" opacity="0.5"/>
                </svg>
              </div>
              <span class="what-card__num">02</span>
              <h3>Орбитальная<br/>станция</h3>
              <p>7 дней на борту Space Z Station. Научные эксперименты, жизнь в невесомости и панорама всей планеты.</p>
              <div class="what-card__footer">
                <span class="what-card__price">от $1 200 000</span>
                <a data-navigate="service" class="what-card__link">Подробнее →</a>
              </div>
            </div>

            <div class="what-card reveal-item">
              <div class="what-card__icon">
                <svg viewBox="0 0 48 48" fill="none">
                  <path d="M24 4L28 20H44L31 30L36 46L24 37L12 46L17 30L4 20H20L24 4Z" stroke="#28ff39" stroke-width="1.5" stroke-linejoin="round"/>
                  <circle cx="24" cy="24" r="5" fill="#28ff39" opacity="0.8"/>
                </svg>
              </div>
              <span class="what-card__num">03</span>
              <h3>Лунная<br/>программа</h3>
              <p>Облёт Луны и высадка на лунную поверхность. Эксклюзивная программа 2026 года для самых смелых.</p>
              <div class="what-card__footer">
                <span class="what-card__price">от $12 000 000</span>
                <a data-navigate="service" class="what-card__link">Подробнее →</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ══ 3. ПОПУЛЯРНЫЕ РЕЙСЫ ════════════════════════ -->
      <section class="section s-flights reveal-section">
        <div class="s-flights__inner">
          <div class="s-flights__label reveal-item">// 003 — ПОПУЛЯРНЫЕ РЕЙСЫ</div>
          <div class="s-flights__head reveal-item">
            <h2 class="sec-title">Ближайшие<br/><em class="accent-cyan">старты</em></h2>
            <button class="btn-ghost" data-navigate="ticket">Все рейсы →</button>
          </div>

          <div class="flights-list">

            <div class="flight-card reveal-item">
              <div class="flight-card__stripe flight-card__stripe--cyan"></div>
              <div class="flight-card__left">
                <div class="flight-card__code">SZ-047</div>
                <div class="flight-card__route">
                  <span class="flight-from">LEO</span>
                  <svg width="60" height="16" viewBox="0 0 60 16" fill="none">
                    <line x1="0" y1="8" x2="52" y2="8" stroke="rgba(255,255,255,0.2)" stroke-width="1" stroke-dasharray="4 3"/>
                    <path d="M48 4l8 4-8 4" fill="none" stroke="#00ffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span class="flight-to">ISS</span>
                </div>
                <div class="flight-card__name">Орбита 400 — Станция</div>
              </div>
              <div class="flight-card__meta">
                <div class="fm-item"><span class="fm-l">Старт</span><span class="fm-v">14 апр 2025</span></div>
                <div class="fm-item"><span class="fm-l">Длительность</span><span class="fm-v">7 суток</span></div>
                <div class="fm-item"><span class="fm-l">Мест</span><span class="fm-v accent-green">3 / 6</span></div>
              </div>
              <div class="flight-card__right">
                <div class="flight-card__price">$1 200 000</div>
                <button class="btn-primary" data-navigate="ticket">Забронировать</button>
              </div>
            </div>

            <div class="flight-card reveal-item">
              <div class="flight-card__stripe flight-card__stripe--pink"></div>
              <div class="flight-card__left">
                <div class="flight-card__code">SZ-048</div>
                <div class="flight-card__route">
                  <span class="flight-from">GND</span>
                  <svg width="60" height="16" viewBox="0 0 60 16" fill="none">
                    <line x1="0" y1="8" x2="52" y2="8" stroke="rgba(255,255,255,0.2)" stroke-width="1" stroke-dasharray="4 3"/>
                    <path d="M48 4l8 4-8 4" fill="none" stroke="#ff4173" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span class="flight-to">SUB</span>
                </div>
                <div class="flight-card__name">Суборбитальный прыжок</div>
              </div>
              <div class="flight-card__meta">
                <div class="fm-item"><span class="fm-l">Старт</span><span class="fm-v">22 апр 2025</span></div>
                <div class="fm-item"><span class="fm-l">Длительность</span><span class="fm-v">90 минут</span></div>
                <div class="fm-item"><span class="fm-l">Мест</span><span class="fm-v accent-green">7 / 12</span></div>
              </div>
              <div class="flight-card__right">
                <div class="flight-card__price">$85 000</div>
                <button class="btn-primary" data-navigate="ticket">Забронировать</button>
              </div>
            </div>

            <div class="flight-card reveal-item">
              <div class="flight-card__stripe flight-card__stripe--green"></div>
              <div class="flight-card__left">
                <div class="flight-card__code">SZ-051</div>
                <div class="flight-card__route">
                  <span class="flight-from">LEO</span>
                  <svg width="60" height="16" viewBox="0 0 60 16" fill="none">
                    <line x1="0" y1="8" x2="52" y2="8" stroke="rgba(255,255,255,0.2)" stroke-width="1" stroke-dasharray="4 3"/>
                    <path d="M48 4l8 4-8 4" fill="none" stroke="#28ff39" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span class="flight-to">LUN</span>
                </div>
                <div class="flight-card__name">Лунный облёт — Artemis Z</div>
              </div>
              <div class="flight-card__meta">
                <div class="fm-item"><span class="fm-l">Старт</span><span class="fm-v">10 июн 2025</span></div>
                <div class="fm-item"><span class="fm-l">Длительность</span><span class="fm-v">14 суток</span></div>
                <div class="fm-item"><span class="fm-l">Мест</span><span class="fm-v accent-pink">1 / 4</span></div>
              </div>
              <div class="flight-card__right">
                <div class="flight-card__price">$12 000 000</div>
                <button class="btn-primary" data-navigate="ticket">Забронировать</button>
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- ══ 4. ФИЛОСОФИЯ ══════════════════════════════ -->
      <section class="section s-philosophy reveal-section">
        <div class="s-philosophy__inner">
          <div class="s-philosophy__label reveal-item">// 004 — ФИЛОСОФИЯ</div>

          <div class="s-philosophy__hero reveal-item">
            <blockquote class="philosophy-quote">
              <span class="pq-mark">"</span>
              Космос — это не привилегия избранных.<br/>
              Это <em class="accent-cyan">следующий шаг</em> эволюции человечества.
              <span class="pq-mark">"</span>
            </blockquote>
            <cite class="philosophy-author">— Алекс Воронов, основатель Space Z</cite>
          </div>

          <div class="philosophy-pillars">
            <div class="pillar reveal-item">
              <div class="pillar__number">I</div>
              <div class="pillar__body">
                <h3 class="pillar__title">Безопасность<br/>прежде всего</h3>
                <p class="pillar__text">Каждый рейс проходит 3 400 точек контроля. Мы не выпустим ракету, пока не убедимся в абсолютной надёжности каждого болта.</p>
              </div>
              <div class="pillar__line"></div>
            </div>
            <div class="pillar reveal-item">
              <div class="pillar__number">II</div>
              <div class="pillar__body">
                <h3 class="pillar__title">Технологии<br/>без границ</h3>
                <p class="pillar__text">Собственные двигатели на метане, многоразовые носители и ИИ-система навигации — мы строим будущее внутри компании.</p>
              </div>
              <div class="pillar__line"></div>
            </div>
            <div class="pillar reveal-item">
              <div class="pillar__number">III</div>
              <div class="pillar__body">
                <h3 class="pillar__title">Открытость<br/>вселенной</h3>
                <p class="pillar__text">Программы стипендий, партнёрства с университетами и образовательные рейсы — мы снижаем барьер входа в космос каждый год.</p>
              </div>
              <div class="pillar__line"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- ══ 5. ДЛЯ КОГО МЫ РАБОТАЕМ ═════════════════ -->
      <section class="section s-audience reveal-section">
        <div class="s-audience__inner">
          <div class="s-audience__label reveal-item">// 005 — ДЛЯ КОГО МЫ РАБОТАЕМ</div>
          <h2 class="sec-title reveal-item">Каждый заслуживает<br/><em class="accent-pink">своего неба</em></h2>

          <div class="audience-grid">
            <div class="aud-card reveal-item">
              <div class="aud-card__glyph">◈</div>
              <h3>Искатели<br/>приключений</h3>
              <p>Для тех, кому тесно на Земле. Суборбитальные рейсы, невесомость и вид на планету с высоты 120 км.</p>
              <div class="aud-card__tags">
                <span>Физическая подготовка</span>
                <span>3 дня тренинга</span>
              </div>
            </div>

            <div class="aud-card aud-card--glow reveal-item">
              <div class="aud-card__glyph">◉</div>
              <h3>Учёные<br/>и исследователи</h3>
              <p>Лаборатории микрогравитации, уникальные данные и доступ к орбитальной станции для научных экспериментов.</p>
              <div class="aud-card__tags">
                <span>Гранты</span>
                <span>Партнёрство с ВУЗами</span>
              </div>
            </div>

            <div class="aud-card reveal-item">
              <div class="aud-card__glyph">◆</div>
              <h3>Корпоративные<br/>клиенты</h3>
              <p>Тимбилдинг на орбите, тестирование оборудования в условиях реального космоса и PR-рейсы для брендов.</p>
              <div class="aud-card__tags">
                <span>B2B программы</span>
                <span>Групповые рейсы</span>
              </div>
            </div>

            <div class="aud-card reveal-item">
              <div class="aud-card__glyph">◇</div>
              <h3>Будущие<br/>астронавты</h3>
              <p>Образовательная программа для студентов и молодых инженеров. Стипендии, стажировки и первый полёт в подарок.</p>
              <div class="aud-card__tags">
                <span>18–30 лет</span>
                <span>Гранты до 100%</span>
              </div>
            </div>
          </div>

          <div class="audience-cta reveal-item">
            <p>Не знаете, какая программа подходит вам?</p>
            <button class="btn-primary" data-navigate="service">Подобрать программу</button>
          </div>
        </div>
      </section>
    `;

    this._initStarfield();
    this._animateEntrance();
    this._initScrollReveal();
    this._unScroll = Layout.initScrollShadow();
  }

  /* ─────────────────────────────────────────────────────
     STARFIELD
  ───────────────────────────────────────────────────── */
  _initStarfield() {
    this.canvas = document.getElementById('starfield');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this._handleResize();
    window.addEventListener('resize', this._onResize);

    this.stars = Array.from({ length: 300 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.6 + 0.2,
      alpha: Math.random(),
      phase: Math.random() * Math.PI * 2,
      speed: 0.003 + Math.random() * 0.007,
      color: this._randomStarColor(),
    }));

    this._scheduleMeteor();
    this._drawLoop();
  }

  _randomStarColor() {
    return ['rgba(255,255,255,', 'rgba(0,255,255,', 'rgba(200,220,255,', 'rgba(255,200,200,'][Math.floor(Math.random() * 4)];
  }

  _handleResize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  _scheduleMeteor() {
    this._meteorTimer = setTimeout(() => {
      if (!this.canvas) return;
      this.meteors.push({
        x: Math.random() * this.canvas.width * 0.7,
        y: Math.random() * this.canvas.height * 0.3,
        vx: 6 + Math.random() * 6, vy: 3 + Math.random() * 4,
        len: 80 + Math.random() * 80, alpha: 1,
      });
      this._scheduleMeteor();
    }, 2500 + Math.random() * 5000);
  }

  _drawLoop() {
    const { ctx, canvas } = this;
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.stars.forEach(s => {
      s.phase += s.speed;
      const a = 0.35 + Math.sin(s.phase) * 0.65;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.color + Math.max(0, Math.min(1, a)) + ')';
      ctx.fill();
    });

    this.meteors = this.meteors.filter(m => m.alpha > 0.01);
    this.meteors.forEach(m => {
      const g = ctx.createLinearGradient(m.x, m.y, m.x - m.len, m.y - m.len * 0.5);
      g.addColorStop(0, `rgba(0,255,255,${m.alpha})`);
      g.addColorStop(1, 'rgba(0,255,255,0)');
      ctx.beginPath(); ctx.moveTo(m.x, m.y);
      ctx.lineTo(m.x - m.len, m.y - m.len * 0.5);
      ctx.strokeStyle = g; ctx.lineWidth = 1.5; ctx.stroke();
      m.x += m.vx; m.y += m.vy; m.alpha *= 0.96;
    });

    this.animFrame = requestAnimationFrame(() => this._drawLoop());
  }

  /* ─────────────────────────────────────────────────────
     HERO ENTRANCE
  ───────────────────────────────────────────────────── */
  _animateEntrance() {
    this.root.querySelectorAll('[data-anim]').forEach(el => {
      const delay = parseInt(el.dataset.anim) * 110;
      el.style.opacity = '0';
      el.style.transform = 'translateY(28px)';
      el.style.transition = 'opacity .75s cubic-bezier(.22,1,.36,1), transform .75s cubic-bezier(.22,1,.36,1)';
      setTimeout(() => { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; }, 300 + delay);
    });
  }

  /* ─────────────────────────────────────────────────────
     SCROLL REVEAL  (IntersectionObserver)
  ───────────────────────────────────────────────────── */
  _initScrollReveal() {
    // Sections fade-in
    const sectionObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('revealed');
          sectionObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });

    this.root.querySelectorAll('.reveal-section').forEach(el => sectionObs.observe(el));
    this._observers.push(sectionObs);

    // Individual items stagger
    const itemObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('revealed');
          itemObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    this.root.querySelectorAll('.reveal-item').forEach((el, i) => {
      el.style.transitionDelay = (i % 5) * 80 + 'ms';
      itemObs.observe(el);
    });
    this._observers.push(itemObs);
  }

  /* ─────────────────────────────────────────────────────
     DESTROY
  ───────────────────────────────────────────────────── */
  destroy() {
    cancelAnimationFrame(this.animFrame);
    clearTimeout(this._meteorTimer);
    window.removeEventListener('resize', this._onResize);
    this._observers.forEach(o => o.disconnect());
    if (this._unScroll) this._unScroll();
    this.canvas = null;
    this.ctx = null;
  }
}

App.register('index', IndexPage);