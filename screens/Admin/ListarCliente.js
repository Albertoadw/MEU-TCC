import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { firestore } from '../../firebase'; 
import styles from '../Estilo/styles';

export default function ListarCliente({ navigation }) {
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    const subscriber = firestore.collection("Usuario").onSnapshot((querySnapshot) => {
      const lista = [];
      querySnapshot.forEach((doc) => {
        lista.push({ ...doc.data(), id: doc.id });
      });
      setClientes(lista);
    });
    return () => subscriber();
  }, []);

  const confirmarExclusao = (id) => {
    Alert.alert(
      "Excluir Cliente",
      "Deseja realmente remover este ciclista da comunidade?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Excluir", 
          onPress: () => {
            firestore.collection("Usuario").doc(id).delete();
            Alert.alert("Sucesso", "Perfil removido com sucesso.");
          },
          style: "destructive"
        }
      ]
    );
  };

  return (
    <View style={styles.containerInicio}>
      <Text style={[styles.titulo, { marginTop: 50 }]}>Ciclistas Cadastrados</Text>
      <Text style={[styles.subtitulo, { marginBottom: 20 }]}>Pressione e segure para remover um perfil</Text>

      <FlatList
        data={clientes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card} 
            onLongPress={() => confirmarExclusao(item.id)}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.destino}>{item.nome}</Text>
              <Text style={{ color: '#007AFF', fontSize: 14, fontWeight: '500' }}>{item.email}</Text>
              <Text style={{ color: '#8E8E93', marginTop: 4, fontSize: 13 }}>
                Contato: {item.telefone}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', color: '#8E8E93', marginTop: 50 }}>
            Nenhum ciclista encontrado no banco de dados.
          </Text>
        }
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