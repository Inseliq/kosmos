/**
 * game.class.js — Space Z Arcade: уклоняйся от астероидов
 * Управление: стрелки ← → ↑ ↓
 */
class GamePage {
  constructor(root, app) {
    this.root = root;
    this.app = app;
    this._canvas = null;
    this._ctx = null;
    this._raf = null;
    this._state = 'idle'; // idle | playing | dead

    // Rocket
    this._r = null;

    // Game objects
    this._stars = [];
    this._obstacles = [];
    this._particles = [];
    this._exhaust = [];

    // Input
    this._keys = { up: false, down: false, left: false, right: false };

    // Score
    this._score = 0;
    this._distance = 0; // пройдено «вверх»
    this._speed = 2; // начальная скорость прокрутки
    this._spawnTimer = 0;

    this._onKey = this._onKeyDown.bind(this);
    this._onKeyUp = this._onKeyUpFn.bind(this);
    this._onResize = this._handleResize.bind(this);
    this._unScroll = null;
  }

  /* ═══════════════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════════════ */
  render() {
    Layout.mount(this.root, { active: 'game' });
    const slot = Layout.slot();
    slot.innerHTML = `
      <div class="gm-wrap" id="gm-wrap">

        <!-- SIDE PANEL -->
        <aside class="gm-panel">
          <div class="gm-panel__label">// Space Z Arcade</div>
          <h1 class="gm-panel__title">Сквозь<br/><em class="gm-cyan">астероиды</em></h1>
          <p class="gm-panel__desc">
            Управляй ракетой стрелками и уклоняйся от астероидов.
            Чем дольше летишь — тем быстрее они летят.
          </p>

          <div class="gm-hud">
            <div class="gm-hud__row">
              <span class="gm-hud__label">Расстояние</span>
              <span class="gm-hud__val gm-cyan" id="gm-dist">0 км</span>
            </div>
            <div class="gm-hud__row">
              <span class="gm-hud__label">Скорость</span>
              <span class="gm-hud__val" id="gm-spd">x1.0</span>
            </div>
            <div class="gm-hud__row">
              <span class="gm-hud__label">Рекорд</span>
              <span class="gm-hud__val gm-pink" id="gm-best">0 км</span>
            </div>
          </div>

          <div class="gm-controls">
            <div class="gm-ctrl-item"><kbd>↑</kbd><kbd>↓</kbd><kbd>←</kbd><kbd>→</kbd>
              <span>Движение</span>
            </div>
            <div class="gm-ctrl-item"><kbd>R</kbd><span>Перезапуск</span></div>
          </div>

          <button class="gm-btn-start" id="gm-start">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M5 3l10 6-10 6V3Z" fill="currentColor"/>
            </svg>
            Начать полёт
          </button>

          <div class="gm-leaderboard">
            <div class="gm-lb__title">Лучшие результаты</div>
            <div id="gm-lb">${this._renderLB()}</div>
          </div>
        </aside>

        <!-- CANVAS AREA -->
        <div class="gm-arena" id="gm-arena">
          <canvas id="gm-canvas"></canvas>

          <!-- Overlay (idle / dead) -->
          <div class="gm-overlay" id="gm-overlay">
            <p class="gm-ov-sub" id="gm-ov-sub">Нажми, чтобы начать</p>
            <h2 class="gm-ov-title" id="gm-ov-title">SPACE Z<br/>ARCADE</h2>
            <button class="gm-ov-btn" id="gm-ov-btn">▶ Старт</button>
          </div>

          <!-- Countdown -->
          <div class="gm-cd" id="gm-cd" style="display:none">
            <span id="gm-cd-n">3</span>
          </div>
        </div>

      </div>
    `;

    this._initCanvas();
    this._initEvents();
    this._updateLB();
    this._unScroll = Layout.initScrollShadow();
  }

  /* ═══════════════════════════════════════════════════
     CANVAS
  ═══════════════════════════════════════════════════ */
  _initCanvas() {
    this._canvas = document.getElementById('gm-canvas');
    this._ctx = this._canvas.getContext('2d');
    this._handleResize();
    window.addEventListener('resize', this._onResize);
    this._buildStars();
    this._drawIdle();
  }

