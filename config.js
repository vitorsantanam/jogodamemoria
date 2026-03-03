/* ==========================================
   CONFIGURAÇÃO DO JOGO DA VELHA
   Altere os valores abaixo para personalizar!
   ========================================== */

const CONFIG = {

  // ===== TIMER =====
  // Tempo em segundos para cada partida
  tempoPartida: 60,
  // Segundos restantes para alerta amarelo
  tempoAlerta: 15,
  // Segundos restantes para alerta vermelho (pisca)
  tempoCritico: 5,

  // ===== DIFICULDADE DO COMPUTADOR =====
  // "facil"   → o computador erra bastante (ideal para crianças)
  // "medio"   → o computador joga razoável (recomendado)
  // "dificil" → o computador joga quase perfeito
  dificuldade: "facil",

  // Tempo de resposta do computador em milissegundos
  // (simula "pensando" para parecer mais natural)
  tempoRespostaPC: 600,

  // ===== MARCAS DO JOGADOR E COMPUTADOR =====
  jogador: {
    // Símbolo exibido no tabuleiro (emoji ou texto)
    simbolo: "❤️",
    // OU use uma imagem no lugar do símbolo:
    // imagemMarca: "images/coracao.png",
    imagemMarca: "",
  },

  computador: {
    simbolo: "🌸",
    // imagemMarca: "images/flor.png",
    imagemMarca: "",
  },

  // ===== TEXTOS PERSONALIZÁVEIS =====
  textos: {
    // Cabeçalho
    titulo: "Feliz Dia das Mães!",
    subtitulo: "Toque para jogar e ganhe uma lembrancinha! 💐",
    rodape: "Com carinho para as melhores mães! 💖",

    // Tela inicial (attract screen)
    inicioTitulo: "Feliz Dia das Mães!",
    inicioMsg: "Jogue e ganhe uma lembrancinha especial!",
    inicioBotao: "Toque para Jogar!",

    // Indicador de vez
    suaVez: "Sua vez!",
    pcPensando: "Pensando...",

    // Vitória do jogador (ganhou lembrancinha!)
    vitoriaTitulo: "Parabéns, você ganhou! 🎉",
    vitoriaMsg: "Você é demais! 🎁\nRetire sua lembrancinha especial!",

    // Derrota (computador ganhou)
    derrotaTitulo: "Quase lá! 😊",
    derrotaMsg: "Não desista! Tente mais uma vez, você consegue! 💪",

    // Empate
    empateTitulo: "Empate! 🤝",
    empateMsg: "Você jogou muito bem! Tente mais uma vez! 😊",

    // Tempo esgotado
    tempoTitulo: "Que pena, o tempo acabou! ⏰",
    tempoMsg: "Mas não fique triste! 😊\nTente novamente, temos certeza que você consegue!",
  },

  // ===== IMAGENS (caminhos relativos) =====
  imagens: {
    // Banner no topo (ex: arte do dia das mães do supermercado)
    banner: "images/banner.png",
    // Logo no rodapé (ex: logo do supermercado)
    logo: "images/logo.png",
    // Imagem exibida na tela de vitória
    vitoria: "images/vitoria.png",
    // Imagem exibida quando o tempo acaba
    tempoEsgotado: "images/tempo_esgotado.png",
    // Imagem da tela inicial
    inicio: "images/banner.png",
  },

  // ===== PARTÍCULAS DECORATIVAS =====
  particulas: {
    ativas: true,
    quantidade: 20,
    // Emojis que flutuam no fundo
    emojis: ["❤️", "🌸", "🌷", "💐", "💖", "🌺", "✨", "🦋"],
  },

  // ===== SONS (opcional - caminhos para arquivos de áudio) =====
  sons: {
    jogada: "",        // Ex: "sounds/click.mp3"
    vitoria: "",       // Ex: "sounds/win.mp3"
    derrota: "",       // Ex: "sounds/lose.mp3"
    empate: "",        // Ex: "sounds/draw.mp3"
    tempoAcabou: "",   // Ex: "sounds/timeout.mp3"
    tick: "",          // Ex: "sounds/tick.mp3" (últimos segundos)
  },

  // ===== TELA INICIAL =====
  // Mostrar tela de boas-vindas antes de iniciar o jogo?
  mostrarTelaInicial: true,

  // ===== AUTO RESTART =====
  // Reiniciar automaticamente após X segundos nos overlays (0 = desativado)
  // Ideal para totens sem supervisão
  autoRestartSegundos: 15,

  // ===== IDLE / ATTRACT MODE =====
  // Tempo em segundos sem interação para voltar à tela inicial (0 = desativado)
  // Ideal para totens - volta à tela de boas-vindas se ninguém mexer
  idleTimeoutSegundos: 120,
};
