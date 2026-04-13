import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth, firestore } from '../../firebase';
import styles from '../Estilo/styles';
import { useCarrinho } from '../Loja/Carrinho/CarrinhoItem';
import IdPerfil from './IdPerfil';
import CriarPerfil from './CriarPerfil';
import { cadastrarPerfil } from './CadastrarPerfil';

export default function Perfil({ navigation, route }) {
  const [login, setLogin] = useState(true);
  const [usuario, setUsuario] = useState(null);
  const [dadosFirestore, setDadosFirestore] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const { adicionarAoCarrinho } = useCarrinho();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [telefone, setTelefone] = useState('');
  const acaoPendente = route.params?.acaoPendente;
  const produtoSelecionado = route.params?.produtoSelecionado;
  const idCiclista = usuario ? `#${usuario.uid.slice(0, 4).toUpperCase()}` : '';
  let quilometragemTotal = Number(dadosFirestore?.quilometragemTotal);

  if (!quilometragemTotal) {
    quilometragemTotal = 0;
  }

  useEffect(() => {
    const monitor = auth.onAuthStateChanged(async (user) => {
      setUsuario(user);

      if (user) {
        if (user.email !== 'loginadmin@gmail.com') {
          const doc = await firestore.collection('Usuario').doc(user.uid).get();
          if (doc.exists) {
            setDadosFirestore(doc.data());
          }
        }
      } else {
        setDadosFirestore(null);
        setNome('');
        setEmail('');
        setSenha('');
        setTelefone('');
      }

      setCarregando(false);
    });

    return monitor;
  }, []);

  useEffect(() => {
    if (!usuario || !acaoPendente || !produtoSelecionado) {
      return;
    }

    if (acaoPendente === 'adicionar') {
      adicionarAoCarrinho(produtoSelecionado);
      Alert.alert('Carrinho', 'Produto adicionado ao carrinho.');
    }

    if (acaoPendente === 'comprar') {
      adicionarAoCarrinho(produtoSelecionado);
      navigation.navigate('Carrinho');
    }

    navigation.setParams({
      acaoPendente: undefined,
      produtoSelecionado: undefined,
    });
  }, [acaoPendente, adicionarAoCarrinho, navigation, produtoSelecionado, usuario]);

  const cadastrar = () => {
    cadastrarPerfil({ auth, firestore, nome, email, telefone, senha })
      .then(() => {
        Alert.alert('Sucesso', 'Ciclista cadastrado no BikeHub 360!');
        setLogin(true);
      })
      .catch(() => Alert.alert('Erro', 'Falha ao criar conta.'));
  };

  const entrar = () => {
    auth.signInWithEmailAndPassword(email, senha)
      .catch(() => Alert.alert('Erro', 'Login ou senha invalidos.'));
  };

  const sair = () => auth.signOut();

  if (carregando) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {usuario ? (
        <View style={styles.perfilContainer}>
          <View style={styles.perfilHero}>
            <View style={styles.perfilAvatar}>
              <Ionicons name="person" size={34} color="#FFFFFF" />
            </View>

            <Text style={styles.perfilNomeDestaque}>
              {usuario.email === 'loginadmin@gmail.com'
                ? 'Administrador'
                : dadosFirestore?.nome || 'Ciclista BikeHub'}
            </Text>

            {usuario.email !== 'loginadmin@gmail.com' ? (
              <IdPerfil idCiclista={idCiclista} />
            ) : null}
          </View>

          <View style={styles.cardPerfil}>
            <Text style={styles.perfilSecaoTitulo}>
              {usuario.email === 'loginadmin@gmail.com' ? 'Dados do Administrador' : 'Dados do Ciclista'}
            </Text>

            <View style={styles.blocoInfo}>
              <Text style={styles.labelInfo}>NOME:</Text>
              <Text style={styles.infoTexto}>
                {usuario.email === 'loginadmin@gmail.com'
                  ? 'Administrador BikeHub'
                  : dadosFirestore?.nome || 'Nao informado'}
              </Text>
            </View>

            <View style={styles.divisor} />

            <View style={styles.blocoInfo}>
              <Text style={styles.labelInfo}>E-MAIL:</Text>
              <Text style={styles.infoTexto}>{usuario.email}</Text>
            </View>

            {usuario.email !== 'loginadmin@gmail.com' ? (
              <>
                <View style={styles.divisor} />

                <IdPerfil idCiclista={idCiclista} variante="info" />

                <View style={styles.divisor} />

                <View style={styles.blocoInfo}>
                  <Text style={styles.labelInfo}>TELEFONE:</Text>
                  <Text style={styles.infoTexto}>{dadosFirestore?.telefone || 'Nao informado'}</Text>
                </View>

                <View style={styles.divisor} />

                <View style={styles.blocoInfo}>
                  <Text style={styles.labelInfo}>QUILOMETRAGEM TOTAL:</Text>
                  <Text style={styles.infoTexto}>{quilometragemTotal} km</Text>
                </View>
              </>
            ) : null}
          </View>

          {usuario.email === 'loginadmin@gmail.com' && (
            <TouchableOpacity
              style={[styles.botao, styles.perfilBotaoAdmin]}
              onPress={() => navigation.navigate('Admin')}
            >
              <Text style={styles.textoBotao}>ACESSAR PAINEL ADMIN</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={[styles.botao, { backgroundColor: '#FF3B30' }]} onPress={sair}>
            <Text style={styles.textoBotao}>SAIR DA CONTA</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <CriarPerfil
          login={login}
          nome={nome}
          setNome={setNome}
          telefone={telefone}
          setTelefone={setTelefone}
          email={email}
          setEmail={setEmail}
          senha={senha}
          setSenha={setSenha}
          onEntrar={entrar}
          onCadastrar={cadastrar}
          onAlternarModo={() => setLogin(!login)}
        />
      )}
    </ScrollView>
  );
}