  _handleResize() {
    if (!this._canvas) return;
    const arena = document.getElementById('gm-arena');
    if (!arena) return;
    this._canvas.width = arena.clientWidth;
    this._canvas.height = arena.clientHeight;
    this._buildStars();
  }

  _buildStars() {
    if (!this._canvas) return;
    this._stars = Array.from({ length: 260 }, () => ({
      x: Math.random() * this._canvas.width,
      y: Math.random() * this._canvas.height,
      r: Math.random() * 1.5 + 0.2,
      phase: Math.random() * Math.PI * 2,
      spd: 0.003 + Math.random() * 0.008,
      drift: 0.1 + Math.random() * 0.4, // скорость «параллакса» вниз
    }));
  }

  /* ═══════════════════════════════════════════════════
     EVENTS
  ═══════════════════════════════════════════════════ */
  _initEvents() {
    window.addEventListener('keydown', this._onKey);
    window.addEventListener('keyup', this._onKeyUp);

    const startBtn = document.getElementById('gm-start');
    const ovBtn = document.getElementById('gm-ov-btn');
    [startBtn, ovBtn].forEach(b => b && b.addEventListener('click', () => this._startCountdown()));
  }

  _onKeyDown(e) {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) e.preventDefault();
    if (e.code === 'KeyR') { this._restart(); return; }
    if (e.code === 'ArrowUp') this._keys.up = true;
    if (e.code === 'ArrowDown') this._keys.down = true;
    if (e.code === 'ArrowLeft') this._keys.left = true;
    if (e.code === 'ArrowRight') this._keys.right = true;

