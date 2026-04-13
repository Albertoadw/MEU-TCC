import { useEffect, useState } from 'react';
import * as Location from 'expo-location';

export default function useGPS() {
  const [carregando, setCarregando] = useState(true);
  const [erroLocalizacao, setErroLocalizacao] = useState('');
  const [localizacaoAtual, setLocalizacaoAtual] = useState(null);

  useEffect(() => {
    let ativo = true;

    async function carregarGPS() {
      try {
        const permissao = await Location.requestForegroundPermissionsAsync();

        if (!ativo) {
          return;
        }

        if (permissao.status !== 'granted') {
          setErroLocalizacao('Precisamos da sua localizacao para usar a rota.');
          setCarregando(false);
          return;
        }

        const posicaoAtual = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
        });

        if (!ativo) {
          return;
        }

        const latitudeAtual = posicaoAtual.coords.latitude;
        const longitudeAtual = posicaoAtual.coords.longitude;
        const novaLocalizacao = {
          latitude: latitudeAtual,
          longitude: longitudeAtual,
        };

        setLocalizacaoAtual(novaLocalizacao);
      } catch (error) {
        if (ativo) {
          setErroLocalizacao('Nao foi possivel carregar o GPS do dispositivo.');
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    carregarGPS();

    return () => {
      ativo = false;
    };
  }, []);

  const dadosGPS = {
    carregando: carregando,
    erroLocalizacao: erroLocalizacao,
    localizacaoAtual: localizacaoAtual,
    setErroLocalizacao: setErroLocalizacao,
    setLocalizacaoAtual: setLocalizacaoAtual,
  };

  return dadosGPS;
}
