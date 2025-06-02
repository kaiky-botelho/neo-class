// src/screens/HomeScreen.tsx
import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { AuthContext } from '../context/AuthContext';

export default function HomeScreen() {
  const { signOut, user } = useContext(AuthContext);

  // opcional: callback quando o usuário toca em um dia
  const onDayPress = (day: { dateString: string }) => {
    console.log('Dia selecionado:', day.dateString);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>
        Olá{user?.nome ? `, ${user.nome}` : ''}! 🎉
      </Text>

      <Calendar
        onDayPress={onDayPress}
        // tema pra combinar com seu app
        theme={{
          todayTextColor: '#EA9216',
          dayTextColor: '#333',
          monthTextColor: '#EA9216',
          arrowColor: '#EA9216',
        }}
        // se quiser destacar algum dia:
        // markedDates={{ '2025-05-29': { selected: true, marked: true } }}
        style={styles.calendar}
      />

      <TouchableOpacity style={styles.button} onPress={signOut}>
        <Text style={styles.buttonText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', padding: 24 },
  welcome: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  calendar: {
    borderRadius: 8,
    elevation: 2,
    padding: 8,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#EA9216',
    height: 38,
    width: 95,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
  },
});