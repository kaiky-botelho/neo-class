// App.tsx
import React, { useState, useEffect } from 'react';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider } from './src/context/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import LackScreen from './src/screens/LackScreen';
import NoteScreen from './src/screens/NoteScreen';

// 1) Defina e exporte o tipo do stack navigation:
export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Lack: undefined;
  Note: undefined;
  // Caso crie ChangePassword mais adiante, adicione:
  ChangePassword: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Carrega as fontes necessárias
        await Font.loadAsync({
          'Roboto-Medium': require('./assets/fonts/Roboto-Medium.ttf'),
          'Poppins-ExtraBold': require('./assets/fonts/Poppins-ExtraBold.ttf'),
          'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
          'Poppins-Medium': require('./assets/fonts/Poppins-Medium.ttf'),
        });
      } catch (e) {
        console.warn(e);
      } finally {
        setFontsLoaded(true);
        await SplashScreen.hideAsync();
      }
    }
    prepare();
  }, []);

  if (!fontsLoaded) {
    // Mantém a splash aberta até as fontes carregarem
    return null;
  }

  return (
    <NavigationContainer>
      <AuthProvider>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Lack" component={LackScreen} />
          <Stack.Screen name="Note" component={NoteScreen} />
          {/* Quando criar a tela ChangePassword, basta descomentar abaixo: */}
          {/* <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} /> */}
        </Stack.Navigator>
      </AuthProvider>
    </NavigationContainer>
  );
}
