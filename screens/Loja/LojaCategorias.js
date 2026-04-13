import React from 'react';
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../Estilo/styles';
import { categoriasLoja } from './LojaImagem';

export default function LojaCategorias({ categoriaAtiva, onSelecionarCategoria }) {
  return (
    <>
      <View style={{ paddingHorizontal: 20 }}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#007AFF" style={{ marginRight: 10 }} />
          <TextInput placeholder="O que procura?" style={{ flex: 1 }} />
        </View>
      </View>

      <View style={styles.conteudoLoja}>
        <Text style={styles.tituloSecao}>Categorias</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollCategorias}>
        {categoriasLoja.map((categoria) => (
          <TouchableOpacity
            key={categoria.id}
            style={styles.itemCategoria}
            onPress={() => onSelecionarCategoria(categoria.nome)}
          >
            <View
              style={[
                styles.boxImagemCategoria,
                categoriaAtiva === categoria.nome && { borderColor: '#007AFF', borderWidth: 2 },
              ]}
            >
              {categoria.nome === 'Todos' ? (
                <Ionicons name="grid-outline" size={30} color="#007AFF" />
              ) : (
                <Image source={categoria.imagem} style={styles.imagemCategoria} />
              )}
            </View>

            <Text
              style={[
                styles.textoCategoria,
                categoriaAtiva === categoria.nome && { color: '#007AFF', fontWeight: 'bold' },
              ]}
            >
              {categoria.nome}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.conteudoLoja}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={styles.tituloSecao}>{categoriaAtiva}</Text>
          {categoriaAtiva !== 'Todos' && (
            <TouchableOpacity onPress={() => onSelecionarCategoria('Todos')}>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </>
  );
}
