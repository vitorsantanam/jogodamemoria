/* ==========================================
   JOGO DA MEMÓRIA – LÓGICA
   6 pares, embaralhamento, timer, single-player
   ========================================== */

// ===== ESTADO =====
const state = {
  cards: [],          // array embaralhado de {id, pairId, image, label}
  flipped: [],        // índices abertos no momento (máx 2)
  matched: 0,         // pares encontrados
  totalPairs: 0,
  locked: false,      // bloqueia cliques durante animação
  timeLeft: CONFIG.tempoPartida,
  timerInterval: null,
  gameStarted: false,
  autoTimeout: null,
  lastInteraction: Date.now(),
};

// ===== DOM =====
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const DOM = {
  board: $('#board'),
  timerText: $('#timerText'),
  timerProgress: $('#timerProgress'),
  overlayStart: $('#overlayStart'),
  overlayWin: $('#overlayWin'),
  overlayTimeout: $('#overlayTimeout'),
  confetti: $('#confetti'),
  particles: $('#particles'),
  bannerImage: $('#bannerImage'),
  footerLogo: $('#footerLogo'),
  startTitle: $('#startTitle'),
  startMsg: $('#startMsg'),
  startImg: $('#startImg'),
  winTitle: $('#winTitle'),
  winMsg: $('#winMessage') || $('#winMsg'),
  winImg: $('#winImg'),
  timeoutTitle: $('#timeoutTitle'),
  timeoutMsg: $('#timeoutMsg'),
  timeoutImg: $('#timeoutImg'),
};

// ===== INIT =====
function init() {
  applyConfig();
  createParticles();
  setupIdle();
  if (CONFIG.mostrarTelaInicial) {
    show(DOM.overlayStart);
  } else {
    startGame();
  }
}

// ===== APLICAR CONFIGURAÇÃO =====
function applyConfig() {
  const t = CONFIG.textos;
  if (DOM.startTitle) DOM.startTitle.textContent = t.inicioTitulo;
  if (DOM.startMsg) DOM.startMsg.textContent = t.inicioMsg;
  if (DOM.winTitle) DOM.winTitle.textContent = t.vitoriaTitulo;
  const winMsgEl = $('#winMsg');
  if (winMsgEl) winMsgEl.innerHTML = t.vitoriaMsg.replace(/\n/g, '<br>');
  if (DOM.timeoutTitle) DOM.timeoutTitle.textContent = t.tempoTitulo;
  if (DOM.timeoutMsg) DOM.timeoutMsg.innerHTML = t.tempoMsg.replace(/\n/g, '<br>');

  const img = CONFIG.imagens;
  if (img.banner && DOM.bannerImage) DOM.bannerImage.src = img.banner;
  if (img.logo && DOM.footerLogo) DOM.footerLogo.src = img.logo;
  if (img.vitoria && DOM.winImg) DOM.winImg.src = img.vitoria;
  if (img.tempoEsgotado && DOM.timeoutImg) DOM.timeoutImg.src = img.tempoEsgotado;
  if (img.inicio && DOM.startImg) DOM.startImg.src = img.inicio;

  DOM.timerText.textContent = CONFIG.tempoPartida;
}

// ===== CONSTRUIR CARTAS =====
function buildCards() {
  const pairs = CONFIG.cartas;
  state.totalPairs = pairs.length;
  const deck = [];

  pairs.forEach((p, i) => {
    const label = i + 1;            // numeração 1, 2, 3...
    // Duas cartas por par
    deck.push({ id: i * 2,     pairId: i, image: p.imagem, label });
    deck.push({ id: i * 2 + 1, pairId: i, image: p.imagem, label });
  });

  // Embaralhar (Fisher-Yates)
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  state.cards = deck;
}

