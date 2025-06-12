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
import Toast from 'react-native-toast-message'; // Import Toast from the library

export default function LoginScreen() {
  const navigation = useNavigation();
  const { signIn, loading } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = async () => {
    try {
      await signIn(email.trim(), senha);

      // --- ADICIONADO: Toast de sucesso após login bem-sucedido ---
      Toast.show({
        type: 'success', // Tipo de toast para sucesso
        text1: 'Login Bem-Sucedido!', // Título do toast
        text2: 'Redirecionando para a tela inicial...', // Mensagem de detalhe
        position: 'top',
        visibilityTime: 2000, // Tempo de exibição menor, pois a navegação é rápida
        autoHide: true,
        onHide: () => { // Callback para navegar APÓS o toast ser escondido
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Home' }],
                })
            );
        },
      });
      // --- FIM DA ADIÇÃO ---

    } catch (err: any) {
      let errorMessage = 'Ocorreu um erro inesperado. Tente novamente.';

      if (err.response) {
        if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else if (err.response.data && err.response.data.message) {
          errorMessage = err.response.data.message;
        } else {
          errorMessage = `Erro na requisição (${err.response.status}).`;
        }
      } else if (err.message === 'Network Error') {
        errorMessage = 'Erro de conexão: Verifique sua internet.';
      }

      Toast.show({
        type: 'error',
        text1: 'Erro de Login',
        text2: errorMessage,
        position: 'top',
        visibilityTime: 4000,
        autoHide: true,
      });
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