import React from 'react';
import { Text, View } from 'react-native';
import styles from '../Estilo/styles';

export default function IdPerfil({ idCiclista, variante = 'badge' }) {
  if (!idCiclista) {
    return null;
  }

  if (variante === 'info') {
    return (
      <View style={styles.blocoInfo}>
        <Text style={styles.labelInfo}>ID DO CICLISTA:</Text>
        <Text style={styles.infoTexto}>{idCiclista}</Text>
      </View>
    );
  }

  return (
    <View style={styles.perfilBadgeId}>
      <Text style={styles.perfilBadgeIdTexto}>ID: {idCiclista}</Text>
    </View>
  );
}
