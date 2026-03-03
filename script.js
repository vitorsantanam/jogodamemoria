/* ==========================================
   JOGO DA VELHA - LÓGICA DO JOGO
   Dia das Mães - Interativo para Totem
   ========================================== */

// ===== ESTADO DO JOGO =====
let gameState = {
  board: Array(9).fill(null),
  currentPlayer: "X",
  isGameOver: false,
  scores: { X: 0, O: 0 },
  timeLeft: CONFIG.tempoPartida,
  timerInterval: null,
  moveCount: 0,
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
  turnIndicator: document.getElementById("turnIndicator"),
  turnSymbol: document.getElementById("turnSymbol"),
  playerXScore: document.getElementById("playerXScore"),
  playerOScore: document.getElementById("playerOScore"),
  playerXInfo: document.getElementById("playerXInfo"),
  playerOInfo: document.getElementById("playerOInfo"),
  playerXName: document.getElementById("playerXName"),
  playerOName: document.getElementById("playerOName"),
  playerXAvatar: document.getElementById("playerXAvatar"),
  playerOAvatar: document.getElementById("playerOAvatar"),
  overlayWin: document.getElementById("overlayWin"),
  overlayDraw: document.getElementById("overlayDraw"),
  overlayTimeout: document.getElementById("overlayTimeout"),
  winTitle: document.getElementById("winTitle"),
  winMessage: document.getElementById("winMessage"),
  winImage: document.getElementById("winImage"),
  drawMessage: document.getElementById("drawMessage"),
  timeoutTitle: document.getElementById("timeoutTitle"),
  timeoutMessage: document.getElementById("timeoutMessage"),
  timeoutImage: document.getElementById("timeoutImage"),
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
  startTimer();
  updateTurnDisplay();
}

// ===== APLICAR CONFIGURAÇÕES =====
function applyConfig() {
  // Textos
  DOM.gameTitle.textContent = CONFIG.textos.titulo;
  DOM.gameSubtitle.textContent = CONFIG.textos.subtitulo;
  DOM.footerText.textContent = CONFIG.textos.rodape;

  // Nomes dos jogadores
  DOM.playerXName.textContent = CONFIG.jogadorX.nome;
  DOM.playerOName.textContent = CONFIG.jogadorO.nome;

  // Avatares
  if (CONFIG.jogadorX.imagemAvatar) {
    DOM.playerXAvatar.innerHTML = `<img src="${CONFIG.jogadorX.imagemAvatar}" alt="${CONFIG.jogadorX.nome}">`;
  } else {
    DOM.playerXAvatar.innerHTML = CONFIG.jogadorX.simbolo;
  }

  if (CONFIG.jogadorO.imagemAvatar) {
    DOM.playerOAvatar.innerHTML = `<img src="${CONFIG.jogadorO.imagemAvatar}" alt="${CONFIG.jogadorO.nome}">`;
  } else {
    DOM.playerOAvatar.innerHTML = CONFIG.jogadorO.simbolo;
  }

  // Imagens
  if (CONFIG.imagens.banner) DOM.bannerImage.src = CONFIG.imagens.banner;
  if (CONFIG.imagens.logo) DOM.footerLogo.src = CONFIG.imagens.logo;
  if (CONFIG.imagens.vitoria) DOM.winImage.src = CONFIG.imagens.vitoria;
  if (CONFIG.imagens.tempoEsgotado) DOM.timeoutImage.src = CONFIG.imagens.tempoEsgotado;

  // Textos dos overlays
  DOM.timeoutTitle.textContent = CONFIG.textos.tempoTitulo;
  DOM.timeoutMessage.innerHTML = CONFIG.textos.tempoMsg.replace(/\n/g, "<br>");
  DOM.drawMessage.textContent = CONFIG.textos.empateMsg;

  // Timer
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
}

// ===== CLIQUE NA CÉLULA =====
function handleCellClick(cell) {
  const index = parseInt(cell.dataset.index);

  // Verificar se pode jogar
  if (gameState.board[index] !== null || gameState.isGameOver) return;

  // Fazer a jogada
  makeMove(index, gameState.currentPlayer);

  // Verificar vitória/empate
  const winCombo = checkWin(gameState.currentPlayer);
  if (winCombo) {
    handleWin(gameState.currentPlayer, winCombo);
    return;
  }

  if (gameState.moveCount === 9) {
    handleDraw();
    return;
  }

  // Trocar jogador
  switchPlayer();

  // Se modo PvC e é vez do computador
  if (CONFIG.modoJogo === "pvc" && gameState.currentPlayer === "O" && !gameState.isGameOver) {
    setTimeout(() => computerMove(), 500);
  }
}

