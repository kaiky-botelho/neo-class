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
import AcademicCalendarScreen from './src/screens/AcademicCalendarScreen';
import SubjectsScreen from './src/screens/SubjectsScreen';
import NotificationScreen from './src/screens/NotificationScreen';
import ChangePasswordScreen from './src/screens/ChangePasswordScreen'; // <--- Importar ChangePasswordScreen
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message'; // <--- Importar BaseToast e ErrorToast aqui

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// 1) Defina e exporte o tipo do stack navigation:
export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Lack: undefined;
  Note: undefined;
  AcademicCalendar: undefined;
  Subjects: undefined;
  Notification: undefined;
  ChangePassword: undefined; // <--- Manter ChangePassword aqui
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// --- AQUI É A CONFIGURAÇÃO DO TOAST ---
const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: '#6BBA70', backgroundColor: '#F0FEEF' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: 'bold',
        color: '#333',
      }}
      text2Style={{
        fontSize: 13,
        color: '#666',
      }}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: '#EA9216', backgroundColor: '#FFF0E0' }}
      text1Style={{
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
      }}
      text2Style={{
        fontSize: 14,
        color: '#666',
      }}
    />
  ),
  info: (props: any) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: '#4A90E2', backgroundColor: '#E0F0FF' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: 'bold',
        color: '#333',
      }}
      text2Style={{
        fontSize: 13,
        color: '#666',
      }}
    />
  ),
  // Se você tiver um customError, mantenha-o aqui
  // customError: ({ text1, text2, props }: any) => ( ... )
};
// --- FIM DA CONFIGURAÇÃO DO TOAST ---


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
        // Hide the splash screen only after fonts are loaded
        SplashScreen.hideAsync();
      }
    }
    prepare();
  }, []);

  if (!fontsLoaded) {
    // Return null or a loading component while fonts are loading
    return null;
  }

  return (
    <NavigationContainer>
      <AuthProvider>
        {/* Este é o Stack.Navigator. Certifique-se de que NÃO HÁ NADA entre as tags <Stack.Screen> além delas próprias. */}
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Lack" component={LackScreen} />
          <Stack.Screen name="Note" component={NoteScreen} />
          <Stack.Screen name="AcademicCalendar" component={AcademicCalendarScreen} />
          <Stack.Screen name="Subjects" component={SubjectsScreen} />
          <Stack.Screen name="Notification" component={NotificationScreen} />
          <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
        </Stack.Navigator>
      </AuthProvider>
      {/* The Toast component DEVE be rendered last in the component tree,
          outside the Stack.Navigator, but inside NavigationContainer/Providers,
          so it appears on top of all screens. */}
      <Toast config={toastConfig} />
    </NavigationContainer>
  );
}