// ===== RENDERIZAR TABULEIRO =====
function renderBoard() {
  DOM.board.innerHTML = '';

  state.cards.forEach((card, idx) => {
    const el = document.createElement('div');
    el.className = 'card';
    el.dataset.index = idx;

    el.innerHTML = `
      <div class="card-inner">
        <div class="card-face card-back">
          <span class="card-back-label">${card.label}</span>
        </div>
        <div class="card-face card-front">
          <img src="${card.image}" alt="Carta ${card.label}"
               onerror="this.onerror=null;this.outerHTML='<span style=font-size:clamp(2rem,6vw,4rem)>🌸</span>'">
        </div>
      </div>
    `;

    el.addEventListener('click', () => handleFlip(idx));
    el.addEventListener('touchstart', (e) => { e.preventDefault(); handleFlip(idx); }, { passive: false });
    DOM.board.appendChild(el);
  });
}

// ===== INICIAR JOGO =====
function startGame() {
  hideAll();
  clearAuto();
  buildCards();
  renderBoard();
  state.matched = 0;
  state.flipped = [];
  state.locked = false;
  state.gameStarted = true;
  state.timeLeft = CONFIG.tempoPartida;
  startTimer();
  interact();
}

// ===== RECOMEÇAR =====
function restartGame() {
  stopTimer();
  hideAll();
  clearAuto();
  startGame();
}

// ===== FLIP =====
function handleFlip(idx) {
  interact();
  if (state.locked || !state.gameStarted) return;

  const cardEl = DOM.board.children[idx];
  if (!cardEl || cardEl.classList.contains('flipped') || cardEl.classList.contains('matched')) return;
  if (state.flipped.length >= 2) return;

  // Abrir carta
  cardEl.classList.add('flipped');
  state.flipped.push(idx);
  playSound('flip');

  if (state.flipped.length === 2) {
    state.locked = true;
    checkMatch();
  }
}

// ===== CHECAR PAR =====
function checkMatch() {
  const [a, b] = state.flipped;
  const cardA = state.cards[a];
  const cardB = state.cards[b];
  const elA = DOM.board.children[a];
  const elB = DOM.board.children[b];

  if (cardA.pairId === cardB.pairId) {
    // Match!
    setTimeout(() => {
      elA.classList.add('matched');
      elB.classList.add('matched');
      state.matched++;
      state.flipped = [];
      state.locked = false;
      playSound('match');

      if (state.matched === state.totalPairs) {
        handleWin();
      }
    }, 400);
  } else {
    // Não é par — fechar após delay
    setTimeout(() => {
      elA.classList.remove('flipped');
      elB.classList.remove('flipped');
      state.flipped = [];
      state.locked = false;
      playSound('noMatch');
    }, 800);
  }
}

// ===== VITÓRIA =====
function handleWin() {
  state.gameStarted = false;
  stopTimer();
  setTimeout(() => {
    show(DOM.overlayWin);
    createConfetti();
    playSound('vitoria');
    autoRestart();
  }, 500);
}

// ===== TEMPO ESGOTADO =====
function handleTimeout() {
  state.gameStarted = false;
  state.locked = true;
  stopTimer();

  DOM.board.classList.add('shake');
  setTimeout(() => DOM.board.classList.remove('shake'), 500);

  setTimeout(() => {
    show(DOM.overlayTimeout);
    playSound('tempoAcabou');
    autoRestart();
  }, 600);
}

// ===== TIMER =====
function startTimer() {
  updateTimerDisplay();
  state.timerInterval = setInterval(() => {
    state.timeLeft--;
    updateTimerDisplay();
    if (state.timeLeft <= CONFIG.tempoCritico) playSound('tick');
    if (state.timeLeft <= 0) handleTimeout();
  }, 1000);
}

function stopTimer() {
  clearInterval(state.timerInterval);
  state.timerInterval = null;
}

function updateTimerDisplay() {
  const t = Math.max(0, state.timeLeft);
  DOM.timerText.textContent = t;

  const circ = 2 * Math.PI * 54;
  DOM.timerProgress.style.strokeDashoffset = circ * (1 - t / CONFIG.tempoPartida);

  DOM.timerProgress.classList.remove('warn', 'danger');
  if (t <= CONFIG.tempoCritico) DOM.timerProgress.classList.add('danger');
  else if (t <= CONFIG.tempoAlerta) DOM.timerProgress.classList.add('warn');
}

