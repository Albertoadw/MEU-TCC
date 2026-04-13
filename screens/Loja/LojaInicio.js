import React, { useState, useEffect } from 'react';
import { Alert, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth, firestore } from '../../firebase';
import styles from '../Estilo/styles';
import { useCarrinho } from './Carrinho/CarrinhoItem';
import LojaCategorias from './LojaCategorias';
import LojaProduto from './LojaProduto';

export default function LojaInicio({ navigation }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [produtos, setProdutos] = useState([]);
  const [categoriaAtiva, setCategoriaAtiva] = useState('Todos');
  const { adicionarAoCarrinho, totalItens } = useCarrinho();

  useEffect(() => {
    const monitorAuth = auth.onAuthStateChanged((user) => {
      if (user && user.email === 'loginadmin@gmail.com') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    });

    const monitorProdutos = firestore.collection('Produtos')
      .orderBy('criadoEm', 'desc')
      .onSnapshot((querySnapshot) => {
        const lista = [];
        querySnapshot.forEach((doc) => {
          lista.push({ ...doc.data(), id: doc.id });
        });
        setProdutos(lista);
      });

    return () => {
      monitorAuth();
      monitorProdutos();
    };
  }, []);

  const produtosFiltrados = categoriaAtiva === 'Todos'
    ? produtos
    : produtos.filter((p) => p.categoria === categoriaAtiva);

  const abrirDetalhes = (produto) => {
    navigation.navigate('DetalhesProduto', { produtoSelecionado: { ...produto } });
  };

  const exibirAvisoConta = (acao) => {
    const mensagem =
      acao === 'comprar'
        ? 'E necessario criar uma conta para comprar produtos.'
        : 'E necessario criar uma conta para adicionar produtos ao carrinho.';

    Alert.alert('Conta necessaria', mensagem);
  };

  const adicionarProduto = (produto) => {
    if (!auth.currentUser) {
      exibirAvisoConta('adicionar');
      return;
    }

    adicionarAoCarrinho(produto);
    Alert.alert('Carrinho', 'Produto adicionado ao carrinho.');
  };

  const comprarProduto = (produto) => {
    if (!auth.currentUser) {
      exibirAvisoConta('comprar');
      return;
    }

    adicionarAoCarrinho(produto);
    navigation.navigate('Carrinho');
  };

  const renderProduto = ({ item }) => (
    <LojaProduto
      produto={item}
      onAbrirDetalhes={abrirDetalhes}
      onAdicionarAoCarrinho={adicionarProduto}
      onComprar={comprarProduto}
    />
  );

  const cabecalhoLoja = (
    <LojaCategorias
      categoriaAtiva={categoriaAtiva}
      onSelecionarCategoria={setCategoriaAtiva}
    />
  );

  return (
    <View style={styles.containerInicio}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>BikeHub 360°</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.navigate('Carrinho')} style={{ marginRight: 15 }}>
            <Ionicons name="bag-handle-outline" size={32} color="#007AFF" />
            {totalItens > 0 && (
              <View style={styles.badgeCarrinho}>
                <Text style={styles.badgeCarrinhoTexto}>{totalItens}</Text>
              </View>
            )}
          </TouchableOpacity>
          {isAdmin && (
            <TouchableOpacity onPress={() => navigation.navigate('Admin')} style={{ marginRight: 15 }}>
              <Ionicons name="shield-checkmark-outline" size={32} color="#007AFF" />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => navigation.navigate('Perfil')}>
            <Ionicons name="person-circle-outline" size={42} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={produtosFiltrados}
        keyExtractor={(item) => item.id}
        renderItem={renderProduto}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={false}
        columnWrapperStyle={styles.linhaGradeProdutos}
        contentContainerStyle={styles.listaProdutos}
        ListHeaderComponent={cabecalhoLoja}
        ListEmptyComponent={
          <View style={styles.semProdutos}>
            <Text style={{ color: '#8E8E93', marginTop: 10 }}>Nenhum item em {categoriaAtiva}.</Text>
          </View>
        }
      />
    </View>
  );
}
