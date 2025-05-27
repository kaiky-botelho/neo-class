import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Top bar com ícone perfil */}
      {/* Calendário resumido: pode usar react-native-calendars */}
      <TouchableOpacity onPress={() => navigation.navigate('Calendar')}>
        <Text>Ver Calendário</Text>
      </TouchableOpacity>
      {/* Cards: Disciplinas, Notas, Faltas, Suporte */}
      <TouchableOpacity onPress={() => navigation.navigate('Disciplines')}>
        <Text>Disciplinas</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Absences')}>
        <Text>Faltas</Text>
      </TouchableOpacity>
    </View>
  );
}
