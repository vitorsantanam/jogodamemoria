/* ==========================================
   SCRIPT – JOGO DO INTRUSO
   ========================================== */

// Carrega fases do arquivo externo
// (deve ser incluído antes deste script)

let fases = window.fasesIntruso || [];

const stateIntruso = {
  faseAtual: 0,
  ordemFases: [],
  tempoRestante: CONFIG_INTRUSO.tempoPartida,
  timerInterval: null,
  gameStarted: false,
  acertou: false,
};

const DOM_INTRUSO = {
  board: document.getElementById('board'),
  timerText: document.getElementById('timerText'),
  timerProgress: document.getElementById('timerProgress'),
  overlayStart: document.getElementById('overlayStart'),
  overlayWin: document.getElementById('overlayWin'),
  overlayTimeout: document.getElementById('overlayTimeout'),
  bannerImage: document.getElementById('bannerImage'),
  footerLogo: document.getElementById('footerLogo'),
  startTitle: document.getElementById('startTitle'),
  startMsg: document.getElementById('startMsg'),
  startImg: document.getElementById('startImg'),
  winTitle: document.getElementById('winTitle'),
  winMsg: document.getElementById('winMsg'),
  winImg: document.getElementById('winImg'),
  timeoutTitle: document.getElementById('timeoutTitle'),
  timeoutMsg: document.getElementById('timeoutMsg'),
  timeoutImg: document.getElementById('timeoutImg'),
};

function initIntruso() {
  applyConfigIntruso();
  embaralharFases();
  if (CONFIG_INTRUSO.mostrarTelaInicial) {
    show(DOM_INTRUSO.overlayStart);
  } else {
    startGameIntruso();
  }
}

function applyConfigIntruso() {
  const t = CONFIG_INTRUSO.textos;
  if (DOM_INTRUSO.startTitle) DOM_INTRUSO.startTitle.textContent = t.inicioTitulo;
  if (DOM_INTRUSO.startMsg) DOM_INTRUSO.startMsg.textContent = t.inicioMsg;
  if (DOM_INTRUSO.winTitle) DOM_INTRUSO.winTitle.textContent = t.vitoriaTitulo;
  if (DOM_INTRUSO.winMsg) DOM_INTRUSO.winMsg.innerHTML = t.vitoriaMsg.replace(/\n/g, '<br>');
  if (DOM_INTRUSO.timeoutTitle) DOM_INTRUSO.timeoutTitle.textContent = t.tempoTitulo;
  if (DOM_INTRUSO.timeoutMsg) DOM_INTRUSO.timeoutMsg.innerHTML = t.tempoMsg.replace(/\n/g, '<br>');
  const img = CONFIG_INTRUSO.imagens;
  if (img.banner && DOM_INTRUSO.bannerImage) DOM_INTRUSO.bannerImage.src = img.banner;
  if (img.logo && DOM_INTRUSO.footerLogo) DOM_INTRUSO.footerLogo.src = img.logo;
  if (img.vitoria && DOM_INTRUSO.winImg) DOM_INTRUSO.winImg.src = img.vitoria;
  if (img.tempoEsgotado && DOM_INTRUSO.timeoutImg) DOM_INTRUSO.timeoutImg.src = img.tempoEsgotado;
  if (img.inicio && DOM_INTRUSO.startImg) DOM_INTRUSO.startImg.src = img.inicio;
  DOM_INTRUSO.timerText.textContent = CONFIG_INTRUSO.tempoPartida;
}

function embaralharFases() {
  stateIntruso.ordemFases = Array.from({length: fases.length}, (_, i) => i);
  for (let i = fases.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [stateIntruso.ordemFases[i], stateIntruso.ordemFases[j]] = [stateIntruso.ordemFases[j], stateIntruso.ordemFases[i]];
  }
}

