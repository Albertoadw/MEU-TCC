import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { firestore } from '../../firebase';
import styles from '../Estilo/styles';
import { useCarrinho } from './Carrinho/CarrinhoItem';

export default function DetalhesProduto({ route, navigation }) {
  const produtoInicial = route.params?.produtoSelecionado || route.params?.produto;
  const { adicionarAoCarrinho } = useCarrinho();
  const [produto, setProduto] = useState(produtoInicial);

  useEffect(() => {
    if (!produtoInicial?.id) {
      return undefined;
    }

    const unsubscribe = firestore
      .collection('Produtos')
      .doc(produtoInicial.id)
      .onSnapshot((doc) => {
        if (doc.exists) {
          setProduto({ ...doc.data(), id: doc.id });
        }
      });

    return () => unsubscribe();
  }, [produtoInicial?.id]);

  const imagemProdutoValida = (foto) => {
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

  const comprarAgora = () => {
    adicionarAoCarrinho(produto);
    navigation.navigate('Carrinho');
  };

  const adicionar = () => {
    adicionarAoCarrinho(produto);
    Alert.alert('Carrinho', 'Produto adicionado ao carrinho.');
  };

  return (
    <ScrollView contentContainerStyle={styles.containerDetalhes}>
      <View style={styles.cardDetalhesImagem}>
        {imagemProdutoValida(produto?.foto) ? (
          <Image
            key={produto.foto}
            source={imagemProdutoValida(produto.foto)}
            style={styles.imagemDetalhes}
            resizeMode="contain"
            fadeDuration={0}
          />
        ) : (
          <ActivityIndicator size="large" color="#007AFF" />
        )}
      </View>

      <View style={styles.cardDetalhes}>
        <Text style={styles.tituloDetalhes}>{produto?.nome}</Text>
        <Text style={styles.precoDetalhes}>R$ {Number(produto?.preco || 0).toFixed(2)}</Text>
        <Text style={styles.textoDetalhes}>Estoque disponivel: {produto?.estoque}</Text>
        <Text style={styles.descricaoDetalhes}>
          AQUI SERÁ MINHA DESCRIÇÃO DO PRODUTO!!
        </Text>

        <TouchableOpacity style={styles.botao} onPress={comprarAgora}>
          <Text style={styles.textoBotao}>COMPRAR AGORA</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoSecundarioProduto} onPress={adicionar}>
          <Text style={styles.textoBotaoSecundario}>ADICIONAR AO CARRINHO</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
