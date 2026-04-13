export function calcularDistanciaMetros(origem, destino) {
  const raioTerra = 6371000;
  const latitudeOrigem = (origem.latitude * Math.PI) / 180;
  const latitudeDestino = (destino.latitude * Math.PI) / 180;
  const diferencaLatitude = ((destino.latitude - origem.latitude) * Math.PI) / 180;
  const diferencaLongitude = ((destino.longitude - origem.longitude) * Math.PI) / 180;

  const a =
    Math.sin(diferencaLatitude / 2) * Math.sin(diferencaLatitude / 2) +
    Math.cos(latitudeOrigem) *
      Math.cos(latitudeDestino) *
      Math.sin(diferencaLongitude / 2) *
      Math.sin(diferencaLongitude / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return raioTerra * c;
}

export function formatarTempo(totalSegundos) {
  const horas = Math.floor(totalSegundos / 3600);
  const minutos = Math.floor((totalSegundos % 3600) / 60);
  const segundos = totalSegundos % 60;
  let horasTexto = '';
  let minutosTexto = '';
  let segundosTexto = '';

  if (horas < 10) {
    horasTexto = '0' + horas;
  } else {
    horasTexto = '' + horas;
  }

  if (minutos < 10) {
    minutosTexto = '0' + minutos;
  } else {
    minutosTexto = '' + minutos;
  }

  if (segundos < 10) {
    segundosTexto = '0' + segundos;
  } else {
    segundosTexto = '' + segundos;
  }

  return horasTexto + ':' + minutosTexto + ':' + segundosTexto;
}

export function calcularVelocidadeMedia(distanciaKm, tempoSegundos) {
  if (tempoSegundos <= 0) {
    return 0;
  } else {
    return distanciaKm / (tempoSegundos / 3600);
  }
}