// ===== OVERLAYS =====
function show(el) { if (el) el.classList.add('visible'); }
function hide(el) { if (el) el.classList.remove('visible'); }
function hideAll() {
  [DOM.overlayStart, DOM.overlayWin, DOM.overlayTimeout].forEach(hide);
}

// ===== AUTO RESTART =====
function autoRestart() {
  if (CONFIG.autoRestartSegundos <= 0) return;
  const secs = CONFIG.autoRestartSegundos;
  const box = document.querySelector('.overlay.visible .overlay-box');
  if (!box) return;

  // Remove anterior
  box.querySelectorAll('.auto-bar,.auto-text').forEach(e => e.remove());

  const bar = document.createElement('div');
  bar.className = 'auto-bar';
  const prog = document.createElement('div');
  prog.className = 'auto-progress';
  prog.style.width = '100%';
  bar.appendChild(prog);
  box.appendChild(bar);

  const txt = document.createElement('p');
  txt.className = 'auto-text';
  txt.textContent = `Reiniciando em ${secs}s...`;
  box.appendChild(txt);

  let rem = secs;
  const iv = setInterval(() => {
    rem--;
    if (rem <= 0) { clearInterval(iv); return; }
    prog.style.width = ((rem / secs) * 100) + '%';
    txt.textContent = `Reiniciando em ${rem}s...`;
  }, 1000);

  state.autoTimeout = setTimeout(() => { clearInterval(iv); restartGame(); }, secs * 1000);
}

function clearAuto() {
  if (state.autoTimeout) { clearTimeout(state.autoTimeout); state.autoTimeout = null; }
}

// ===== IDLE =====
function setupIdle() {
  if (CONFIG.idleTimeoutSegundos <= 0) return;
  setInterval(() => {
    if ((Date.now() - state.lastInteraction) / 1000 >= CONFIG.idleTimeoutSegundos && state.gameStarted) {
      state.gameStarted = false;
      stopTimer(); hideAll(); clearAuto();
      if (CONFIG.mostrarTelaInicial) show(DOM.overlayStart);
    }
  }, 5000);
}

function interact() { state.lastInteraction = Date.now(); }
document.addEventListener('touchstart', interact, { passive: true });
document.addEventListener('click', interact);

// ===== CONFETTI =====
function createConfetti() {
  const colors = ['#e91e63','#f06292','#ce93d8','#ff80ab','#f48fb1','#ffb74d','#fff176','#81c784'];
  const c = DOM.confetti; if (!c) return;
  c.innerHTML = '';
  for (let i = 0; i < 70; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-piece';
    p.style.left = Math.random()*100+'%';
    p.style.backgroundColor = colors[Math.floor(Math.random()*colors.length)];
    p.style.animationDuration = (Math.random()*2+1.5)+'s';
    p.style.animationDelay = Math.random()*1+'s';
    c.appendChild(p);
  }
}

// ===== PARTÍCULAS =====
function createParticles() {
  if (!CONFIG.particulas.ativas) return;
  const c = DOM.particles; if (!c) return;
  c.innerHTML = '';
  const em = CONFIG.particulas.emojis;
  for (let i = 0; i < CONFIG.particulas.quantidade; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.textContent = em[Math.floor(Math.random()*em.length)];
    p.style.left = Math.random()*100+'%';
    p.style.fontSize = (Math.random()*14+14)+'px';
    p.style.animationDuration = (Math.random()*15+10)+'s';
    p.style.animationDelay = (Math.random()*20)+'s';
    c.appendChild(p);
  }
}

// ===== SONS =====
function playSound(key) {
  const src = CONFIG.sons[key];
  if (!src) return;
  try { const a = new Audio(src); a.volume = .5; a.play().catch(()=>{}); } catch(_){}
}

// ===== PREVENIR SCROLL / ZOOM =====
document.addEventListener('touchmove', e => e.preventDefault(), { passive: false });
document.addEventListener('gesturestart', e => e.preventDefault());
document.addEventListener('gesturechange', e => e.preventDefault());

// ===== START =====
document.addEventListener('DOMContentLoaded', init);
