import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import styles from '../Estilo/styles';

export default function CriarPerfil({
  login,
  nome,
  setNome,
  telefone,
  setTelefone,
  email,
  setEmail,
  senha,
  setSenha,
  onEntrar,
  onCadastrar,
  onAlternarModo,
}) {
  return (
    <View>
      <Text style={styles.titulo}>{login ? 'Acessar Conta' : 'Novo Cadastro'}</Text>
      <Text style={styles.subtitulo}>
        {login ? 'Seja Bem-vindo ciclista' : 'Crie sua conta aqui.'}
      </Text>

      {!login ? (
        <View>
          <TextInput
            style={styles.input}
            placeholder="Nome Completo"
            value={nome}
            onChangeText={setNome}
          />
          <TextInput
            style={styles.input}
            placeholder="Telefone"
            value={telefone}
            onChangeText={setTelefone}
            keyboardType="phone-pad"
          />
        </View>
      ) : null}

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      <TouchableOpacity style={styles.botao} onPress={login ? onEntrar : onCadastrar}>
        <Text style={styles.textoBotao}>{login ? 'ENTRAR' : 'CADASTRAR'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonSecondary} onPress={onAlternarModo}>
        <Text style={styles.buttonText}>{login ? 'Criar uma conta' : 'Ja sou cadastrado'}</Text>
      </TouchableOpacity>
    </View>
  );
}