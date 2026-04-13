import React from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import * as Location from 'expo-location';
import styles from '../Estilo/styles';
import { calcularDistanciaMetros } from './Calculador';

export function pausarPedalada({
  monitoramentoRef,
  inicioPedaladaRef,
  pararTemporizador,
  setPedaladaPausada,
  setTempoSegundos,
  tempoAcumuladoRef,
}) {
  const tempoPedalandoAgora = Math.floor((Date.now() - inicioPedaladaRef.current) / 1000);

  tempoAcumuladoRef.current = tempoAcumuladoRef.current + tempoPedalandoAgora;
  inicioPedaladaRef.current = null;

  if (monitoramentoRef.current) {
    monitoramentoRef.current.remove();
    monitoramentoRef.current = null;
  }

  pararTemporizador();
  setTempoSegundos(tempoAcumuladoRef.current);
  setPedaladaPausada(true);
}

export async function retomarPedalada({
  inicioPedaladaRef,
  iniciarTemporizador,
  monitoramentoRef,
  setDistanciaKm,
  setLocalizacaoAtual,
  setPedaladaPausada,
  setRotaCoords,
}) {
  try {
    const posicaoAtual = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
    });

    const latitudeAtual = posicaoAtual.coords.latitude;
    const longitudeAtual = posicaoAtual.coords.longitude;
    const coordenadaAtual = {
      latitude: latitudeAtual,
      longitude: longitudeAtual,
    };

    setLocalizacaoAtual(coordenadaAtual);
    setRotaCoords((estadoAtual) => {
      const ultimaCoordenada = estadoAtual[estadoAtual.length - 1];

      if (!ultimaCoordenada) {
        return [coordenadaAtual];
      } else {
        const distanciaMetros = calcularDistanciaMetros(ultimaCoordenada, coordenadaAtual);

        if (distanciaMetros >= 3) {
          setDistanciaKm((valorAtual) => valorAtual + distanciaMetros / 1000);
          return [...estadoAtual, coordenadaAtual];
        } else {
          return estadoAtual;
        }
      }
    });

    inicioPedaladaRef.current = Date.now();
    setPedaladaPausada(false);
    iniciarTemporizador();

    monitoramentoRef.current = await Location.watchPositionAsync(
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
  } catch (error) {
    Alert.alert('Rota', 'Nao foi possivel retomar a pedalada.');
  }
}

export default function PausarRetomar({
  onPausar,
  onRetomar,
  pedaladaAtiva,
  pedaladaPausada,
}) {
  let corBotao = '';
  let textoBotao = '';
  let acaoBotao = null;

  if (!pedaladaAtiva) {
    return null;
  } else {
    if (pedaladaPausada) {
      corBotao = '#007AFF';
      textoBotao = 'RETOMAR PEDALADA';
      acaoBotao = onRetomar;
    } else {
      corBotao = '#007AFF';
      textoBotao = 'PAUSAR PEDALADA';
      acaoBotao = onPausar;
    }

    return (
      <View style={{ marginTop: 12 }}>
        <TouchableOpacity
          style={[
            styles.rotaActionButton,
            { backgroundColor: corBotao },
          ]}
          onPress={acaoBotao}
        >
          <Text style={styles.rotaActionButtonText}>{textoBotao}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
