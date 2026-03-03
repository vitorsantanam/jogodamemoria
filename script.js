/* ==========================================
   JOGO DA VELHA - LÓGICA SINGLE-PLAYER
   Dia das Mães - Interativo para Totem
   Jogador vs Computador
   ========================================== */

// ===== ESTADO DO JOGO =====
let gameState = {
  board: Array(9).fill(null),
  isGameOver: false,
  isPlayerTurn: true,
  timeLeft: CONFIG.tempoPartida,
  timerInterval: null,
  moveCount: 0,
  gameStarted: false,
  autoRestartTimeout: null,
  idleTimeout: null,
  lastInteraction: Date.now(),
};

// Combinações de vitória
const WIN_COMBOS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // linhas
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // colunas
  [0, 4, 8], [2, 4, 6],             // diagonais
];

// ===== ELEMENTOS DOM =====
const DOM = {
  board: document.getElementById("board"),
  cells: document.querySelectorAll(".cell"),
  timerText: document.getElementById("timerText"),
  timerProgress: document.getElementById("timerProgress"),
  turnLabel: document.getElementById("turnLabel"),
  turnSymbol: document.getElementById("turnSymbol"),
  turnIndicator: document.getElementById("turnIndicator"),
  overlayStart: document.getElementById("overlayStart"),
  overlayWin: document.getElementById("overlayWin"),
  overlayLose: document.getElementById("overlayLose"),
  overlayDraw: document.getElementById("overlayDraw"),
  overlayTimeout: document.getElementById("overlayTimeout"),
  winTitle: document.getElementById("winTitle"),
  winMessage: document.getElementById("winMessage"),
  winImage: document.getElementById("winImage"),
  loseTitle: document.getElementById("loseTitle"),
  loseMessage: document.getElementById("loseMessage"),
  drawTitle: document.getElementById("drawTitle"),
  drawMessage: document.getElementById("drawMessage"),
  timeoutTitle: document.getElementById("timeoutTitle"),
  timeoutMessage: document.getElementById("timeoutMessage"),
  timeoutImage: document.getElementById("timeoutImage"),
  startTitle: document.getElementById("startTitle"),
  startMessage: document.getElementById("startMessage"),
  startImage: document.getElementById("startImage"),
  startIcon: document.getElementById("startIcon"),
  winLineSvg: document.getElementById("winLineSvg"),
  winLine: document.getElementById("winLine"),
  confetti: document.getElementById("confetti"),
  particles: document.getElementById("particles"),
  bannerImage: document.getElementById("bannerImage"),
  footerLogo: document.getElementById("footerLogo"),
  footerText: document.getElementById("footerText"),
  gameTitle: document.getElementById("gameTitle"),
  gameSubtitle: document.getElementById("gameSubtitle"),
};

// ===== INICIALIZAÇÃO =====
function init() {
  applyConfig();
  setupEventListeners();
  createParticles();
  setupIdleWatcher();

  if (CONFIG.mostrarTelaInicial) {
    showOverlay(DOM.overlayStart);
  } else {
    startGame();
  }
}

