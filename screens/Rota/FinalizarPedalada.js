import React from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { auth, firestore } from '../../firebase';
import styles from '../Estilo/styles';
import { calcularVelocidadeMedia, formatarTempo } from './Calculador';
import { atualizarProgressoCiclista } from './ProgressoCiclista';

export async function finalizarPedalada({
  distanciaKm,
  inicioPedaladaRef,
  localizacaoAtual,
  monitoramentoRef,
  pararTemporizador,
  rotaCoords,
  setPedaladaAtiva,
  setPedaladaPausada,
  setTempoSegundos,
  tempoAcumuladoRef,
}) {
  if (monitoramentoRef.current) {
    monitoramentoRef.current.remove();
    monitoramentoRef.current = null;
  }

  let tempoFinalSegundos = tempoAcumuladoRef.current;

  if (inicioPedaladaRef.current) {
    tempoFinalSegundos = tempoFinalSegundos + Math.floor((Date.now() - inicioPedaladaRef.current) / 1000);
  }

  inicioPedaladaRef.current = null;
  tempoAcumuladoRef.current = 0;
  pararTemporizador();
  setTempoSegundos(tempoFinalSegundos);
  setPedaladaAtiva(false);
  setPedaladaPausada(false);

  const distanciaFinal = Number(distanciaKm.toFixed(2));
  const velocidadeCalculada = calcularVelocidadeMedia(distanciaKm, tempoFinalSegundos);
  const velocidadeMedia = Number(velocidadeCalculada.toFixed(1));

  try {
    const usuario = auth.currentUser;

    if (usuario) {
      if (usuario.email !== 'loginadmin@gmail.com') {
        await firestore.collection('Usuario').doc(usuario.uid).collection('Rotas').add({
          distanciaKm: distanciaFinal,
          duracaoSegundos: tempoFinalSegundos,
          velocidadeMediaKmh: velocidadeMedia,
          criadoEm: new Date(),
          coordenadas: rotaCoords,
          fim: localizacaoAtual,
        });

        await atualizarProgressoCiclista(distanciaFinal);
      }
    }

    const mensagemFinal =
      'Voce percorreu ' +
      distanciaFinal +
      ' km em ' +
      formatarTempo(tempoFinalSegundos) +
      '.';

    Alert.alert('Pedalada finalizada', mensagemFinal);
  } catch (error) {
    Alert.alert('Rota', 'Finalizamos a pedalada, mas nao foi possivel salvar os dados.');
  }
}

export default function FinalizarPedalada({ onPress, pedaladaAtiva }) {
  if (pedaladaAtiva) {
    return (
      <View style={{ marginTop: 12 }}>
        <TouchableOpacity
          style={[styles.rotaActionButton, styles.rotaActionButtonStop]}
          onPress={onPress}
        >
          <Text style={styles.rotaActionButtonText}>FINALIZAR PEDALADA</Text>
        </TouchableOpacity>
      </View>
    );
  } else {
    return null;
  }
}
