import React from 'react';
import { Alert, Text, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import styles from '../Estilo/styles';
import { calcularDistanciaMetros } from './Calculador';

export async function iniciarMonitoramentoPedalada({
  inicioPedaladaRef,
  localizacaoAtual,
  monitoramentoRef,
  iniciarTemporizador,
  setDistanciaKm,
  setErroLocalizacao,
  setLocalizacaoAtual,
  setPedaladaAtiva,
  setPedaladaPausada,
  setTempoSegundos,
  setRotaCoords,
  tempoAcumuladoRef,
}) {
  if (!localizacaoAtual) {
    Alert.alert('Rota', 'Aguardando sua localizacao atual.');
    return null;
  }

  try {
    const posicaoAtual = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
    });

    const latitudeAtual = posicaoAtual.coords.latitude;
    const longitudeAtual = posicaoAtual.coords.longitude;
    const coordenadaInicial = {
      latitude: latitudeAtual,
      longitude: longitudeAtual,
    };

    setLocalizacaoAtual(coordenadaInicial);
    setRotaCoords([coordenadaInicial]);
    setDistanciaKm(0);
    setPedaladaAtiva(true);
    setPedaladaPausada(false);
    setTempoSegundos(0);
    setErroLocalizacao('');
    tempoAcumuladoRef.current = 0;
    inicioPedaladaRef.current = Date.now();
    iniciarTemporizador();

    const monitor = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 4000,
        distanceInterval: 8,
      },
      (novaPosicao) => {
        const novaLatitude = novaPosicao.coords.latitude;
        const novaLongitude = novaPosicao.coords.longitude;
        const novaCoordenada = {
          latitude: novaLatitude,
          longitude: novaLongitude,
        };

        setLocalizacaoAtual(novaCoordenada);
        setRotaCoords((estadoAtual) => {
          const ultimaCoordenada = estadoAtual[estadoAtual.length - 1];

          if (!ultimaCoordenada) {
            return [novaCoordenada];
          } else {
            const distanciaMetros = calcularDistanciaMetros(ultimaCoordenada, novaCoordenada);

            if (distanciaMetros >= 3) {
              setDistanciaKm((valorAtual) => valorAtual + distanciaMetros / 1000);
              return [...estadoAtual, novaCoordenada];
            } else {
              return estadoAtual;
            }
          }
        });
      }
    );

    return monitor;
  } catch (error) {
    setPedaladaAtiva(false);
    setPedaladaPausada(false);
    setErroLocalizacao('Nao conseguimos iniciar a pedalada.');
    Alert.alert('Rota', 'Falha ao iniciar a pedalada.');
    return null;
  }
}

export default function InicarPedalada({ onPress, pedaladaAtiva }) {
  if (pedaladaAtiva) {
    return null;
  } else {
    return (
      <TouchableOpacity
        style={[
          styles.rotaActionButton,
          styles.rotaActionButtonStart,
        ]}
        onPress={onPress}
      >
        <Text style={styles.rotaActionButtonText}>INICIAR PEDALADA</Text>
      </TouchableOpacity>
    );
  }
}
