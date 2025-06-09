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
import loginStyles from '../styles/LoginStyles';

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
      style={loginStyles.container}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <Image
        source={require('../../assets/logo.png')}
        style={loginStyles.logo}
        resizeMode="contain"
      />

      <View style={loginStyles.card}>
        <Text style={loginStyles.title}>LOGIN</Text>

        {error ? <Text style={loginStyles.errorText}>{error}</Text> : null}

        <Text style={loginStyles.label}>E-mail</Text>
        <View style={loginStyles.inputWrapper}>
          <Image source={require('../../assets/email.png')} style={loginStyles.icon} />
          <TextInput
            placeholder="Digite seu e-mail institucional"
            placeholderTextColor="#333"
            style={loginStyles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <Text style={[loginStyles.label, { marginTop: 16 }]}>Senha</Text>
        <View style={loginStyles.inputWrapper}>
          <Image source={require('../../assets/lock.png')} style={loginStyles.icon} />
          <TextInput
            placeholder="Digite sua senha"
            placeholderTextColor="#333"
            style={loginStyles.input}
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
          />
        </View>

        <TouchableOpacity
          style={[loginStyles.button, loading && loginStyles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={loginStyles.buttonText}>ENTRAR</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
