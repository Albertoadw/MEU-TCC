import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { firestore } from '../../firebase'; 
import styles from '../Estilo/styles';

export default function ListarProduto({ navigation }) {
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    const subscriber = firestore.collection("Produtos")
      .orderBy("criadoEm", "desc")
      .onSnapshot((querySnapshot) => {
        const lista = [];
        querySnapshot.forEach((doc) => {
          lista.push({ ...doc.data(), id: doc.id });
        });
        setProdutos(lista);
      });
    return () => subscriber();
  }, []);

  const confirmarExclusao = (id) => {
    Alert.alert(
      "Excluir",
      "Remover este item do estoque?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Remover", 
          onPress: () => {
            firestore.collection("Produtos").doc(id).delete();
          },
          style: "destructive"
        }
      ]
    );
  };

  return (
    <View style={styles.containerInicio}>
      <Text style={[styles.titulo, { marginTop: 50 }]}>Estoque</Text>
      
      <FlatList
        data={produtos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.imagemProdutoBox}>
              <Image
                source={{ uri: item.foto }}
                style={styles.imagemProdutoCard}
                resizeMode="contain"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.destino}>{item.nome}</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 16, color: '#007AFF', fontWeight: 'bold' }}>
                  R$ {item.preco}
                </Text>
                <Text style={{ fontSize: 13, color: '#FF3B30', fontWeight: 'bold' }}>
                  Qtd: {item.estoque}
                </Text>
              </View>
              
              <View style={{ flexDirection: 'row', marginTop: 10 }}>
                <TouchableOpacity 
                  style={{ backgroundColor: '#E5E5EA', padding: 5, borderRadius: 5, marginRight: 10 }}
                  onPress={() => navigation.navigate('AdicionarProduto', { item })}
                >
                  <Text style={{ color: '#007AFF', fontWeight: 'bold' }}>EDITAR</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={{ backgroundColor: '#FFE5E5', padding: 5, borderRadius: 5 }}
                  onPress={() => confirmarExclusao(item.id)}
                >
                  <Text style={{ color: '#FF3B30', fontWeight: 'bold' }}>EXCLUIR</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />

      <TouchableOpacity 
        style={[styles.botao, { marginBottom: 30 }]} 
        onPress={() => navigation.navigate('Admin')}
      >
        <Text style={styles.textoBotao}>VOLTAR AO PAINEL</Text>
      </TouchableOpacity>
    </View>
  );
}
