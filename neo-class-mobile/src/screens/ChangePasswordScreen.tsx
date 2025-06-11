import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ActivityIndicator,
  Platform,
  StatusBar,
  KeyboardAvoidingView,
  Keyboard,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import changePasswordStyles from '../styles/changePasswordStyles';
import Toast from 'react-native-toast-message';

export default function ChangePasswordScreen() {
  const navigation = useNavigation();
  const { user, changePassword, signOut } = useContext(AuthContext);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  // Removido: const [error, setError] = useState(''); // Este estado NÃO É MAIS NECESSÁRIO para exibir o erro diretamente na tela

  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const openProfileModal = () => setProfileModalVisible(true);
  const closeProfileModal = () => setProfileModalVisible(false);

  const navigateToSelfChangePassword = () => {
    closeProfileModal();
    setNewPassword('');
    setConfirmPassword('');
    // Removido: setError(''); // Não precisa mais zerar o estado de erro, o toast é transitório
  };

  const handleLogout = () => {
    closeProfileModal();
    signOut();
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Login' as never }],
      })
    );
  };

  const handleSubmit = async () => {
    // Removido: setError(''); // Não precisa mais zerar o estado de erro, o toast é transitório
    Keyboard.dismiss();

    if (newPassword.length < 6) {
      Toast.show({
        type: 'error',
        text1: 'Senha Fraca',
        text2: 'A nova senha deve ter no mínimo 6 caracteres.',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Senhas Diferentes',
        text2: 'A nova senha e a confirmação não coincidem.',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      await changePassword(newPassword);

      Toast.show({
        type: 'success',
        text1: 'Sucesso!',
        text2: 'Sua senha foi alterada com sucesso.',
        position: 'top',
        visibilityTime: 3000,
        onHide: () => {
          navigation.goBack();
        }
      });
    } catch (err: any) {
      console.error('Erro ao alterar senha:', err);
      let msg = 'Erro ao alterar a senha. Tente novamente.';
      if (err.response) {
        if (typeof err.response.data === 'string') {
          msg = err.response.data;
        } else if (err.response.data && err.response.data.message) {
          msg = err.response.data.message;
        } else {
          msg = `Erro na requisição (${err.response.status}).`;
        }
      } else if (err.message === 'Network Error') {
        msg = 'Erro de conexão. Verifique sua internet.';
      }
      // Removido: setError(msg); // Não precisamos mais exibir o erro no texto abaixo dos inputs
      Toast.show({
        type: 'error',
        text1: 'Falha ao Alterar Senha',
        text2: msg,
        position: 'top',
        visibilityTime: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const topBarAndroidMargin = Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 0;

  return (
    <SafeAreaView style={changePasswordStyles.topSafe}>
      <View style={[changePasswordStyles.topBar, { marginTop: topBarAndroidMargin }]}>
        <TouchableOpacity style={changePasswordStyles.backButton} onPress={() => navigation.goBack()}>
          <Image source={require('../../assets/voltar.png')} style={changePasswordStyles.backIcon} />
        </TouchableOpacity>
        <View style={changePasswordStyles.topBarSpacer} />
        <TouchableOpacity style={changePasswordStyles.profileButton} onPress={openProfileModal}>
          <Image source={require('../../assets/profile.png')} style={changePasswordStyles.profileIcon} />
        </TouchableOpacity>
      </View>

      <Modal
        visible={profileModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeProfileModal}
      >
        <TouchableWithoutFeedback onPress={closeProfileModal}>
          <View style={changePasswordStyles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={changePasswordStyles.modalContainer}>
          <Text style={changePasswordStyles.modalHeader}>
            {`Olá${user?.nome ? `, ${user.nome}` : ''}`}
          </Text>
          <View style={changePasswordStyles.modalDivider} />
          <TouchableOpacity style={changePasswordStyles.modalButton} onPress={navigateToSelfChangePassword}>
            <Text style={changePasswordStyles.modalButtonText}>ALTERAR SENHA</Text>
            <Image source={require('../../assets/cadeado.png')} style={changePasswordStyles.modalButtonIcon} />
          </TouchableOpacity>
          <View style={changePasswordStyles.modalDivider} />
          <TouchableOpacity style={changePasswordStyles.modalButton} onPress={handleLogout}>
            <Text style={changePasswordStyles.modalButtonText}>SAIR</Text>
            <Image source={require('../../assets/exit.png')} style={changePasswordStyles.modalButtonIcon} />
          </TouchableOpacity>
        </View>
      </Modal>

      <KeyboardAvoidingView
        style={changePasswordStyles.mainContentWrapper}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={changePasswordStyles.formContainer}>
          <Text style={changePasswordStyles.title}>Alterar Senha</Text>

          <TextInput
            placeholder="Nova Senha"
            placeholderTextColor="#999"
            secureTextEntry
            style={changePasswordStyles.input}
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TextInput
            placeholder="Confirme a Nova Senha"
            placeholderTextColor="#999"
            secureTextEntry
            style={changePasswordStyles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          {/* ESTA LINHA FOI O PROBLEMA: {error ? <Text style={changePasswordStyles.errorText}>{error}</Text> : null}
              Removemos o estado `error` e a sua renderização explícita,
              já que os erros agora são tratados por Toast.show(). */}

          <TouchableOpacity
            style={[changePasswordStyles.button, loading && changePasswordStyles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={changePasswordStyles.buttonText}>SALVAR NOVA SENHA</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}