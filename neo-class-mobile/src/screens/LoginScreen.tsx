import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { AuthContext } from '../context/AuthContext';

export default function LoginScreen() {
  const { signIn } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>LOGIN</Text>
      <TextInput placeholder="Digite seu e-mail" style={styles.input} autoCapitalize="none"
        value={email} onChangeText={setEmail} keyboardType="email-address"/>
      <TextInput placeholder="Digite sua senha" style={styles.input} secureTextEntry
        value={senha} onChangeText={setSenha}/>
      <TouchableOpacity style={styles.button} onPress={() => signIn(email, senha)}>
        <Text style={styles.buttonText}>ENTRAR</Text>
      </TouchableOpacity>
    </View>
  );
}
