import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { auth } from './firebase'; 
import { CarrinhoProvider } from './screens/Loja/Carrinho/CarrinhoItem';

import LojaInicio from './screens/Loja/LojaInicio';
import Admin from './screens/Admin/Admin';
import AdicionarProduto from './screens/Admin/AdicionarProduto';
import ListarProduto from './screens/Admin/ListarProduto';
import ListarCliente from './screens/Admin/ListarCliente';
import Perfil from './screens/Perfil/Perfil';
import Rota from './screens/Rota/Rota';
import ComunidadeTela from './screens/Comunidade/ComunidadeTela';
import Carrinho from './screens/Loja/Carrinho/Carrinho';
import DetalhesProduto from './screens/Loja/DetalheProduto';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabsParaUsuario() {
  return (
    <Tab.Navigator screenOptions={{ tabBarActiveTintColor: '#007AFF', headerShown: false }}>
      <Tab.Screen name="Loja" component={LojaInicio} options={{ tabBarIcon: ({ color }) => <Ionicons name="storefront-outline" size={24} color={color} /> }} />
      <Tab.Screen name="Rota" component={Rota} options={{ tabBarIcon: ({ color }) => <Ionicons name="map" size={24} color={color} /> }} />
      <Tab.Screen name="Comunidade" component={ComunidadeTela} options={{ tabBarIcon: ({ color }) => <Ionicons name="people" size={24} color={color} /> }} />
      <Tab.Screen name="Perfil" component={Perfil} options={{ tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} /> }} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const monitor = auth.onAuthStateChanged((user) => {
      if (user) {
        setUsuario(user);
        setIsAdmin(user.email === 'loginadmin@gmail.com');
      } else {
        setUsuario(null);
        setIsAdmin(false);
      }
    });
    return monitor;
  }, []);

  return (
    <CarrinhoProvider>
      <NavigationContainer>
        <Stack.Navigator>
          {isAdmin ? (
            <>
              <Stack.Screen name="Admin" component={Admin} options={{ title: 'Painel Administrativo' }} />
              <Stack.Screen name="MainTabs" component={TabsParaUsuario} options={{ headerShown: false }} />
              <Stack.Screen name="AdicionarProduto" component={AdicionarProduto} options={{ title: 'Novo Produto' }} />
              <Stack.Screen name="ListarProduto" component={ListarProduto} options={{ title: 'Estoque' }} />
              <Stack.Screen name="ListarCliente" component={ListarCliente} options={{ title: 'Clientes' }} />
              <Stack.Screen name="DetalhesProduto" component={DetalhesProduto} options={{ title: 'Detalhes do Produto' }} />
              <Stack.Screen name="Carrinho" component={Carrinho} options={{ title: 'Meu Carrinho' }} />
              <Stack.Screen name="ComunidadeTela" component={ComunidadeTela} options={{ title: 'Comunidade' }} />
            </>
          ) : (
            <>
              <Stack.Screen name="MainTabs" component={TabsParaUsuario} options={{ headerShown: false }} />
              <Stack.Screen name="DetalhesProduto" component={DetalhesProduto} options={{ title: 'Detalhes do Produto' }} />
              <Stack.Screen name="Carrinho" component={Carrinho} options={{ title: 'Meu Carrinho' }} />
              <Stack.Screen name="ComunidadeTela" component={ComunidadeTela} options={{ title: 'Comunidade' }} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </CarrinhoProvider>
  );
}
