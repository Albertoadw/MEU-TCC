import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import styles from '../Estilo/styles';
import { imagemProdutoValida } from './LojaImagem';

export default function LojaProduto({
  produto,
  onAbrirDetalhes,
  onAdicionarAoCarrinho,
  onComprar,
}) {
  const imagemProduto = imagemProdutoValida(produto.foto);

  return (
    <View style={styles.cardProdutoLoja}>
      <TouchableOpacity activeOpacity={0.9} onPress={() => onAbrirDetalhes(produto)}>
        <View style={styles.imagemProdutoGridBox}>
          {imagemProduto ? (
            <Image
              key={produto.foto}
              source={imagemProduto}
              style={styles.imagemProdutoGrid}
              resizeMode="contain"
              fadeDuration={0}
            />
          ) : null}
        </View>

        <View style={styles.infoProdutoGrid}>
          <Text style={styles.nomeProdutoGrid} numberOfLines={2}>{produto.nome}</Text>
          <Text style={styles.precoProduto}>R$ {Number(produto.preco).toFixed(2)}</Text>
          <Text style={styles.textoEstoque}>Estoque: {produto.estoque}</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.linhaAcoesProduto}>
        <TouchableOpacity
          style={styles.botaoPequenoSecundario}
          onPress={() => onAdicionarAoCarrinho(produto)}
        >
          <Text
            style={styles.textoBotaoPequenoSecundario}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            Carrinho
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoPequenoPrimario}
          onPress={() => onComprar(produto)}
        >
          <Text
            style={styles.textoBotaoPequenoPrimario}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            Comprar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