// ===== APLICAR CONFIGURAÇÕES =====
function applyConfig() {
  // Textos do cabeçalho
  DOM.gameTitle.textContent = CONFIG.textos.titulo;
  DOM.gameSubtitle.textContent = CONFIG.textos.subtitulo;
  DOM.footerText.textContent = CONFIG.textos.rodape;

  // Tela inicial
  DOM.startTitle.textContent = CONFIG.textos.inicioTitulo;
  DOM.startMessage.textContent = CONFIG.textos.inicioMsg;

  // Imagens
  if (CONFIG.imagens.banner) DOM.bannerImage.src = CONFIG.imagens.banner;
  if (CONFIG.imagens.logo) DOM.footerLogo.src = CONFIG.imagens.logo;
  if (CONFIG.imagens.vitoria) DOM.winImage.src = CONFIG.imagens.vitoria;
  if (CONFIG.imagens.tempoEsgotado) DOM.timeoutImage.src = CONFIG.imagens.tempoEsgotado;
  if (CONFIG.imagens.inicio) DOM.startImage.src = CONFIG.imagens.inicio;

  // Textos dos overlays
  DOM.winTitle.textContent = CONFIG.textos.vitoriaTitulo;
  DOM.winMessage.innerHTML = CONFIG.textos.vitoriaMsg.replace(/\n/g, "<br>");
  DOM.loseTitle.textContent = CONFIG.textos.derrotaTitulo;
  DOM.loseMessage.innerHTML = CONFIG.textos.derrotaMsg.replace(/\n/g, "<br>");
  DOM.drawTitle.textContent = CONFIG.textos.empateTitulo;
  DOM.drawMessage.innerHTML = CONFIG.textos.empateMsg.replace(/\n/g, "<br>");
  DOM.timeoutTitle.textContent = CONFIG.textos.tempoTitulo;
  DOM.timeoutMessage.innerHTML = CONFIG.textos.tempoMsg.replace(/\n/g, "<br>");

  // Timer display
  DOM.timerText.textContent = CONFIG.tempoPartida;
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
  DOM.cells.forEach((cell) => {
    cell.addEventListener("click", () => handleCellClick(cell));
    cell.addEventListener("touchstart", (e) => {
      e.preventDefault();
      handleCellClick(cell);
    }, { passive: false });
  });

  // Rastrear interação para idle mode
  document.addEventListener("touchstart", registerInteraction, { passive: true });
  document.addEventListener("click", registerInteraction);
}

// ===== COMEÇAR O JOGO =====
function startGame() {
  hideAllOverlays();
  clearAutoRestart();
  resetBoard();
  gameState.gameStarted = true;
  gameState.isPlayerTurn = true;
  updateTurnDisplay();
  startTimer();
  registerInteraction();
}

// ===== CLIQUE NA CÉLULA =====
function handleCellClick(cell) {
  registerInteraction();

  const index = parseInt(cell.dataset.index);

  // Só joga se for vez do jogador, célula vazia e jogo não acabou
  if (!gameState.isPlayerTurn || gameState.board[index] !== null || gameState.isGameOver || !gameState.gameStarted) return;

  // Fazer a jogada do jogador
  makeMove(index, "X");

  // Verificar vitória do jogador
  const winCombo = checkWin("X");
  if (winCombo) {
    handlePlayerWin(winCombo);
    return;
  }

  // Verificar empate
  if (gameState.moveCount === 9) {
    handleDraw();
    return;
  }

  // Vez do computador
  gameState.isPlayerTurn = false;
  updateTurnDisplay();
  DOM.board.classList.add("locked");

  setTimeout(() => {
    if (!gameState.isGameOver) {
      computerMove();
    }
  }, CONFIG.tempoRespostaPC);
}

// ===== FAZER JOGADA =====
function makeMove(index, player) {
  gameState.board[index] = player;
  gameState.moveCount++;

  const cell = DOM.cells[index];
  cell.classList.add("taken");

  const mark = document.createElement("div");
  const config = player === "X" ? CONFIG.jogador : CONFIG.computador;

  if (config.imagemMarca) {
    mark.className = `mark mark-${player.toLowerCase()}`;
    mark.innerHTML = `<img src="${config.imagemMarca}" alt="${player}">`;
  } else {
    mark.className = `mark mark-${player.toLowerCase()}`;
    mark.textContent = config.simbolo;
  }

  cell.appendChild(mark);
  playSound("jogada");
}

// ===== JOGADA DO COMPUTADOR =====
function computerMove() {
  if (gameState.isGameOver) return;

  let index;

  switch (CONFIG.dificuldade) {
    case "facil":
      index = getEasyMove();
      break;
    case "dificil":
      index = getBestMove();
      break;
    case "medio":
    default:
      index = Math.random() < 0.55 ? getBestMove() : getRandomMove();
      break;
  }

  if (index !== null && index !== undefined) {
    makeMove(index, "O");

    // Verificar vitória do computador
    const winCombo = checkWin("O");
    if (winCombo) {
      handleComputerWin(winCombo);
      return;
    }

    // Verificar empate
    if (gameState.moveCount === 9) {
      handleDraw();
      return;
    }

    // Devolver vez ao jogador
    gameState.isPlayerTurn = true;
    DOM.board.classList.remove("locked");
    updateTurnDisplay();
  }
}

