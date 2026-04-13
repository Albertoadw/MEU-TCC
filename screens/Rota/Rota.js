import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Text, View } from 'react-native';
import { auth } from '../../firebase';
import styles from '../Estilo/styles';
import { calcularVelocidadeMedia, formatarTempo } from './Calculador';
import FinalizarPedalada, { finalizarPedalada } from './FinalizarPedalada';
import GPS from './GPS';
import PosCiclista, { REGIAO_PADRAO } from './PosCiclista';
import InicarPedalada, { iniciarMonitoramentoPedalada } from './InicarPedalada';
import PausarRetomar, { pausarPedalada, retomarPedalada } from './PausarRetomar';

export default function Rota() {
  const mapaRef = useRef(null);
  const monitoramentoRef = useRef(null);
  const temporizadorRef = useRef(null);
  const inicioPedaladaRef = useRef(null);
  const tempoAcumuladoRef = useRef(0);
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [pedaladaAtiva, setPedaladaAtiva] = useState(false);
  const [pedaladaPausada, setPedaladaPausada] = useState(false);
  const [rotaCoords, setRotaCoords] = useState([]);
  const [tempoSegundos, setTempoSegundos] = useState(0);
  const [distanciaKm, setDistanciaKm] = useState(0);
  const {
    carregando,
    erroLocalizacao,
    localizacaoAtual,
    setErroLocalizacao,
    setLocalizacaoAtual,
  } = GPS();

  useEffect(() => {
    const monitorUsuario = auth.onAuthStateChanged((user) => {
      setUsuarioLogado(user);
    });

    return monitorUsuario;
  }, []);

  useEffect(() => {
    if (!localizacaoAtual) {
      return;
    } else {
      if (!mapaRef.current) {
        return;
      } else {
        const novaRegiao = {
          latitude: localizacaoAtual.latitude,
          longitude: localizacaoAtual.longitude,
          latitudeDelta: REGIAO_PADRAO.latitudeDelta,
          longitudeDelta: REGIAO_PADRAO.longitudeDelta,
        };

        mapaRef.current.animateToRegion(novaRegiao, 600);
      }
    }
  }, [localizacaoAtual]);

  const pararTemporizador = () => {
    if (temporizadorRef.current) {
      clearInterval(temporizadorRef.current);
      temporizadorRef.current = null;
    }
  };

  const iniciarTemporizador = () => {
    pararTemporizador();

    temporizadorRef.current = setInterval(() => {
      let tempoAtual = tempoAcumuladoRef.current;

      if (inicioPedaladaRef.current) {
        const tempoNovo = Math.floor((Date.now() - inicioPedaladaRef.current) / 1000);
        tempoAtual = tempoAtual + tempoNovo;
      }

      setTempoSegundos(tempoAtual);
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (monitoramentoRef.current) {
        monitoramentoRef.current.remove();
      }

      pararTemporizador();
    };
  }, []);

  const iniciarPedalada = async () => {
    if (!usuarioLogado) {
      Alert.alert('Conta necessaria', 'E necessario criar uma conta para iniciar sua pedalada.');
      return;
    }

    if (monitoramentoRef.current) {
      monitoramentoRef.current.remove();
      monitoramentoRef.current = null;
    }

    monitoramentoRef.current = await iniciarMonitoramentoPedalada({
      inicioPedaladaRef,
      monitoramentoRef,
      iniciarTemporizador,
      localizacaoAtual,
      setDistanciaKm,
      setErroLocalizacao,
      setLocalizacaoAtual,
      setPedaladaAtiva,
      setPedaladaPausada,
      setTempoSegundos,
      setRotaCoords,
      tempoAcumuladoRef,
    });
  };

  const onPausarPedalada = () => {
    pausarPedalada({
      monitoramentoRef,
      inicioPedaladaRef,
      pararTemporizador,
      setPedaladaPausada,
      setTempoSegundos,
      tempoAcumuladoRef,
    });
  };

  const onRetomarPedalada = async () => {
    await retomarPedalada({
      inicioPedaladaRef,
      iniciarTemporizador,
      monitoramentoRef,
      setDistanciaKm,
      setLocalizacaoAtual,
      setPedaladaPausada,
      setRotaCoords,
    });
  };

  const onFinalizarPedalada = async () => {
    await finalizarPedalada({
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
    });
  };

  const velocidadeMedia = calcularVelocidadeMedia(distanciaKm, tempoSegundos);
  const tempoFormatado = formatarTempo(tempoSegundos);

  if (carregando) {
    return (
      <View style={styles.rotaLoadingContainer}>
        <ActivityIndicator size="large" color="#0A6CFF" />
        <Text style={styles.rotaLoadingText}>Carregando mapa e localizacao...</Text>
      </View>
    );
  }

  if (!localizacaoAtual) {
    return (
      <View style={styles.rotaLoadingContainer}>
        <Text style={styles.rotaErrorTitle}>Localizacao indisponivel</Text>
        <Text style={styles.rotaErrorText}>
          {erroLocalizacao || 'Nao foi possivel carregar o mapa com sua posicao atual.'}
        </Text>
      </View>
    );
  } else {
    return (
      <View style={styles.rotaContainer}>
        <PosCiclista
          localizacaoAtual={localizacaoAtual}
          mapaRef={mapaRef}
          pedaladaAtiva={pedaladaAtiva}
          rotaCoords={rotaCoords}
        />

        <View style={styles.rotaTelemetryPanel}>
          <View style={styles.rotaTelemetryRow}>
            <View style={styles.rotaMetricCard}>
              <Text style={styles.rotaMetricLabel}>Distancia</Text>
              <Text style={styles.rotaMetricValue}>{distanciaKm.toFixed(2)}</Text>
              <Text style={styles.rotaMetricUnit}>km</Text>
            </View>

            <View style={styles.rotaMetricCard}>
              <Text style={styles.rotaMetricLabel}>Tempo</Text>
              <Text style={[styles.rotaMetricValue, styles.rotaMetricValueTempo]}>
                {tempoFormatado}
              </Text>
              <Text style={styles.rotaMetricUnit}>h/m/s</Text>
            </View>

            <View style={styles.rotaMetricCard}>
              <Text style={styles.rotaMetricLabel}>Velocidade</Text>
              <Text style={styles.rotaMetricValue}>{velocidadeMedia.toFixed(1)}</Text>
              <Text style={styles.rotaMetricUnit}>km/h</Text>
            </View>
          </View>

          <InicarPedalada onPress={iniciarPedalada} pedaladaAtiva={pedaladaAtiva} />
          <PausarRetomar
            onPausar={onPausarPedalada}
            onRetomar={onRetomarPedalada}
            pedaladaAtiva={pedaladaAtiva}
            pedaladaPausada={pedaladaPausada}
          />
          <FinalizarPedalada
            onPress={onFinalizarPedalada}
            pedaladaAtiva={pedaladaAtiva}
          />
        </View>
      </View>
    );
  }
}