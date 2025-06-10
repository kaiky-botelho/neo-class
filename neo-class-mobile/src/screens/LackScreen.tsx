import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Platform, // <--- Importar Platform
  StatusBar, // <--- Importar StatusBar
} from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { FaltaDTO } from '../types/falta';
import lackStyles from '../styles/lackStyles';
import Toast from 'react-native-toast-message'; // <--- Importar Toast

export default function LackScreen() {
  const navigation = useNavigation();
  const { user, signOut } = useContext(AuthContext);

  const [faltas, setFaltas] = useState<FaltaDTO[]>([]);
  const [loading, setLoading] = useState(true);
  // Removido: const [error, setError] = useState(''); // Não precisamos mais deste estado para exibir erro
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (user?.id) {
      buscarFaltas(user.id);
    }
  }, [user]);

  async function buscarFaltas(alunoId: number) {
    setLoading(true);
    // Removido: setError('');
    try {
      const res = await api.get<FaltaDTO[]>(`/frequencias/faltas/${alunoId}`);
      setFaltas(res.data);
      // Opcional: Toast de sucesso se quiser feedback visual para carregamento bem-sucedido
      // Toast.show({
      //   type: 'success',
      //   text1: 'Faltas Carregadas',
      //   text2: 'Dados de faltas atualizados com sucesso.',
      //   position: 'top',
      //   visibilityTime: 2000,
      // });
    } catch (err: any) {
      console.log('Erro ao buscar faltas:', err);
      let errorMessage = 'Não foi possível carregar as faltas.';

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

      // Exibe o toast de erro
      Toast.show({
        type: 'error',
        text1: 'Erro ao Carregar Faltas',
        text2: errorMessage,
        position: 'top',
        visibilityTime: 4000,
        autoHide: true,
      });
      // Removido: setError(...)
    } finally {
      setLoading(false);
    }
  }

  const openProfileModal = () => setModalVisible(true);
  const closeProfileModal = () => setModalVisible(false);
  const handleChangePassword = () => {
    closeProfileModal();
    navigation.navigate('ChangePassword' as never);
  };
  const handleLogout = () => {
    closeProfileModal();
    signOut();
    navigation.dispatch(
      CommonActions.reset({ index: 0, routes: [{ name: 'Login' as never }] })
    );
  };

  const renderItem = ({ item }: { item: FaltaDTO }) => (
    <View style={lackStyles.listItem}>
      <Text style={lackStyles.subjectText}>{item.materiaNome}</Text>
      <View style={lackStyles.badge}>
        <Text style={lackStyles.badgeText}>{item.totalFaltas}</Text>
      </View>
    </View>
  );

  // Calcular a margem para o cabeçalho no Android
  const topBarAndroidMargin = Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 0;
  // O lackStyles.bottomSafe já tem um padding inicial de 24, que é um valor fixo.
  // Se quiser manter esse padding fixo E adicionar o da StatusBar, você precisaria somar.
  // Mas geralmente, o padding inicial já basta para o conteúdo principal.
  const bottomSafeAndroidPaddingTop = 0; // Ou ajuste conforme a necessidade específica da sua tela

  return (
    <>
      {/* Header / Perfil */}
      <SafeAreaView style={lackStyles.topSafe}>
        <View style={[lackStyles.topBar, { marginTop: topBarAndroidMargin }]}> {/* Aplicar a margem aqui */}
          <TouchableOpacity
            style={lackStyles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Image
              source={require('../../assets/voltar.png')}
              style={lackStyles.backIcon}
            />
          </TouchableOpacity>
          <View style={lackStyles.topBarSpacer} />
          <TouchableOpacity
            style={lackStyles.profileButton}
            onPress={openProfileModal}
          >
            <Image
              source={require('../../assets/profile.png')}
              style={lackStyles.profileIcon}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent
        onRequestClose={closeProfileModal}
      >
        <TouchableWithoutFeedback onPress={closeProfileModal}>
          <View style={lackStyles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={lackStyles.modalContainer}>
          <Text style={lackStyles.modalHeader}>
            {`Olá${user?.nome ? `, ${user.nome}` : ''}`}
          </Text>
          <View style={lackStyles.modalDivider} />
          <TouchableOpacity
            style={lackStyles.modalButton}
            onPress={handleChangePassword}
          >
            <Text style={lackStyles.modalButtonText}>
              ALTERAR SENHA
            </Text>
            <Image
              source={require('../../assets/cadeado.png')}
              style={lackStyles.modalButtonIcon}
            />
          </TouchableOpacity>
          <View style={lackStyles.modalDivider} />
          <TouchableOpacity
            style={lackStyles.modalButton}
            onPress={handleLogout}
          >
            <Text style={lackStyles.modalButtonText}>SAIR</Text>
            <Image
              source={require('../../assets/exit.png')}
              style={lackStyles.modalButtonIcon}
            />
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Conteúdo Faltas */}
      <SafeAreaView style={[lackStyles.bottomSafe, { paddingTop: bottomSafeAndroidPaddingTop }]}>
        <View style={lackStyles.container}>
          <Text style={lackStyles.headerTitle}>FALTAS</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#EB5757" />
          ) : ( // Removida a verificação 'error ?' e o Text de erro
            <FlatList
              data={faltas}
              keyExtractor={i => String(i.materiaId)}
              renderItem={renderItem}
              contentContainerStyle={lackStyles.listContainer}
              ListEmptyComponent={faltas.length === 0 && !loading ? (
                <Text style={lackStyles.noDataText}>Nenhuma falta registrada.</Text>
              ) : null}
            />
          )}
        </View>
      </SafeAreaView>
    </>
  );
}