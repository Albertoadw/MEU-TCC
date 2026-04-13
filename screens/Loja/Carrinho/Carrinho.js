import React, { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import styles from '../../Estilo/styles';
import { useCarrinho } from './CarrinhoItem';
import { auth } from '../../../firebase';
import { criarPagamentoPix } from '../MercadoPago';
import Pix, { ResumoCarrinho } from './Pix';
import { imagemProdutoValida } from './imagemProduto';

export default function Carrinho() {
  const { itensCarrinho, totalCarrinho, alterarQuantidade, removerDoCarrinho, limparCarrinho } = useCarrinho();
  const [carregandoPagamento, setCarregandoPagamento] = useState(false);
  const [modalPixVisivel, setModalPixVisivel] = useState(false);
  const [codigoPix, setCodigoPix] = useState('');
  const [pixCopiado, setPixCopiado] = useState(false);

  useEffect(() => {
    if (!modalPixVisivel) setPixCopiado(false);
  }, [modalPixVisivel]);

  const finalizarCompra = async () => {
    if (!itensCarrinho.length) {
      Alert.alert('Carrinho vazio', 'Adicione um produto antes de finalizar a compra.');
      return;
    }
    const emailPagador = auth.currentUser?.email?.trim();
    if (!emailPagador) {
      Alert.alert('E-mail indisponivel', 'Faca login para gerar o Pix com o e-mail do pagador.');
      return;
    }
    setCarregandoPagamento(true);
    setPixCopiado(false);
    const respostaPagamento = await criarPagamentoPix(totalCarrinho, 'Equipamento BikeHub', emailPagador);
    if (respostaPagamento && respostaPagamento.id) {
      setCodigoPix(respostaPagamento.codigoPix);
      setModalPixVisivel(true);
      limparCarrinho();
    } else {
      Alert.alert('Erro', respostaPagamento.mensagem || 'Houve um erro ao gerar o Pix.');
    }
    setCarregandoPagamento(false);
  };

  const copiarCodigoPix = async () => {
    if (!codigoPix) return;
    await Clipboard.setStringAsync(codigoPix);
    setPixCopiado(true);
  };

  const renderItemCarrinho = (item) => {
    const imagem = imagemProdutoValida(item.foto);

    return (
      <View key={item.id} style={styles.cardCarrinho}>
        <View style={styles.imagemProdutoCarrinhoBox}>
          {imagem ? (
            <Image
              key={item.foto}
              source={imagem}
              style={styles.imagemProdutoCarrinho}
              resizeMode="contain"
              fadeDuration={0}
            />
          ) : null}
        </View>

        <View style={styles.infoCarrinho}>
          <Text style={styles.destino}>{item.nome}</Text>
          <Text style={styles.precoProduto}>R$ {Number(item.preco).toFixed(2)}</Text>
          <Text style={styles.textoEstoque}>Categoria: {item.categoria}</Text>

          <View style={styles.linhaQuantidade}>
            <TouchableOpacity style={styles.botaoQuantidade} onPress={() => alterarQuantidade(item.id, -1)}>
              <Text style={styles.textoBotaoQuantidade}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantidadeTexto}>{item.quantidade}</Text>
            <TouchableOpacity style={styles.botaoQuantidade} onPress={() => alterarQuantidade(item.id, 1)}>
              <Text style={styles.textoBotaoQuantidade}>+</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => removerDoCarrinho(item.id)}>
            <Text style={styles.linkRemover}>Remover</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.containerCarrinho}>
        <Text style={styles.titulo}>Meu Carrinho</Text>
        {itensCarrinho.length === 0 ? (
          <View style={styles.cardCarrinhoVazio}>
            <Text style={styles.subtitulo}>Seu carrinho ainda esta vazio.</Text>
          </View>
        ) : (
          <>
            {itensCarrinho.map(renderItemCarrinho)}

            <ResumoCarrinho
              totalCarrinho={totalCarrinho}
              emailPagador={auth.currentUser?.email}
              carregandoPagamento={carregandoPagamento}
              onFinalizar={finalizarCompra}
            />
          </>
        )}
      </ScrollView>
      <Pix
        visible={modalPixVisivel}
        codigoPix={codigoPix}
        pixCopiado={pixCopiado}
        onClose={() => setModalPixVisivel(false)}
        onCopy={copiarCodigoPix}
      />
    </>
  );
}
