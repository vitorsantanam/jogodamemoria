// Lista de fases do Jogo do Intruso
// Cada fase contém 4 produtos, sendo um deles o intruso
// Exemplo de estrutura:
// [
//   { nome: 'Banana', imagem: 'imagens/banana.png', intruso: false },
//   { nome: 'Maçã', imagem: 'imagens/maca.png', intruso: false },
//   { nome: 'Pera', imagem: 'imagens/pera.png', intruso: false },
//   { nome: 'Chave', imagem: 'imagens/chave.png', intruso: true }
// ]

const fasesIntruso = [
  [
    { nome: '', imagem: 'imagens/maca.jpg', intruso: false },
    { nome: '', imagem: 'imagens/maca.jpg', intruso: false },
    { nome: '', imagem: 'imagens/maca.jpg', intruso: false },
    { nome: '', imagem: 'imagens/carro.jpg', intruso: true }
  ],
  [
    { nome: '', imagem: 'imagens/maca.jpg', intruso: false },
    { nome: '', imagem: 'imagens/maca.jpg', intruso: false },
    { nome: '', imagem: 'imagens/maca.jpg', intruso: false },
    { nome: '', imagem: 'imagens/carro.jpg', intruso: true }
  ],
  [
    { nome: '', imagem: 'imagens/maca.jpg', intruso: false },
    { nome: '', imagem: 'imagens/maca.jpg', intruso: false },
    { nome: '', imagem: 'imagens/maca.jpg', intruso: false },
    { nome: '', imagem: 'imagens/carro.jpg', intruso: true }
  ],
  [
    { nome: '', imagem: 'imagens/maca.jpg', intruso: false },
    { nome: '', imagem: 'imagens/maca.jpg', intruso: false },
    { nome: '', imagem: 'imagens/maca.jpg', intruso: false },
    { nome: '', imagem: 'imagens/carro.jpg', intruso: true }
  ]
];

// Exporta para uso no script principal
if (typeof module !== 'undefined') {
  module.exports = fasesIntruso;
}
// Torna global para browser
window.fasesIntruso = fasesIntruso;
