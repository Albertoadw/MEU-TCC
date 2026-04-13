import React from 'react';
import { ActivityIndicator, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import styles from '../../Estilo/styles';

export function ResumoCarrinho({ totalCarrinho, emailPagador, carregandoPagamento, onFinalizar }) {
  return (
    <View style={styles.resumoCarrinho}>
      <Text style={styles.totalCarrinho}>Total: R$ {totalCarrinho.toFixed(2)}</Text>
      <Text style={styles.textoEstoque}>Pagador: {emailPagador || 'usuario nao identificado'}</Text>
      <TouchableOpacity
        style={[styles.botao, carregandoPagamento && styles.botaoDesabilitado]}
        onPress={onFinalizar}
        disabled={carregandoPagamento}
      >
        {carregandoPagamento ? (
          <View style={styles.linhaCarregando}>
            <ActivityIndicator color="#FFFFFF" />
            <Text style={styles.textoBotao}>GERANDO PIX...</Text>
          </View>
        ) : (
          <Text style={styles.textoBotao}>FINALIZAR COMPRA</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

export default function Pix({ visible, codigoPix, pixCopiado, onClose, onCopy }) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.pixModalOverlay}>
        <View style={styles.pixModalCard}>
          <Text style={styles.pixModalTag}>PIX GERADO</Text>
          <Text style={styles.pixModalTitulo}>Pagamento pronto para copiar</Text>
          <Text style={styles.pixModalTexto}>
            Escaneie o QR Code abaixo ou use o codigo Pix Copia e Cola no aplicativo do seu banco.
          </Text>
          <View style={styles.pixQrContainer}>
            <QRCode value={codigoPix || ' '} size={210} />
          </View>
          <TextInput
            style={styles.pixCodigoInput}
            value={codigoPix}
            editable={false}
            multiline
            textAlignVertical="top"
          />
          <TouchableOpacity style={styles.radarBotao} onPress={onCopy}>
            <Text style={styles.radarBotaoTexto}>
              {pixCopiado ? 'COPIADO' : 'COPIAR PIX COPIA E COLA'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.pixFeedbackTexto}>
            {pixCopiado ? 'Codigo copiado com sucesso.' : 'Toque no botao para copiar o codigo.'}
          </Text>
          <TouchableOpacity style={styles.pixBotaoFechar} onPress={onClose}>
            <Text style={styles.pixBotaoFecharTexto}>FECHAR</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
