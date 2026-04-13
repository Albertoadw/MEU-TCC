export const categoriasLoja = [
  { id: 0, nome: 'Todos', imagem: null },
  { id: 1, nome: 'Bicicletas', imagem: require('../../assets/bike.png') },
  { id: 2, nome: 'Roupas', imagem: require('../../assets/roupas.png') },
  { id: 3, nome: 'Peças', imagem: require('../../assets/pecas.png') },
  { id: 4, nome: 'Acessórios', imagem: require('../../assets/acessorios.png') },
];

export const imagemProdutoValida = (foto) => {
  if (!foto) {
    return null;
  }

  if (typeof foto === 'object' && foto.uri) {
    return foto;
  }

  if (typeof foto !== 'string') {
    return null;
  }

  const fotoTratada = foto.trim();

  if (
    fotoTratada.startsWith('data:image') ||
    fotoTratada.startsWith('file://') ||
    fotoTratada.startsWith('http://') ||
    fotoTratada.startsWith('https://')
  ) {
    return { uri: fotoTratada };
  }

  return { uri: `data:image/jpeg;base64,${fotoTratada}` };
};
