import React from 'react';
import MapView, { Marker, Polyline } from 'react-native-maps';
import styles from '../Estilo/styles';

const REGIAO_PADRAO = {
  latitudeDelta: 0.012,
  longitudeDelta: 0.012,
};

export default function PosCiclista({
  localizacaoAtual,
  mapaRef,
  pedaladaAtiva,
  rotaCoords,
}) {
  const regiaoInicial = {
    latitude: localizacaoAtual.latitude,
    longitude: localizacaoAtual.longitude,
    latitudeDelta: REGIAO_PADRAO.latitudeDelta,
    longitudeDelta: REGIAO_PADRAO.longitudeDelta,
  };

  let linhaRota = null;

  if (rotaCoords.length > 1) {
    linhaRota = (
      <Polyline coordinates={rotaCoords} strokeColor="#0A6CFF" strokeWidth={5} />
    );
  } else {
    linhaRota = null;
  }

  return (
    <MapView
      ref={mapaRef}
      style={styles.rotaMap}
      showsUserLocation
      followsUserLocation={pedaladaAtiva}
      showsCompass={false}
      showsMyLocationButton={false}
      toolbarEnabled={false}
      initialRegion={regiaoInicial}
    >
      <Marker coordinate={localizacaoAtual} title="Voce esta aqui" />
      {linhaRota}
    </MapView>
  );
}

export { REGIAO_PADRAO };