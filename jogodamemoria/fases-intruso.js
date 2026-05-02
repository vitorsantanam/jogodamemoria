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
    { nome: 'Banana', imagem: 'imagens/maca.jpg', intruso: false },
    { nome: 'Maçã', imagem: 'imagens/maca.jpg', intruso: false },
    { nome: 'Pera', imagem: 'imagens/maca.jpg', intruso: false },
    { nome: 'Chave', imagem: 'imagens/carro.jpg', intruso: true }
  ],
  [
    { nome: 'Cadeira', imagem: 'imagens/maca.jpg', intruso: false },
    { nome: 'Mesa', imagem: 'imagens/maca.jpg', intruso: false },
    { nome: 'Sofá', imagem: 'imagens/maca.jpg', intruso: false },
    { nome: 'Bola', imagem: 'imagens/carro.png', intruso: true }
  ],
  [
    { nome: 'Copo', imagem: 'imagens/maca.jpg', intruso: false },
    { nome: 'Prato', imagem: 'imagens/maca.jpg', intruso: false },
    { nome: 'Garfo', imagem: 'imagens/maca.jpg', intruso: false },
    { nome: 'Sapato', imagem: 'imagens/carro.jpg', intruso: true }
  ],
  [
    { nome: 'Carro', imagem: 'imagens/maca.jpg', intruso: false },
    { nome: 'Moto', imagem: 'imagens/maca.jpg', intruso: false },
    { nome: 'Bicicleta', imagem: 'imagens/maca.jpg', intruso: false },
    { nome: 'Livro', imagem: 'imagens/carro.jpg', intruso: true }
  ]
];

// Exporta para uso no script principal
if (typeof module !== 'undefined') {
  module.exports = fasesIntruso;
}
