/* ==========================================
   CONFIGURAÇÃO – JOGO DA MEMÓRIA
   Altere aqui para personalizar tudo!
   ========================================== */

const CONFIG = {

  // ===== TIMER =====
  tempoPartida: 60,       // segundos
  tempoAlerta: 15,        // timer fica amarelo
  tempoCritico: 5,        // timer fica vermelho e pulsa

  // ===== CARTAS (6 PARES) =====
  // Cada item = 1 par. Coloque o caminho da imagem.
  // O número (label) é gerado automaticamente (1, 2, 3...).
  // As cartas são embaralhadas a cada partida.
  cartas: [
    { imagem: "images/carta1.png" },   // Par 1
    { imagem: "images/carta2.png" },   // Par 2
    { imagem: "images/carta3.png" },   // Par 3
    { imagem: "images/carta4.png" },   // Par 4
    { imagem: "images/carta5.png" },   // Par 5
    { imagem: "images/carta6.png" },   // Par 6
  ],

  // ===== TEXTOS =====
  textos: {
    inicioTitulo: "Feliz Dia das Mulheres!",
    inicioMsg: "Encontre todos os pares e ganhe uma lembrancinha!",
    inicioBotao: "Toque para Jogar!",

    vitoriaTitulo: "Parabéns, você ganhou! 🎉",
    vitoriaMsg: "Você encontrou todos os pares! 🎁\nRetire sua lembrancinha especial!",

    tempoTitulo: "Que pena, o tempo acabou! ⏰",
    tempoMsg: "Mas não fique triste! 😊\nTente novamente, temos certeza que você consegue!",
  },

  // ===== IMAGENS =====
  imagens: {
    banner: "images/banner.png",          // topo
    logo: "images/logo.png",              // rodapé
    vitoria: "images/vitoria.png",        // overlay vitória
    tempoEsgotado: "images/tempo_esgotado.png", // overlay timeout
    inicio: "images/banner.png",          // overlay inicial
  },

  // ===== PARTÍCULAS DECORATIVAS =====
  particulas: {
    ativas: true,
    quantidade: 18,
    emojis: ["❤️", "🌸", "🌷", "💐", "💖", "🌺", "✨", "🦋"],
  },

  // ===== SONS (opcional) =====
  sons: {
    flip: "",          // Ex: "sounds/flip.mp3"
    match: "",         // Ex: "sounds/match.mp3"
    noMatch: "",       // Ex: "sounds/fail.mp3"
    vitoria: "",
    tempoAcabou: "",
    tick: "",
  },

  // ===== TELA INICIAL =====
  mostrarTelaInicial: true,

  // ===== AUTO RESTART =====
  autoRestartSegundos: 15,   // 0 = desativado

  // ===== IDLE (volta à tela inicial se ninguém jogar) =====
  idleTimeoutSegundos: 120,  // 0 = desativado
};
