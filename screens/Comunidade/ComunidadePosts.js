import React from 'react';
import { Text, View } from 'react-native';
import styles from '../Estilo/styles';

function formatarDataComunidade(valor) {
  if (!valor) {
    return 'Agora';
  }

  if (typeof valor?.toDate === 'function') {
    return valor.toDate().toLocaleDateString('pt-BR');
  }

  if (valor instanceof Date) {
    return valor.toLocaleDateString('pt-BR');
  }

  const data = new Date(valor);

  if (Number.isNaN(data.getTime())) {
    return 'Agora';
  }

  return data.toLocaleDateString('pt-BR');
}

export default function ComunidadePosts({ posts }) {
  return (
    <View style={[styles.cardPerfil, styles.comunidadeCardPosts]}>
      <Text style={styles.perfilSecaoTitulo}>Posts da comunidade</Text>

      {posts.length === 0 ? (
        <View style={styles.comunidadeEstadoVazio}>
          <Text style={styles.comunidadeEstadoVazioTitulo}>Nenhum post ainda</Text>
          <Text style={styles.comunidadeEstadoVazioTexto}>
            Ainda nao ha posts. Seja o primeiro a publicar uma novidade.
          </Text>
        </View>
      ) : (
        posts.map((post) => (
          <View key={post.id} style={styles.comunidadeBloco}>
            <Text style={styles.comunidadeTitulo}>{post.autorNome || 'Ciclista BikeHub'}</Text>
            <Text style={styles.infoTexto}>{post.mensagem}</Text>
            <Text style={styles.comunidadeMeta}>
              {post.categoria || 'Post'} • {formatarDataComunidade(post.criadoEm)}
            </Text>
          </View>
        ))
      )}
    </View>
  );
}
