// src/screens/HomeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function HomeScreen() {
  const { signOut, user } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>
        Olá{user?.nome ? `, ${user.nome}` : ''}! 🎉
      </Text>
      <TouchableOpacity style={styles.button} onPress={signOut}>
        <Text style={styles.buttonText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  welcome: {
    fontSize: 24,
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#EA9216',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
  },
});
