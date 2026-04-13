import { auth, firestore } from '../../firebase';

export async function atualizarProgressoCiclista(distanciaKm) {
  const usuario = auth.currentUser;

  if (!usuario) {
    return;
  } else if (usuario.email === 'loginadmin@gmail.com') {
    return;
  }

  const usuarioRef = firestore.collection('Usuario').doc(usuario.uid);

  await firestore.runTransaction(async (transaction) => {
    const usuarioDoc = await transaction.get(usuarioRef);
    let quilometragemAtual = 0;

    if (usuarioDoc.exists) {
      quilometragemAtual = Number(usuarioDoc.data()?.quilometragemTotal);

      if (!quilometragemAtual) {
        quilometragemAtual = 0;
      }
    } else {
      quilometragemAtual = 0;
    }

    const novaQuilometragem = quilometragemAtual + distanciaKm;
    const quilometragemFinal = Number(novaQuilometragem.toFixed(2));

    transaction.update(usuarioRef, {
      quilometragemTotal: quilometragemFinal,
    });
  });
}
