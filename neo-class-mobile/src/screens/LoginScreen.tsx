// src/screens/LoginScreen.tsx
import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';

export default function LoginScreen() {
  const navigation = useNavigation();
  const { signIn, loading } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    console.log('🚀 LOGIN REQUEST', { email, senha });
    setError('');
    try {
      await signIn(email.trim(), senha);
      // No sucesso, limpa pilha e vai para Home
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        })
      );
    } catch (err: any) {
      // Se vier response do axios
      if (err.response) {
        const fullUrl = `${err.config.baseURL}${err.config.url}`;
        console.log('🔥 LOGIN FAILURE 🔥', {
          status:  err.response.status,
          data:    err.response.data,
          fullUrl: fullUrl,
          payload: err.config.data,
        });
        setError(
          typeof err.response.data === 'string'
            ? err.response.data
            : err.response.data?.message || `Erro ${err.response.status}`
        );
      } else {
        // erro de rede/outro
        console.log('🌐 NETWORK ERROR 🌐', err.message);
        setError('Erro de rede ou servidor');
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <Image
        source={require('../../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <View style={styles.card}>
        <Text style={styles.title}>LOGIN</Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Text style={styles.label}>E-mail</Text>
        <View style={styles.inputWrapper}>
          <Image source={require('../../assets/email.png')} style={styles.icon} />
          <TextInput
            placeholder="Digite seu e-mail"
            placeholderTextColor="#333"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <Text style={[styles.label, { marginTop: 16 }]}>Senha</Text>
        <View style={styles.inputWrapper}>
          <Image source={require('../../assets/lock.png')} style={styles.icon} />
          <TextInput
            placeholder="Digite sua senha"
            placeholderTextColor="#333"
            style={styles.input}
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>ENTRAR</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333C56',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logo: {
    width: 160,
    height: 80,
    position: 'absolute',
    top: Platform.OS === 'ios' ? 100 : 80,
  },
   card: {
    width: '100%',
    backgroundColor: '#A0BFE8',
    borderTopLeftRadius: 90,
    borderBottomRightRadius: 90,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  title: {
    fontFamily: 'Poppins-ExtraBold',
    fontSize: 36,
    color: '#FFF',
    marginBottom: 16,
  },
  errorText: {
    color: '#f66',
    marginBottom: 12,
  },
  label: {
    alignSelf: 'flex-start',
    marginBottom: 6,
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#000',
  },
  inputWrapper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 12,
    height: 44,
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: '#333',
  },
  button: {
    width: 95,
    height: 38,
    marginTop: 24,
    backgroundColor: '#EA9216',
    paddingVertical: 6,
    borderRadius: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFF',
    fontFamily: 'Roboto-Medium',
    fontSize: 20,
    textAlign: 'center',
  },
});
