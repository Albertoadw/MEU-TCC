export async function cadastrarPerfil({ auth, firestore, nome, email, telefone, senha }) {
  const res = await auth.createUserWithEmailAndPassword(email, senha);

  await firestore.collection('Usuario').doc(res.user.uid).set({
    nome,
    email,
    telefone,
    id: res.user.uid,
    tipo: 'ciclista',
    quilometragemTotal: 0,
  });

  return res;
}
