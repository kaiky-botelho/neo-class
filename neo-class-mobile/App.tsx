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
import Toast from 'react-native-toast-message'; // Import Toast here

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
  ChangePassword: undefined; // Assuming this is a screen in your app
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
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Lack" component={LackScreen} />
          <Stack.Screen name="Note" component={NoteScreen} />
          <Stack.Screen name="AcademicCalendar" component={AcademicCalendarScreen} />
          <Stack.Screen name="Subjects" component={SubjectsScreen} />
          <Stack.Screen name="Notification" component={NotificationScreen} />
          {/* Ensure ChangePassword screen is also defined if it exists */}
          {/* <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} /> */}
        </Stack.Navigator>
      </AuthProvider>
      {/* The Toast component DEVE be rendered last in the component tree,
          outside the Stack.Navigator, but inside NavigationContainer/Providers,
          so it appears on top of all screens. */}
      <Toast />
    </NavigationContainer>
  );
}