// ===== IA: JOGADA FÁCIL (prioriza bloqueio, mas erra) =====
function getEasyMove() {
  // 30% chance de jogar aleatório puro
  if (Math.random() < 0.3) return getRandomMove();

  // Tenta bloquear jogador se possível
  const blockMove = findWinningMove("X");
  if (blockMove !== null && Math.random() < 0.7) return blockMove;

  return getRandomMove();
}

// ===== IA: JOGADA ALEATÓRIA =====
function getRandomMove() {
  const available = gameState.board
    .map((v, i) => (v === null ? i : null))
    .filter((v) => v !== null);
  return available[Math.floor(Math.random() * available.length)];
}

// ===== IA: ENCONTRAR JOGADA VENCEDORA =====
function findWinningMove(player) {
  for (let i = 0; i < 9; i++) {
    if (gameState.board[i] === null) {
      gameState.board[i] = player;
      if (checkWinBoard(gameState.board, player)) {
        gameState.board[i] = null;
        return i;
      }
      gameState.board[i] = null;
    }
  }
  return null;
}

// ===== IA: MINIMAX (modo difícil) =====
function getBestMove() {
  // Primeiro: tenta vencer
  const winMove = findWinningMove("O");
  if (winMove !== null) return winMove;

  // Segundo: bloqueia jogador
  const blockMove = findWinningMove("X");
  if (blockMove !== null) return blockMove;

  // Terceiro: minimax
  let bestScore = -Infinity;
  let bestMove = null;

  for (let i = 0; i < 9; i++) {
    if (gameState.board[i] === null) {
      gameState.board[i] = "O";
      const score = minimax(gameState.board, 0, false);
      gameState.board[i] = null;
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }
  return bestMove;
}

function minimax(board, depth, isMaximizing) {
  if (checkWinBoard(board, "O")) return 10 - depth;
  if (checkWinBoard(board, "X")) return depth - 10;
  if (board.every((cell) => cell !== null)) return 0;

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = "O";
        best = Math.max(best, minimax(board, depth + 1, false));
        board[i] = null;
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = "X";
        best = Math.min(best, minimax(board, depth + 1, true));
        board[i] = null;
      }
    }
    return best;
  }
}

function checkWinBoard(board, player) {
  return WIN_COMBOS.some((combo) => combo.every((i) => board[i] === player));
}

// ===== ATUALIZAR DISPLAY DE VEZ =====
function updateTurnDisplay() {
  if (gameState.isPlayerTurn) {
    DOM.turnLabel.textContent = CONFIG.textos.suaVez;
    DOM.turnLabel.classList.remove("waiting");
    DOM.turnSymbol.textContent = CONFIG.jogador.simbolo;
    DOM.turnSymbol.style.animation = "turnBounce 1s ease-in-out infinite";
  } else {
    DOM.turnLabel.textContent = CONFIG.textos.pcPensando;
    DOM.turnLabel.classList.add("waiting");
    DOM.turnSymbol.textContent = CONFIG.computador.simbolo;
    DOM.turnSymbol.style.animation = "none";
  }
}

// ===== VERIFICAR VITÓRIA =====
function checkWin(player) {
  for (const combo of WIN_COMBOS) {
    if (combo.every((i) => gameState.board[i] === player)) {
      return combo;
    }
  }
  return null;
}

// ===== VITÓRIA DO JOGADOR =====
function handlePlayerWin(combo) {
  gameState.isGameOver = true;
  stopTimer();

  // Destacar células vencedoras
  combo.forEach((i) => DOM.cells[i].classList.add("win-cell"));
  drawWinLine(combo);

  setTimeout(() => {
    showOverlay(DOM.overlayWin);
    createConfetti();
    playSound("vitoria");
    setupAutoRestart();
  }, 800);
}

// ===== DERROTA DO JOGADOR =====
function handleComputerWin(combo) {
  gameState.isGameOver = true;
  stopTimer();

  combo.forEach((i) => DOM.cells[i].classList.add("win-cell"));
  drawWinLine(combo);

  setTimeout(() => {
    showOverlay(DOM.overlayLose);
    playSound("derrota");
    setupAutoRestart();
  }, 800);
}

// ===== EMPATE =====
function handleDraw() {
  gameState.isGameOver = true;
  stopTimer();

  setTimeout(() => {
    showOverlay(DOM.overlayDraw);
    playSound("empate");
    setupAutoRestart();
  }, 400);
}

