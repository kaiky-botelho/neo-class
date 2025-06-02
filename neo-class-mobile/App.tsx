// App.tsx
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider } from './src/context/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen  from './src/screens/HomeScreen';

// Chama a preventAutoHideAsync antes de renderizar qualquer coisa
SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Carrega as fontes
        await Font.loadAsync({
          'Roboto-Medium': require('./assets/fonts/Roboto-Medium.ttf'),
          'Poppins-ExtraBold': require('./assets/fonts/Poppins-ExtraBold.ttf'),
          'Poppins-Medium': require('./assets/fonts/Poppins-Medium.ttf'),
        });
      } catch (e) {
        console.warn(e);
      } finally {
        setFontsLoaded(true);
        // Agora que as fontes carregaram, escondemos a splash
        await SplashScreen.hideAsync();
      }
    }
    prepare();
  }, []);

  if (!fontsLoaded) {
    // Enquanto as fontes não carregarem, devolve null (a splash permanece)
    return null;
  }

  return (
    <NavigationContainer>
      <AuthProvider>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Home"  component={HomeScreen} />
        </Stack.Navigator>
      </AuthProvider>
    </NavigationContainer>
  );
}
