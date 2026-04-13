import React, { useEffect, useState } from 'react';
import {ActivityIndicator,Alert,ScrollView,Text,TextInput,TouchableOpacity,View,} from 'react-native';
import { auth, firestore } from '../../firebase';
import styles from '../Estilo/styles';
import ComunidadePosts from './ComunidadePosts';

export default function ComunidadeTela() {
  const [carregando, setCarregando] = useState(true);
  const [usuarioAtual, setUsuarioAtual] = useState(null);
  const [posts, setPosts] = useState([]);
  const [mensagemPost, setMensagemPost] = useState('');
  const [publicando, setPublicando] = useState(false);

  useEffect(() => {
    const monitorUsuario = auth.onAuthStateChanged((user) => {
      setUsuarioAtual(user);
    });

    const monitorPosts = firestore
      .collection('ComunidadePosts')
      .orderBy('criadoEm', 'desc')
      .limit(20)
      .onSnapshot(
        (snapshot) => {
          const lista = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setPosts(lista);
          setCarregando(false);
        },
        () => {
          setPosts([]);
          setCarregando(false);
        }
      );

    return () => {
      monitorUsuario();
      monitorPosts();
    };
  }, []);

  const publicarPost = async () => {
    const mensagemLimpa = mensagemPost.trim();

    if (!usuarioAtual) {
      Alert.alert('Comunidade', 'Faca login para publicar um post.');
      return;
    }

    if (!mensagemLimpa) {
      Alert.alert('Comunidade', 'Escreva algo antes de publicar.');
      return;
    }

    setPublicando(true);

    try {
      const autorDoc = await firestore.collection('Usuario').doc(usuarioAtual.uid).get();
      const autorNome = autorDoc.exists ? autorDoc.data()?.nome : usuarioAtual.email;

      await firestore.collection('ComunidadePosts').add({
        autorId: usuarioAtual.uid,
        autorNome: autorNome || usuarioAtual.email || 'Ciclista BikeHub',
        mensagem: mensagemLimpa,
        categoria: 'Post',
        criadoEm: new Date(),
      });

      setMensagemPost('');
    } catch (error) {
      Alert.alert('Comunidade', 'Nao foi possivel publicar o post.');
    } finally {
      setPublicando(false);
    }
  };

  if (carregando) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.comunidadeContainer}>
      <View style={styles.perfilHero}>
        <Text style={styles.perfilNomeDestaque}>Comunidade BikeHub</Text>
        <Text style={styles.perfilEmailDestaque}>
          Seja Bem-Vindo a Comunidade.
        </Text>
      </View>

      <View style={[styles.cardPerfil, styles.comunidadeCardPublicar]}>
        <Text style={styles.perfilSecaoTitulo}>Publicar post</Text>
        <Text style={styles.comunidadeTextoApoio}>
          Compartilhe novidades, percursos e experiencias com outros ciclistas.
        </Text>
        <TextInput
          style={[styles.input, styles.comunidadeInput]}
          placeholder="Compartilhe sua jornada atráves desse postagem..."
          value={mensagemPost}
          onChangeText={setMensagemPost}
          multiline
          textAlignVertical="top"
        />
        <TouchableOpacity style={styles.botao} onPress={publicarPost} disabled={publicando}>
          <Text style={styles.textoBotao}>{publicando ? 'PUBLICANDO...' : 'PUBLICAR POST'}</Text>
        </TouchableOpacity>
      </View>

      <ComunidadePosts posts={posts} />
    </ScrollView>
  );
}
