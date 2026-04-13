import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { auth } from '../../firebase'; 
import styles from '../Estilo/styles'; 

export default function Admin({ navigation }) {
  const sairDaConta = () => {
    Alert.alert("Sair", "Encerrar sessão administrativa?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sair", onPress: () => auth.signOut() }
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Painel Admin</Text>
      <Text style={styles.subtitulo}>Gerenciamento BikeHub 360</Text>

      <View style={styles.cardPerfil}>
        <Text style={styles.labelInfo}>GERENCIAR PRODUTOS</Text>
        <TouchableOpacity style={styles.botao} onPress={() => navigation.navigate('AdicionarProduto')}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialIcons name="add-shopping-cart" size={22} color="#fff" style={{ marginRight: 10 }} />
            <Text style={styles.textoBotao}>Novo Produto</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.botao, { marginTop: 15 }]} onPress={() => navigation.navigate('ListarProduto')}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialIcons name="inventory" size={22} color="#fff" style={{ marginRight: 10 }} />
            <Text style={styles.textoBotao}>Ver Estoque</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.cardPerfil}>
        <Text style={styles.labelInfo}>GERENCIAR CLIENTES</Text>
        <TouchableOpacity style={styles.botao} onPress={() => navigation.navigate('ListarCliente')}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="people-outline" size={22} color="#fff" style={{ marginRight: 10 }} />
            <Text style={styles.textoBotao}>Lista de Clientes</Text>
          </View>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.buttonSecondary} onPress={() => navigation.navigate('MainTabs')}>
        <Text style={styles.buttonText}>Voltar para a Loja</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonSecondary} onPress={sairDaConta}>
        <Text style={[styles.buttonText, { color: '#FF3B30' }]}>Sair do Painel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}