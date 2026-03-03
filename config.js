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
  // Segundos restantes para alerta vermelho
  tempoCritico: 5,

  // ===== JOGADORES =====
  jogadorX: {
    nome: "Jogador 1",
    // Símbolo exibido no tabuleiro (HTML/emoji)
    // Se imagemMarca estiver definida, a imagem será usada no lugar
    simbolo: "❤️",
    // Caminho para imagem da marca no tabuleiro (opcional)
    // Ex: "images/coracao.png"
    imagemMarca: "",
    // Caminho para imagem do avatar do jogador (opcional)
    // Ex: "images/jogador_x.png"
    imagemAvatar: "",
  },

  jogadorO: {
    nome: "Jogador 2",
    simbolo: "🌸",
    imagemMarca: "",
    imagemAvatar: "",
  },

  // ===== TEXTOS PERSONALIZÁVEIS =====
  textos: {
    titulo: "Feliz Dia das Mães!",
    subtitulo: "Jogue e divirta-se! 💐",
    rodape: "Com carinho para as melhores mães! 💖",

    // Mensagens de vitória
    vitoriaTitulo: "Parabéns! 🎉",
    vitoriaMsg: "{jogador} venceu! Que incrível!",

    // Mensagens de empate  
    empateTitulo: "Empate! 🤝",
    empateMsg: "Vocês jogaram muito bem! Tentem novamente! 😊",

    // Mensagens de tempo esgotado
    tempoTitulo: "Que pena, o tempo acabou! ⏰",
    tempoMsg: "Mas não fique triste! 😊\nTente novamente e mostre que você é craque!",
  },

  // ===== IMAGENS (caminhos relativos) =====
  imagens: {
    // Banner no topo (ex: arte do dia das mães)
    banner: "images/banner.png",
    // Logo no rodapé (ex: logo do supermercado)
    logo: "images/logo.png",
    // Imagem exibida na tela de vitória
    vitoria: "images/vitoria.png",
    // Imagem exibida quando o tempo acaba
    tempoEsgotado: "images/tempo_esgotado.png",
  },

  // ===== PARTÍCULAS DECORATIVAS =====
  particulas: {
    ativas: true,
    quantidade: 20,
    // Emojis que flutuam no fundo
    emojis: ["❤️", "🌸", "🌷", "💐", "💖", "🌺", "✨", "🦋"],
  },

  // ===== SONS (opcional - caminhos) =====
  sons: {
    jogada: "",       // Ex: "sounds/click.mp3"
    vitoria: "",      // Ex: "sounds/win.mp3"
    empate: "",       // Ex: "sounds/draw.mp3"
    tempoAcabou: "",  // Ex: "sounds/timeout.mp3"
    tick: "",         // Ex: "sounds/tick.mp3"  (últimos segundos)
  },

  // ===== MODO DE JOGO =====
  // "pvp" = jogador vs jogador
  // "pvc" = jogador vs computador
  modoJogo: "pvp",

  // Dificuldade do computador (se modoJogo = "pvc")
  // "facil", "medio", "dificil"
  dificuldadePC: "medio",

  // ===== AUTO RESTART =====
  // Reiniciar automaticamente após X segundos (0 = desativado)
  autoRestartSegundos: 0,
};
