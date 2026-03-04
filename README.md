# 🎀 Jogo da Memória – Dia das Mulheres

Jogo da memória interativo para telas mobile/totem (proporção 9:16).
Single-player com timer — ideal para ações promocionais em supermercado!

## 🚀 Como Usar

1. Abra `index.html` no navegador
2. Funciona perfeitamente em qualquer tela (mobile, desktop, totem)

## 🎨 Personalização

Edite o arquivo **`config.js`**:

| Config | O que faz |
|---|---|
| `tempoPartida` | Timer em segundos (padrão: 60) |
| `cartas[].imagem` | Caminho da imagem de cada par |
| `textos.*` | Todos os textos editáveis |
| `imagens.banner` | Banner do topo |
| `imagens.logo` | Logo do rodapé |
| `autoRestartSegundos` | Auto-restart nos overlays |

## 🖼️ Imagens

Coloque na pasta `images/`:

| Arquivo | Uso |
|---|---|
| `banner.png` | Banner topo (Dia das Mulheres) |
| `logo.png` | Logo rodapé (supermercado) |
| `carta1.png` … `carta6.png` | As 6 imagens dos pares |
| `vitoria.png` | Tela de vitória |
| `tempo_esgotado.png` | Tela de timeout |

## 📂 Estrutura

```
jogodamemoria/
├── index.html
├── style.css
├── config.js
├── script.js
├── images/
│   ├── banner.png
│   ├── logo.png
│   ├── carta1.png … carta6.png
│   ├── vitoria.png
│   └── tempo_esgotado.png
└── README.md
```
