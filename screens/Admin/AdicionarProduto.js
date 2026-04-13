import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker'; 
import * as ImagePicker from 'expo-image-picker';
// AJUSTE CRÍTICO: Importando do caminho 'legacy' como o Expo 54 exige
import * as FileSystem from 'expo-file-system/legacy'; 
import { firestore } from '../../firebase'; 
import styles from '../Estilo/styles';

export default function AdicionarProduto({ navigation, route }) {
  const itemParaEditar = route.params?.item;

  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [estoque, setEstoque] = useState('');
  const [categoria, setCategoria] = useState('Bicicletas');
  const [foto, setFoto] = useState(null);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (itemParaEditar) {
      setNome(itemParaEditar.nome);
      setPreco(itemParaEditar.preco.toString());
      setEstoque(itemParaEditar.estoque.toString());
      setCategoria(itemParaEditar.categoria);
      setFoto(itemParaEditar.foto);
    }
  }, [itemParaEditar]);

  const escolherFoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 0.2, 
    });

    if (!result.canceled) {
      setFoto(result.assets[0].uri);
    }
  };

  const salvar = async () => {
    if (!nome || !preco || !foto || !estoque) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    setCarregando(true);

    try {
      let fotoFinal = foto;

      if (foto.startsWith('file://')) {
        // Agora o FileSystem não será mais undefined
        const base64 = await FileSystem.readAsStringAsync(foto, {
          encoding: 'base64',
        });
        fotoFinal = `data:image/jpeg;base64,${base64}`;
      }

      const dados = {
        nome,
        preco: parseFloat(preco.replace(',', '.')),
        estoque: parseInt(estoque),
        categoria,
        foto: fotoFinal,
        atualizadoEm: new Date().getTime()
      };

      if (itemParaEditar?.id) {
        await firestore.collection("Produtos").doc(itemParaEditar.id).update(dados);
        Alert.alert('Sucesso', 'Produto atualizado!');
      } else {
        await firestore.collection("Produtos").add({
          ...dados,
          criadoEm: new Date().getTime()
        });
        Alert.alert('Sucesso', 'Produto cadastrado!');
      }

      navigation.navigate('ListarProduto');

    } catch (error) {
      Alert.alert("Erro no Sistema", error.message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>{itemParaEditar ? "Editar Produto" : "Novo Produto"}</Text>
      
      <TextInput style={styles.input} placeholder="Nome" value={nome} onChangeText={setNome} />
      <TextInput style={styles.input} placeholder="Preço" value={preco} onChangeText={setPreco} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Estoque" value={estoque} onChangeText={setEstoque} keyboardType="numeric" />

      <View style={styles.input}>
        <Picker selectedValue={categoria} onValueChange={(v) => setCategoria(v)}>
          <Picker.Item label="Bicicletas" value="Bicicletas" />
          <Picker.Item label="Roupas" value="Roupas" />
          <Picker.Item label="Peças" value="Peças" />
          <Picker.Item label="Acessórios" value="Acessórios" />
        </Picker>
      </View>

      <TouchableOpacity style={styles.areaUpload} onPress={escolherFoto}>
        {foto ? (
          <Image source={{ uri: foto }} style={styles.imagemPreview} />
        ) : (
          <Text style={styles.textoUpload}>Selecionar Foto</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.botao, { backgroundColor: carregando ? '#CCC' : '#001f3f' }]} 
        onPress={salvar} 
        disabled={carregando}
      >
        {carregando ? <ActivityIndicator color="#FFF" /> : <Text style={styles.textoBotao}>SALVAR PRODUTO</Text>}
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.buttonSecondary} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Cancelar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
