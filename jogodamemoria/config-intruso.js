/* ==========================================
   CONFIGURAÇÃO – JOGO DO INTRUSO
   ========================================== */

const CONFIG_INTRUSO = {
  tempoPartida: 60, // segundos
  tempoAlerta: 15,
  tempoCritico: 5,
  fases: null, // será carregado de fases-intruso.js
  textos: {
    inicioTitulo: "Jogo do Intruso!",
    inicioMsg: "Encontre o item que não pertence ao grupo!",
    inicioBotao: "Toque para Jogar!",
    vitoriaTitulo: "Parabéns, você acertou! 🎉",
    vitoriaMsg: "Você encontrou o intruso! 🎁\nRetire sua lembrancinha especial!",
    tempoTitulo: "Que pena, o tempo acabou! ⏰",
    tempoMsg: "Mas não fique triste! 😊\nTente novamente, temos certeza que você consegue!",
  },
  imagens: {
    banner: "images/banner.png",
    logo: "images/logo.png",
    vitoria: "images/vitoria.png",
    tempoEsgotado: "images/tempo_esgotado.png",
    inicio: "images/banner.png",
  },
  mostrarTelaInicial: true,
  autoRestartSegundos: 15,
  idleTimeoutSegundos: 120,
};
// Torna global para browser
window.CONFIG_INTRUSO = CONFIG_INTRUSO;