// ===== TEMPO ESGOTADO =====
function handleTimeout() {
  gameState.isGameOver = true;
  stopTimer();

  DOM.board.classList.add("shake");
  setTimeout(() => DOM.board.classList.remove("shake"), 600);

  setTimeout(() => {
    showOverlay(DOM.overlayTimeout);
    playSound("tempoAcabou");
    setupAutoRestart();
  }, 700);
}

// ===== TIMER =====
function startTimer() {
  gameState.timeLeft = CONFIG.tempoPartida;
  updateTimerDisplay();

  gameState.timerInterval = setInterval(() => {
    gameState.timeLeft--;
    updateTimerDisplay();

    if (gameState.timeLeft <= CONFIG.tempoCritico) {
      playSound("tick");
    }

    if (gameState.timeLeft <= 0) {
      handleTimeout();
    }
  }, 1000);
}

function stopTimer() {
  if (gameState.timerInterval) {
    clearInterval(gameState.timerInterval);
    gameState.timerInterval = null;
  }
}

function updateTimerDisplay() {
  const time = Math.max(0, gameState.timeLeft);
  DOM.timerText.textContent = time;

  // Progresso circular
  const total = CONFIG.tempoPartida;
  const circumference = 2 * Math.PI * 54;
  const offset = circumference * (1 - time / total);
  DOM.timerProgress.style.strokeDashoffset = offset;

  // Classes de alerta
  DOM.timerProgress.classList.remove("warning", "danger");
  if (time <= CONFIG.tempoCritico) {
    DOM.timerProgress.classList.add("danger");
  } else if (time <= CONFIG.tempoAlerta) {
    DOM.timerProgress.classList.add("warning");
  }
}

// ===== LINHA DE VITÓRIA =====
function drawWinLine(combo) {
  const cellSize = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--tamanho-celula'));
  const gap = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--gap-celula'));
  const step = cellSize + gap;
  const half = cellSize / 2;

  const getPos = (i) => ({
    x: (i % 3) * step + half,
    y: Math.floor(i / 3) * step + half,
  });

  const start = getPos(combo[0]);
  const end = getPos(combo[2]);

  DOM.winLine.setAttribute("x1", start.x);
  DOM.winLine.setAttribute("y1", start.y);
  DOM.winLine.setAttribute("x2", end.x);
  DOM.winLine.setAttribute("y2", end.y);
  DOM.winLineSvg.style.display = "block";
}

// ===== OVERLAYS =====
function showOverlay(overlay) {
  overlay.classList.add("visible");
}

function hideAllOverlays() {
  [DOM.overlayStart, DOM.overlayWin, DOM.overlayLose, DOM.overlayDraw, DOM.overlayTimeout].forEach(o => {
    if (o) o.classList.remove("visible");
  });
}

// ===== REINICIAR JOGO =====
function restartGame() {
  hideAllOverlays();
  clearAutoRestart();
  resetBoard();
  gameState.gameStarted = true;
  gameState.isPlayerTurn = true;
  DOM.board.classList.remove("locked");
  updateTurnDisplay();
  startTimer();
  registerInteraction();
}

function resetBoard() {
  stopTimer();

  gameState.board = Array(9).fill(null);
  gameState.isGameOver = false;
  gameState.moveCount = 0;
  gameState.isPlayerTurn = true;

  // Limpar tabuleiro visual
  DOM.cells.forEach((cell) => {
    cell.classList.remove("taken", "win-cell");
    cell.innerHTML = "";
  });

  // Esconder linha de vitória
  DOM.winLineSvg.style.display = "none";

  // Limpar confetti
  if (DOM.confetti) DOM.confetti.innerHTML = "";

  // Reset timer display
  DOM.timerText.textContent = CONFIG.tempoPartida;
  DOM.timerProgress.style.strokeDashoffset = 0;
  DOM.timerProgress.classList.remove("warning", "danger");
}