// ===== FAZER JOGADA =====
function makeMove(index, player) {
  gameState.board[index] = player;
  gameState.moveCount++;

  const cell = DOM.cells[index];
  cell.classList.add("taken");

  const mark = document.createElement("div");
  const config = player === "X" ? CONFIG.jogadorX : CONFIG.jogadorO;

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

// ===== TROCAR JOGADOR =====
function switchPlayer() {
  gameState.currentPlayer = gameState.currentPlayer === "X" ? "O" : "X";
  updateTurnDisplay();
}

// ===== ATUALIZAR DISPLAY DE TURNO =====
function updateTurnDisplay() {
  const isX = gameState.currentPlayer === "X";

  DOM.turnIndicator.className = `turn-indicator turn-${isX ? "x" : "o"}`;
  const config = isX ? CONFIG.jogadorX : CONFIG.jogadorO;
  DOM.turnSymbol.textContent = config.simbolo;

  DOM.playerXInfo.classList.toggle("active", isX);
  DOM.playerOInfo.classList.toggle("active", !isX);
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

// ===== TRATAR VITÓRIA =====
function handleWin(player, combo) {
  gameState.isGameOver = true;
  stopTimer();

  // Atualizar placar
  gameState.scores[player]++;
  DOM.playerXScore.textContent = gameState.scores.X;
  DOM.playerOScore.textContent = gameState.scores.O;

  // Destacar células vencedoras
  combo.forEach((i) => DOM.cells[i].classList.add("win-cell"));

  // Desenhar linha de vitória
  drawWinLine(combo);

  // Mostrar overlay após animação
  const config = player === "X" ? CONFIG.jogadorX : CONFIG.jogadorO;
  setTimeout(() => {
    DOM.winTitle.textContent = CONFIG.textos.vitoriaTitulo;
    DOM.winMessage.textContent = CONFIG.textos.vitoriaMsg.replace("{jogador}", config.nome);
    showOverlay(DOM.overlayWin);
    createConfetti();
    playSound("vitoria");
  }, 800);

  // Auto restart
  if (CONFIG.autoRestartSegundos > 0) {
    setTimeout(() => restartGame(), CONFIG.autoRestartSegundos * 1000);
  }
}

// ===== TRATAR EMPATE =====
function handleDraw() {
  gameState.isGameOver = true;
  stopTimer();

  setTimeout(() => {
    showOverlay(DOM.overlayDraw);
    playSound("empate");
  }, 400);

  if (CONFIG.autoRestartSegundos > 0) {
    setTimeout(() => restartGame(), CONFIG.autoRestartSegundos * 1000);
  }
}

// ===== TRATAR TEMPO ESGOTADO =====
function handleTimeout() {
  gameState.isGameOver = true;
  stopTimer();

  // Shake no tabuleiro
  DOM.board.classList.add("shake");
  setTimeout(() => DOM.board.classList.remove("shake"), 600);

  setTimeout(() => {
    showOverlay(DOM.overlayTimeout);
    playSound("tempoAcabou");
  }, 700);

  if (CONFIG.autoRestartSegundos > 0) {
    setTimeout(() => restartGame(), CONFIG.autoRestartSegundos * 1000);
  }
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
  const circumference = 2 * Math.PI * 54; // raio = 54
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

  // Mapear índice para coordenada (col, row)
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
  DOM.overlayWin.classList.remove("visible");
  DOM.overlayDraw.classList.remove("visible");
  DOM.overlayTimeout.classList.remove("visible");
}

// ===== REINICIAR JOGO (mantém placar) =====
function restartGame() {
  hideAllOverlays();
  stopTimer();

  gameState.board = Array(9).fill(null);
  gameState.currentPlayer = "X";
  gameState.isGameOver = false;
  gameState.moveCount = 0;

  // Limpar tabuleiro
  DOM.cells.forEach((cell) => {
    cell.classList.remove("taken", "win-cell");
    cell.innerHTML = "";
  });

  // Esconder linha de vitória
  DOM.winLineSvg.style.display = "none";

  // Limpar confetti
  DOM.confetti.innerHTML = "";

  updateTurnDisplay();
  startTimer();
}

// ===== NOVO JOGO (reseta placar) =====
function newGame() {
  gameState.scores = { X: 0, O: 0 };
  DOM.playerXScore.textContent = "0";
  DOM.playerOScore.textContent = "0";
  restartGame();
}

// ===== IA DO COMPUTADOR =====
function computerMove() {
  if (gameState.isGameOver) return;

  let index;

  switch (CONFIG.dificuldadePC) {
    case "facil":
      index = getRandomMove();
      break;
    case "dificil":
      index = getBestMove();
      break;
    case "medio":
    default:
      index = Math.random() < 0.6 ? getBestMove() : getRandomMove();
      break;
  }

  if (index !== null && index !== undefined) {
    makeMove(index, "O");

    const winCombo = checkWin("O");
    if (winCombo) {
      handleWin("O", winCombo);
      return;
    }

    if (gameState.moveCount === 9) {
      handleDraw();
      return;
    }

    switchPlayer();
  }
}

function getRandomMove() {
  const available = gameState.board
    .map((v, i) => (v === null ? i : null))
    .filter((v) => v !== null);
  return available[Math.floor(Math.random() * available.length)];
}

function getBestMove() {
  // Minimax simplificado
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
  // Verificar estados terminais
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

// ===== CONFETTI =====
function createConfetti() {
  const colors = ["#e91e63", "#f06292", "#ce93d8", "#ff80ab", "#f48fb1", "#ffb74d", "#fff176", "#81c784"];
  const container = DOM.confetti;
  container.innerHTML = "";

  for (let i = 0; i < 60; i++) {
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
    audio.play().catch(() => {}); // Silent fail (autoplay policy)
  } catch (e) {
    // Silenciar erros de áudio
  }
}

// ===== INICIAR QUANDO DOM PRONTO =====
document.addEventListener("DOMContentLoaded", init);

// ===== PREVENIR SCROLL E ZOOM EM TELA TOUCH =====
document.addEventListener("touchmove", (e) => e.preventDefault(), { passive: false });
document.addEventListener("gesturestart", (e) => e.preventDefault());
document.addEventListener("gesturechange", (e) => e.preventDefault());
