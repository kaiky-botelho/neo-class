// src/navigation/AuthStack.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}

// src/navigation/AppStack.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import CalendarScreen from '../screens/CalendarScreen';
import AcademicCalendar from '../screens/AcademicCalendar';
import Notifications from '../screens/Notifications';
import Disciplines from '../screens/Disciplines';
import GradesDetail from '../screens/GradesDetail';
import Absences from '../screens/Absences';

const Stack = createNativeStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Início' }} />
      <Stack.Screen name="Calendar" component={CalendarScreen} options={{ title: 'Calendário' }} />
      <Stack.Screen name="AcademicCalendar" component={AcademicCalendar} options={{ title: 'Calendário Acadêmico' }} />
      <Stack.Screen name="Notifications" component={Notifications} options={{ title: 'Notificações' }} />
      <Stack.Screen name="Disciplines" component={Disciplines} options={{ title: 'Disciplinas' }} />
      <Stack.Screen name="GradesDetail" component={GradesDetail} options={{ title: 'Detalhe Notas' }} />
      <Stack.Screen name="Absences" component={Absences} options={{ title: 'Faltas' }} />
    </Stack.Navigator>
  );
}

// App.tsx
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider, AuthContext } from '../../src/context/AuthContext';
import AuthStack from '../../src/navigation/AuthStack';
import AppStack from '../../src/navigation/AppStack';

function Routes() {
  const { token } = useContext(AuthContext);
  return (
    <NavigationContainer>
      {token ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
}