// ===== AUTO RESTART =====
function setupAutoRestart() {
  if (CONFIG.autoRestartSegundos <= 0) return;

  const seconds = CONFIG.autoRestartSegundos;

  // Adicionar barra de progresso e texto no overlay visível
  const visibleOverlay = document.querySelector(".overlay.visible .overlay-content");
  if (visibleOverlay) {
    // Remover barra existente se houver
    const existingBar = visibleOverlay.querySelector(".auto-restart-bar");
    if (existingBar) existingBar.remove();
    const existingText = visibleOverlay.querySelector(".auto-restart-text");
    if (existingText) existingText.remove();

    const barWrapper = document.createElement("div");
    barWrapper.className = "auto-restart-bar";
    const barProgress = document.createElement("div");
    barProgress.className = "auto-restart-progress";
    barProgress.style.width = "100%";
    barWrapper.appendChild(barProgress);
    visibleOverlay.appendChild(barWrapper);

    const text = document.createElement("p");
    text.className = "auto-restart-text";
    text.textContent = `Reiniciando em ${seconds}s...`;
    visibleOverlay.appendChild(text);

    // Animar barra
    let remaining = seconds;
    const barInterval = setInterval(() => {
      remaining--;
      if (remaining <= 0) {
        clearInterval(barInterval);
        return;
      }
      barProgress.style.width = ((remaining / seconds) * 100) + "%";
      text.textContent = `Reiniciando em ${remaining}s...`;
    }, 1000);

    // Agendar restart
    gameState.autoRestartTimeout = setTimeout(() => {
      clearInterval(barInterval);
      restartGame();
    }, seconds * 1000);
  }
}

function clearAutoRestart() {
  if (gameState.autoRestartTimeout) {
    clearTimeout(gameState.autoRestartTimeout);
    gameState.autoRestartTimeout = null;
  }
}

// ===== IDLE / ATTRACT MODE =====
function setupIdleWatcher() {
  if (CONFIG.idleTimeoutSegundos <= 0) return;

  setInterval(() => {
    const elapsed = (Date.now() - gameState.lastInteraction) / 1000;
    if (elapsed >= CONFIG.idleTimeoutSegundos && gameState.gameStarted) {
      // Voltar à tela inicial
      gameState.gameStarted = false;
      hideAllOverlays();
      clearAutoRestart();
      resetBoard();
      if (CONFIG.mostrarTelaInicial) {
        showOverlay(DOM.overlayStart);
      }
    }
  }, 5000);
}

function registerInteraction() {
  gameState.lastInteraction = Date.now();
}

// ===== CONFETTI =====
function createConfetti() {
  const colors = ["#e91e63", "#f06292", "#ce93d8", "#ff80ab", "#f48fb1", "#ffb74d", "#fff176", "#81c784"];
  const container = DOM.confetti;
  container.innerHTML = "";

  for (let i = 0; i < 80; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece";
    piece.style.left = Math.random() * 100 + "%";
    piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDuration = (Math.random() * 2 + 1.5) + "s";
    piece.style.animationDelay = Math.random() * 1 + "s";
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    container.appendChild(piece);
  }
}

// ===== PARTÍCULAS DECORATIVAS =====
function createParticles() {
  if (!CONFIG.particulas.ativas) return;

  const container = DOM.particles;
  container.innerHTML = "";
  const emojis = CONFIG.particulas.emojis;

  for (let i = 0; i < CONFIG.particulas.quantidade; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    p.style.left = Math.random() * 100 + "%";
    p.style.fontSize = (Math.random() * 20 + 18) + "px";
    p.style.animationDuration = (Math.random() * 15 + 10) + "s";
    p.style.animationDelay = (Math.random() * 20) + "s";
    container.appendChild(p);
  }
}

// ===== SONS =====
function playSound(type) {
  const soundPath = CONFIG.sons[type];
  if (!soundPath) return;

  try {
    const audio = new Audio(soundPath);
    audio.volume = 0.5;
    audio.play().catch(() => {});
  } catch (e) {
    // Silenciar erros de áudio
  }
}

// ===== INICIAR QUANDO DOM PRONTO =====
document.addEventListener("DOMContentLoaded", init);

// ===== PREVENIR SCROLL E ZOOM EM TOUCH =====
document.addEventListener("touchmove", (e) => e.preventDefault(), { passive: false });
document.addEventListener("gesturestart", (e) => e.preventDefault());
document.addEventListener("gesturechange", (e) => e.preventDefault());
