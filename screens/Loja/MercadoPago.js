export async function criarPagamentoPix(valor, descricao, email) {
  const token = process.env.EXPO_PUBLIC_MP_ACCESS_TOKEN;
  const chave = 'pix-' + Date.now();

  const resposta = await fetch('https://api.mercadopago.com/v1/payments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
      'X-Idempotency-Key': chave,
    },
    body: JSON.stringify({
      transaction_amount: valor,
      description: descricao,
      payment_method_id: 'pix',
      payer: {
        email: email,
      },
    }),
  });

  const dados = await resposta.json();

  if (dados.id) {
    return {
      id: dados.id,
      codigoPix: dados.point_of_interaction.transaction_data.qr_code,
      mensagem: '',
    };
  }

  return {
    id: null,
    codigoPix: '',
    mensagem: dados.message || 'Houve um erro ao gerar o Pix.',
  };
}
