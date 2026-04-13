export function imagemProdutoValida(foto) {
  if (!foto) return null;
  if (typeof foto === 'object' && foto.uri) return foto;
  if (typeof foto !== 'string') return null;

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
}