function startGameIntruso() {
  hideAll();
  stateIntruso.faseAtual = 0;
  stateIntruso.tempoRestante = CONFIG_INTRUSO.tempoPartida;
  stateIntruso.gameStarted = true;
  stateIntruso.acertou = false;
  renderFaseIntruso();
  startTimerIntruso();
}

function renderFaseIntruso() {
  const faseIdx = stateIntruso.ordemFases[stateIntruso.faseAtual];
  const fase = fases[faseIdx];
  const board = DOM_INTRUSO.board;
  board.innerHTML = '';
  board.className = 'board board-intruso';
  // Embaralha a ordem dos itens na fase
  const itens = [...fase];
  for (let i = itens.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [itens[i], itens[j]] = [itens[j], itens[i]];
  }
  itens.forEach((item, idx) => {
    const el = document.createElement('div');
    el.className = 'intruso-item';
    el.innerHTML = `<img src="${item.imagem}" alt="${item.nome}" class="intruso-img"><div class="intruso-label">${item.nome}</div>`;
    el.addEventListener('click', () => handleEscolhaIntruso(item, el));
    board.appendChild(el);
  });
}

function handleEscolhaIntruso(item, el) {
  if (!stateIntruso.gameStarted) return;
  if (item.intruso) {
    stateIntruso.acertou = true;
    // Mostra símbolo de OK
    const okDiv = document.createElement('div');
    okDiv.className = 'intruso-ok-feedback';
    okDiv.innerHTML = '✔️';
    okDiv.style.position = 'absolute';
    okDiv.style.top = '50%';
    okDiv.style.left = '50%';
    okDiv.style.transform = 'translate(-50%, -50%) scale(1.8)';
    okDiv.style.fontSize = '3.5rem';
    okDiv.style.color = '#4caf50';
    okDiv.style.pointerEvents = 'none';
    el.appendChild(okDiv);
    // Desabilita cliques
    Array.from(DOM_INTRUSO.board.children).forEach(child => child.style.pointerEvents = 'none');
    setTimeout(() => {
      okDiv.remove();
      // Próxima fase ou vitória
      if (stateIntruso.faseAtual < fases.length - 1) {
        stateIntruso.faseAtual++;
        renderFaseIntruso();
      } else {
        stopTimerIntruso();
        show(DOM_INTRUSO.overlayWin);
      }
    }, 900);
  } else {
    el.classList.add('intruso-errado');
    setTimeout(() => {
      el.classList.remove('intruso-errado');
    }, 800);
  }
}

function startTimerIntruso() {
  stopTimerIntruso();
  DOM_INTRUSO.timerText.textContent = stateIntruso.tempoRestante;
  stateIntruso.timerInterval = setInterval(() => {
    stateIntruso.tempoRestante--;
    DOM_INTRUSO.timerText.textContent = stateIntruso.tempoRestante;
    if (stateIntruso.tempoRestante <= 0) {
      stopTimerIntruso();
      show(DOM_INTRUSO.overlayTimeout);
    }
  }, 1000);
}

function stopTimerIntruso() {
  if (stateIntruso.timerInterval) {
    clearInterval(stateIntruso.timerInterval);
    stateIntruso.timerInterval = null;
  }
}

function hideAll() {
  [DOM_INTRUSO.overlayStart, DOM_INTRUSO.overlayWin, DOM_INTRUSO.overlayTimeout].forEach(el => el && (el.style.opacity = 0, el.style.visibility = 'hidden'));
}

function show(el) {
  if (el) {
    el.style.opacity = 1;
    el.style.visibility = 'visible';
  }
}

// Botão de recomeçar
window.restartGame = function() {
  startGameIntruso();
};

// Botão de iniciar
window.startGame = function() {
  startGameIntruso();
};

document.addEventListener('DOMContentLoaded', () => {
  if (window.CONFIG_INTRUSO && window.fasesIntruso) {
    fases = window.fasesIntruso;
    initIntruso();
  }
});
