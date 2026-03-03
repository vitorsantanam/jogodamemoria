# 🎀 Jogo da Velha - Dia das Mães

Jogo da velha interativo e personalizável para telas de totem (1080x1920), com tema de Dia das Mães. Perfeito para ações promocionais em supermercados!

---

## 🚀 Como Usar

1. Abra o arquivo `index.html` no navegador
2. Para tela cheia no totem: pressione `F11`

---

## 🎨 Personalização

Toda a personalização é feita em **dois arquivos**:

### 📁 `config.js` — Configurações do Jogo

| Configuração | Descrição |
|---|---|
| `tempoPartida` | Tempo em segundos (padrão: 60) |
| `tempoAlerta` | Timer fica amarelo (padrão: 15s) |
| `tempoCritico` | Timer fica vermelho (padrão: 5s) |
| `jogadorX.nome` | Nome do Jogador 1 |
| `jogadorX.simbolo` | Emoji/texto exibido (ex: ❤️) |
| `jogadorX.imagemMarca` | Imagem no tabuleiro (ex: `"images/coracao.png"`) |
| `jogadorX.imagemAvatar` | Foto do jogador |
| `jogadorO.*` | Mesmas opções para Jogador 2 |
| `textos.*` | Todos os textos do jogo |
| `imagens.banner` | Imagem de destaque no topo |
| `imagens.logo` | Logo do supermercado no rodapé |
| `imagens.vitoria` | Imagem exibida ao ganhar |
| `imagens.tempoEsgotado` | Imagem quando tempo acaba |
| `modoJogo` | `"pvp"` (2 jogadores) ou `"pvc"` (vs computador) |
| `dificuldadePC` | `"facil"`, `"medio"`, `"dificil"` |
| `autoRestartSegundos` | Reinício automático (0 = desativado) |
| `sons.*` | Caminhos para efeitos sonoros |

### 📁 `style.css` — Cores e Visual

As variáveis CSS no topo do arquivo controlam **todas as cores**:

```css
:root {
  --cor-fundo: linear-gradient(...);    /* Fundo da tela */
  --cor-primaria: #e91e63;              /* Cor principal */
  --cor-jogador-x: #e91e63;            /* Cor do Jogador 1 */
  --cor-jogador-o: #9c27b0;            /* Cor do Jogador 2 */
  --cor-celula-bg: rgba(255,...);       /* Fundo das células */
  --fonte-titulo: 'Baloo 2', ...;      /* Fonte dos títulos */
  --tamanho-celula: 175px;             /* Tamanho das casas */
  /* ... e muitas outras! */
}
```

---

## 🖼️ Imagens

Coloque suas imagens na pasta `images/`:

| Arquivo | Uso | Tamanho Sugerido |
|---|---|---|
| `banner.png` | Banner do topo | 800x150px |
| `logo.png` | Logo do rodapé | 300x80px |
| `jogador_x.png` | Avatar jogador 1 | 128x128px |
| `jogador_o.png` | Avatar jogador 2 | 128x128px |
| `vitoria.png` | Tela de vitória | 300x200px |
| `tempo_esgotado.png` | Tempo acabou | 300x200px |

> As imagens são **opcionais**. Se não existirem, emojis serão usados automaticamente.

---

## 🔊 Sons (Opcional)

Crie uma pasta `sounds/` e adicione efeitos sonoros:

```js
sons: {
  jogada: "sounds/click.mp3",
  vitoria: "sounds/win.mp3",
  empate: "sounds/draw.mp3",
  tempoAcabou: "sounds/timeout.mp3",
  tick: "sounds/tick.mp3",
}
```

---

## 📐 Resolução

O jogo foi projetado para **1080x1920 pixels** (tela vertical de totem/kiosk).

Para usar em outras resoluções, ajuste em `style.css`:
```css
html, body {
  width: 1080px;   /* sua largura */
  height: 1920px;  /* sua altura */
}
```

---

## 📂 Estrutura do Projeto

```
jogodamemoria/
├── index.html      ← Página principal
├── style.css       ← Estilos e cores (personalizável)
├── config.js       ← Configurações do jogo (personalizável)
├── script.js       ← Lógica do jogo
├── images/         ← Suas imagens aqui
│   ├── banner.png
│   ├── logo.png
│   ├── jogador_x.png
│   ├── jogador_o.png
│   ├── vitoria.png
│   └── tempo_esgotado.png
└── README.md
```

---

## 💡 Dicas para Supermercado

- Use `modoJogo: "pvc"` para que uma pessoa jogue sozinha contra o computador
- Configure `autoRestartSegundos: 30` para o jogo reiniciar sozinho
- Aumente `tempoPartida` para 90s para partidas mais longas
- Coloque a **logo do supermercado** em `images/logo.png`
- Personalize as **mensagens** com o nome da campanha

---

Feito com 💖 para o Dia das Mães!