// src/screens/LoginScreen.tsx
import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import LoginStyles from '../styles/LoginStyles';

export default function LoginScreen() {
  const navigation = useNavigation();
  const { signIn, loading } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    try {
      await signIn(email.trim(), senha);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        })
      );
    } catch (err: any) {
      if (err.response) {
        const msg =
          typeof err.response.data === 'string'
            ? err.response.data
            : `Erro ${err.response.status}`;
        setError(msg);
      } else {
        setError('Erro de rede ou servidor');
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={LoginStyles.container}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <Image
        source={require('../../assets/logo.png')}
        style={LoginStyles.logo}
        resizeMode="contain"
      />

      <View style={LoginStyles.card}>
        <Text style={LoginStyles.title}>LOGIN</Text>

        {error ? <Text style={LoginStyles.errorText}>{error}</Text> : null}

        <Text style={LoginStyles.label}>E-mail</Text>
        <View style={LoginStyles.inputWrapper}>
          <Image source={require('../../assets/email.png')} style={LoginStyles.icon} />
          <TextInput
            placeholder="Digite seu e-mail institucional"
            placeholderTextColor="#333"
            style={LoginStyles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <Text style={[LoginStyles.label, { marginTop: 16 }]}>Senha</Text>
        <View style={LoginStyles.inputWrapper}>
          <Image source={require('../../assets/lock.png')} style={LoginStyles.icon} />
          <TextInput
            placeholder="Digite sua senha"
            placeholderTextColor="#333"
            style={LoginStyles.input}
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
          />
        </View>

        <TouchableOpacity
          style={[LoginStyles.button, loading && LoginStyles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={LoginStyles.buttonText}>ENTRAR</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