    // Start on any arrow if idle
    if (this._state === 'idle' && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
      this._startCountdown();
    }
  }

  _onKeyUpFn(e) {
    if (e.code === 'ArrowUp') this._keys.up = false;
    if (e.code === 'ArrowDown') this._keys.down = false;
    if (e.code === 'ArrowLeft') this._keys.left = false;
    if (e.code === 'ArrowRight') this._keys.right = false;
  }

  /* ═══════════════════════════════════════════════════
     ROCKET INIT
  ═══════════════════════════════════════════════════ */
  _initRocket() {
    const { width, height } = this._canvas;
    this._r = {
      x: width / 2,
      y: height * 0.7,
      vx: 0, vy: 0,
      w: 14, h: 28,   // hitbox
    };
  }

  /* ═══════════════════════════════════════════════════
     COUNTDOWN
  ═══════════════════════════════════════════════════ */
  _startCountdown() {
    if (this._state !== 'idle') return;
    this._state = 'countdown';

    // Скрыть скролл страницы на время игры
    document.body.style.overflow = 'hidden';

    // Сфокусировать игру по центру экрана
    const wrap = document.getElementById('gm-wrap');
    if (wrap) {
      wrap.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Сброс
    this._score = 0;
    this._distance = 0;
    this._speed = 2;
    this._spawnTimer = 0;
    this._obstacles = [];
    this._particles = [];
    this._exhaust = [];
    this._keys = { up: false, down: false, left: false, right: false };
    this._initRocket();

    document.getElementById('gm-overlay').style.display = 'none';

    const cdEl = document.getElementById('gm-cd');
    const cdNum = document.getElementById('gm-cd-n');
    cdEl.style.display = 'flex';

    let n = 3;
    const tick = () => {
      cdNum.textContent = n > 0 ? n : 'GO!';
      cdNum.style.animation = 'none';
      void cdNum.offsetWidth;
      cdNum.style.animation = 'cdPop .7s ease-out';
      if (n < 0) {
        cdEl.style.display = 'none';
        this._state = 'playing';
        this._loop();
      } else {
        n--;
        setTimeout(tick, 800);
      }
    };
    tick();
  }

  /* ═══════════════════════════════════════════════════
     MAIN LOOP
  ═══════════════════════════════════════════════════ */
  _loop() {
    cancelAnimationFrame(this._raf);
    if (!this._canvas || !this._ctx || this._state !== 'playing') return;

    const dt = 1; // нормализованный dt для простоты
    const { width, height } = this._canvas;
    const ROCKET_SPEED = 3.5;

    /* ── Rocket movement ── */
    const r = this._r;
    if (this._keys.up) r.vy -= 0.5;
    if (this._keys.down) r.vy += 0.5;
    if (this._keys.left) r.vx -= 0.5;
    if (this._keys.right) r.vx += 0.5;

    // Friction
    r.vx *= 0.88;
    r.vy *= 0.88;

    // Clamp speed
    const maxV = ROCKET_SPEED;
    const spd = Math.sqrt(r.vx ** 2 + r.vy ** 2);
    if (spd > maxV) { r.vx = r.vx / spd * maxV; r.vy = r.vy / spd * maxV; }

    r.x += r.vx;
    r.y += r.vy;

    // Bounce off walls
    const pad = 10;
    if (r.x < pad) { r.x = pad; r.vx = Math.abs(r.vx) * 0.5; }
    if (r.x > width - pad) { r.x = width - pad; r.vx = -Math.abs(r.vx) * 0.5; }
    if (r.y < pad) { r.y = pad; r.vy = Math.abs(r.vy) * 0.5; }
    if (r.y > height - pad) { r.y = height - pad; r.vy = -Math.abs(r.vy) * 0.5; }

    /* ── Score / speed ── */
    this._distance += this._speed * 0.04;
    this._speed = 2 + this._distance * 0.018;
    if (this._speed > 12) this._speed = 12;

    /* ── Spawn obstacles ── */
    this._spawnTimer++;
    const spawnInterval = Math.max(28, 70 - this._distance * 0.5);
    if (this._spawnTimer >= spawnInterval) {
      this._spawnTimer = 0;
      this._spawnObstacle();
    }

    /* ── Move obstacles ── */
    this._obstacles.forEach(o => {
      o.y += this._speed + o.extraSpd;
      o.rot += o.rotSpd;
    });
    this._obstacles = this._obstacles.filter(o => o.y < height + 80);

    /* ── Stars parallax ── */
    this._stars.forEach(s => {
      s.phase += s.spd;
      s.y += s.drift * (this._speed * 0.3);
      if (s.y > height) { s.y = -2; s.x = Math.random() * width; }
    });

    /* ── Exhaust ── */
    this._spawnExhaust();
    this._exhaust.forEach(p => { p.y += p.vy; p.x += p.vx; p.life -= p.decay; });
    this._exhaust = this._exhaust.filter(p => p.life > 0);

    /* ── Particles ── */
    this._particles.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += 0.08; p.life -= p.decay; });
    this._particles = this._particles.filter(p => p.life > 0);

    /* ── Collision ── */
    if (this._checkCollision()) {
      this._explode();
      this._endGame();
      return;
    }

    /* ── HUD ── */
    this._updateHUD();

    /* ── Draw ── */
    this._draw();

    this._raf = requestAnimationFrame(() => this._loop());
  }

  /* ═══════════════════════════════════════════════════
     OBSTACLES
  ═══════════════════════════════════════════════════ */
  _spawnObstacle() {
    const { width } = this._canvas;
    const type = Math.random() < 0.6 ? 'asteroid' : 'debris';
    const size = type === 'asteroid'
      ? 18 + Math.random() * 28
      : 10 + Math.random() * 16;

    const cols = 3;
    const lane = Math.floor(Math.random() * cols);
    const x = (lane + 0.5) * (width / cols) + (Math.random() - 0.5) * (width / cols * 0.6);

    this._obstacles.push({
      x, y: -size - 10,
      size, type,
      extraSpd: Math.random() * 1.5,
      rot: Math.random() * Math.PI * 2,
      rotSpd: (Math.random() - 0.5) * 0.06,
      color: type === 'asteroid'
        ? ['#8b6f47', '#a07850', '#6b5234'][Math.floor(Math.random() * 3)]
        : '#ff4173',
    });
  }

  /* ═══════════════════════════════════════════════════
     COLLISION
  ═══════════════════════════════════════════════════ */
  _checkCollision() {
    const r = this._r;
    return this._obstacles.some(o => {
      const dx = r.x - o.x;
      const dy = r.y - o.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      return dist < o.size * 0.7 + Math.max(r.w, r.h) * 0.5;
    });
  }

  /* ═══════════════════════════════════════════════════
     EXHAUST PARTICLES
  ═══════════════════════════════════════════════════ */
  _spawnExhaust() {
    if (!this._r) return;
    const { x, y } = this._r;
    for (let i = 0; i < 2; i++) {
      this._exhaust.push({
        x: x + (Math.random() - 0.5) * 6,
        y: y + 18,
        vx: (Math.random() - 0.5) * 0.8,
        vy: 1.5 + Math.random() * 1.5,
        life: 1,
        decay: 0.06 + Math.random() * 0.04,
        r: 2 + Math.random() * 3,
        cyan: Math.random() > 0.4,
      });
    }
  }

  /* ═══════════════════════════════════════════════════
     EXPLOSION
  ═══════════════════════════════════════════════════ */
  _explode() {
    const { x, y } = this._r;
    for (let i = 0; i < 60; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd = 1 + Math.random() * 6;
      this._particles.push({
        x, y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        life: 1,
        decay: 0.025 + Math.random() * 0.025,
        r: 2 + Math.random() * 6,
        color: ['#ff4173', '#00ffff', '#ff8c00', '#ffffff'][Math.floor(Math.random() * 4)],
      });
    }
  }

  /* ═══════════════════════════════════════════════════
     END GAME
  ═══════════════════════════════════════════════════ */
  _endGame() {
    this._state = 'dead';
    cancelAnimationFrame(this._raf);
    this._keys = { up: false, down: false, left: false, right: false };
    this._r = null;

    const score = Math.round(this._distance);
    this._saveScore(score);

    // Дорисовать взрыв и показать overlay через паузу
    this._drawExplosionFrame();
    this._updateLB();

    // Вернуть скролл
    document.body.style.overflow = '';

    setTimeout(() => {
      const overlay = document.getElementById('gm-overlay');
      const sub = document.getElementById('gm-ov-sub');
      const title = document.getElementById('gm-ov-title');
      const btn = document.getElementById('gm-ov-btn');
      if (!overlay) return;

      sub.textContent = `💥 Пройдено ${score} км`;
      title.innerHTML = 'АВАРИЯ!';
      btn.textContent = '↺ Снова';
      overlay.className = 'gm-overlay gm-overlay--crash';
      overlay.style.display = 'flex';
    }, 900);
  }

  _drawExplosionFrame() {
    // Анимируем взрыв несколько кадров без обновления ракеты
    let frames = 0;
    const ctx = this._ctx;
    const drawFrame = () => {
      if (!ctx || frames++ > 50) { this._state = 'idle'; return; }
      this._drawBg();
      this._drawObstacles();
      this._particles.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += 0.08; p.life -= p.decay; });
      this._particles = this._particles.filter(p => p.life > 0);
      this._drawParticles();
      this._raf = requestAnimationFrame(drawFrame);
    };
    drawFrame();
  }

  _restart() {
    cancelAnimationFrame(this._raf);
    document.body.style.overflow = '';
    this._state = 'idle';
    this._obstacles = [];
    this._particles = [];
    this._exhaust = [];
    this._keys = { up: false, down: false, left: false, right: false };

    const overlay = document.getElementById('gm-overlay');
    if (overlay) {
      overlay.className = 'gm-overlay';
      overlay.style.display = 'flex';
    }
    const sub = document.getElementById('gm-ov-sub');
    const title = document.getElementById('gm-ov-title');
    const btn = document.getElementById('gm-ov-btn');
    if (sub) sub.textContent = 'Нажми, чтобы начать';
    if (title) title.innerHTML = 'SPACE Z<br/>ARCADE';
    if (btn) btn.textContent = '▶ Старт';

    this._drawIdle();
  }

  /* ═══════════════════════════════════════════════════
     DRAW
  ═══════════════════════════════════════════════════ */
  _draw() {
    const ctx = this._ctx, c = this._canvas;
    if (!ctx || !c) return;
    this._drawBg();
    this._drawObstacles();
    this._drawExhaust();
    this._drawParticles();
    if (this._r) this._drawRocket();
    this._drawBorders();
  }

  _drawIdle() {
    const ctx = this._ctx, c = this._canvas;
    if (!ctx || !c) return;
    this._drawBg();
    // Нарисуем ракету в центре для idle
    if (!this._r) this._initRocket();
    this._drawRocket();
  }

  _drawBg() {
    const ctx = this._ctx, c = this._canvas;
    if (!ctx || !c) return;

    // Фон
    const g = ctx.createLinearGradient(0, 0, 0, c.height);
    g.addColorStop(0, '#010108');
    g.addColorStop(0.6, '#060614');
    g.addColorStop(1, '#0b0b20');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, c.width, c.height);

    // Звёзды
    this._stars.forEach(s => {
      s.phase += s.spd;
      const a = 0.2 + Math.abs(Math.sin(s.phase)) * 0.8;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${a.toFixed(2)})`;
      ctx.fill();
    });

    // Горизонтальные «полосы скорости» при высокой скорости
    if (this._speed > 5) {
      const opacity = Math.min((this._speed - 5) / 7 * 0.15, 0.15);
      this._stars.filter((_, i) => i % 5 === 0).forEach(s => {
        const len = this._speed * 4;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x, s.y + len);
        ctx.strokeStyle = `rgba(0,255,255,${opacity})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      });
    }
  }

  _drawObstacles() {
    const ctx = this._ctx;
    if (!ctx) return;
    this._obstacles.forEach(o => {
      ctx.save();
      ctx.translate(o.x, o.y);
      ctx.rotate(o.rot);

      if (o.type === 'asteroid') {
        // Нерегулярная форма астероида
        ctx.beginPath();
        const pts = 8;
        for (let i = 0; i < pts; i++) {
          const angle = (i / pts) * Math.PI * 2;
          const jitter = 0.7 + Math.sin(i * 3.7 + o.rot * 2) * 0.3;
          const r = o.size * jitter;
          i === 0 ? ctx.moveTo(Math.cos(angle) * r, Math.sin(angle) * r)
            : ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
        }
        ctx.closePath();
        ctx.fillStyle = o.color;
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.15)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Кратер
        ctx.beginPath();
        ctx.arc(o.size * 0.2, -o.size * 0.2, o.size * 0.22, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fill();
      } else {
        // Обломок — острый ромб
        ctx.beginPath();
        ctx.moveTo(0, -o.size);
        ctx.lineTo(o.size * 0.5, 0);
        ctx.lineTo(0, o.size);
        ctx.lineTo(-o.size * 0.5, 0);
        ctx.closePath();
        ctx.fillStyle = 'rgba(255,65,115,0.25)';
        ctx.fill();
        ctx.strokeStyle = '#ff4173';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Warning glow
        const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, o.size * 1.4);
        glow.addColorStop(0, 'rgba(255,65,115,0.18)');
        glow.addColorStop(1, 'rgba(255,65,115,0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(0, 0, o.size * 1.4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });
  }

  _drawExhaust() {
    const ctx = this._ctx;
    if (!ctx) return;
    this._exhaust.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(0.1, p.r * p.life), 0, Math.PI * 2);
      ctx.fillStyle = p.cyan
        ? `rgba(0,255,255,${(p.life * 0.7).toFixed(2)})`
        : `rgba(255,200,0,${(p.life * 0.5).toFixed(2)})`;
      ctx.fill();
    });
  }

  _drawParticles() {
    const ctx = this._ctx;
    if (!ctx) return;
    this._particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(0.1, p.r * p.life), 0, Math.PI * 2);
      // Парсим hex в rgba
      const hex = p.color.replace('#', '');
      const rv = parseInt(hex.slice(0, 2), 16);
      const gv = parseInt(hex.slice(2, 4), 16);
      const bv = parseInt(hex.slice(4, 6), 16);
      ctx.fillStyle = `rgba(${rv},${gv},${bv},${p.life.toFixed(2)})`;
      ctx.fill();
    });
  }

  _drawRocket() {
    const ctx = this._ctx;
    if (!ctx || !this._r) return;
    const { x, y } = this._r;
    const moving = this._keys.left || this._keys.right || this._keys.up || this._keys.down;

    // Наклон в сторону движения
    const tilt = this._r.vx * 0.12;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(tilt);

    // Glow
    const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, 30);
    glow.addColorStop(0, 'rgba(0,255,255,0.15)');
    glow.addColorStop(1, 'rgba(0,255,255,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0, 0, 30, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.beginPath();
    ctx.moveTo(0, -26);
    ctx.lineTo(9, 12);
    ctx.lineTo(-9, 12);
    ctx.closePath();
    ctx.fillStyle = '#ddeeff';
    ctx.fill();

    // Fins L
    ctx.beginPath();
    ctx.moveTo(-9, 4);
    ctx.lineTo(-20, 18);
    ctx.lineTo(-9, 12);
    ctx.closePath();
    ctx.fillStyle = 'rgba(0,255,255,0.8)';
    ctx.fill();

    // Fins R
    ctx.beginPath();
    ctx.moveTo(9, 4);
    ctx.lineTo(20, 18);
    ctx.lineTo(9, 12);
    ctx.closePath();
    ctx.fillStyle = 'rgba(0,255,255,0.8)';
    ctx.fill();

    // Stripe
    ctx.beginPath();
    ctx.moveTo(-8, 1); ctx.lineTo(8, 1);
    ctx.strokeStyle = '#ff4173';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Window
    ctx.beginPath();
    ctx.arc(0, -9, 5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,255,255,0.5)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,255,255,1)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.restore();
  }

  _drawBorders() {
    const ctx = this._ctx, c = this._canvas;
    if (!ctx || !c) return;
    // Тонкая рамка — визуальные границы поля
    ctx.strokeStyle = 'rgba(0,255,255,0.07)';
    ctx.lineWidth = 1;
    ctx.strokeRect(1, 1, c.width - 2, c.height - 2);
  }

  /* ═══════════════════════════════════════════════════
     HUD
  ═══════════════════════════════════════════════════ */
  _updateHUD() {
    const dist = document.getElementById('gm-dist');
    const spdEl = document.getElementById('gm-spd');
    const best = document.getElementById('gm-best');
    const scores = this._getTopScores();

    if (dist) dist.textContent = Math.round(this._distance) + ' км';
    if (spdEl) spdEl.textContent = 'x' + (this._speed / 2).toFixed(1);
    if (best) best.textContent = (scores[0] || 0) + ' км';
  }

  /* ═══════════════════════════════════════════════════
     LEADERBOARD
  ═══════════════════════════════════════════════════ */
  _renderLB() {
    const s = this._getTopScores();
    return s.length
      ? s.map((v, i) => `<div class="gm-lb__row"><span class="gm-lb__rank">#${i + 1}</span><span class="gm-lb__val">${v} км</span></div>`).join('')
      : '<div class="gm-lb__empty">Нет рекордов</div>';
  }

  _updateLB() {
    const el = document.getElementById('gm-lb');
    if (el) el.innerHTML = this._renderLB();
  }

  _getTopScores() {
    try { return JSON.parse(localStorage.getItem('sz_arc_scores') || '[]').slice(0, 5); }
    catch { return []; }
  }

  _saveScore(s) {
    if (s < 1) return;
    try {
      const arr = JSON.parse(localStorage.getItem('sz_arc_scores') || '[]');
      arr.push(s); arr.sort((a, b) => b - a);
      localStorage.setItem('sz_arc_scores', JSON.stringify(arr.slice(0, 5)));
    } catch { }
  }

  /* ═══════════════════════════════════════════════════
     DESTROY
  ═══════════════════════════════════════════════════ */
  destroy() {
    cancelAnimationFrame(this._raf);
    document.body.style.overflow = '';
    window.removeEventListener('keydown', this._onKey);
    window.removeEventListener('keyup', this._onKeyUp);
    window.removeEventListener('resize', this._onResize);
    if (this._unScroll) this._unScroll();
    this._canvas = null;
    this._ctx = null;
  }
}

App.register('game', GamePage);