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
// Não precisamos mais do lackStyles aqui se o modal for estilizado por subjectsStyles
// import lackStyles from '../styles/lackStyles'; 
import subjectsStyles from '../styles/subjectsStyles';
import Toast from 'react-native-toast-message'; // <--- Importar Toast

interface MateriaDTO {
  id: number;
  nome: string;
  bimestre: number;
  professorId: number;
  turmaId: number;
}

export default function SubjectsScreen() {
  const navigation = useNavigation();
  const { user, loading: authLoading, signOut } = useContext(AuthContext);

  const [materias, setMaterias] = useState<MateriaDTO[]>([]);
  const [loading, setLoading] = useState(true);
  // Removido: const [error, setError] = useState(''); // Não precisamos mais deste estado para exibir erro
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (!authLoading && user?.turmaId) {
      setLoading(true);
      api.get<MateriaDTO[]>('/materias')
        .then(res => {
          setMaterias(
            res.data.filter(m => m.turmaId === user.turmaId)
          );
          // Opcional: Toast de sucesso se quiser feedback visual para carregamento bem-sucedido
          // Toast.show({
          //   type: 'success',
          //   text1: 'Disciplinas Carregadas',
          //   text2: 'Dados de disciplinas atualizados com sucesso.',
          //   position: 'top',
          //   visibilityTime: 2000,
          // });
        })
        .catch(err => {
          console.log('Erro ao carregar disciplinas:', err);
          let errorMessage = 'Não foi possível carregar as disciplinas.';
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
            text1: 'Erro ao Carregar Disciplinas',
            text2: errorMessage,
            position: 'top',
            visibilityTime: 4000,
            autoHide: true,
          });
          // Removido: setError('Não foi possível carregar disciplinas');
        })
        .finally(() => setLoading(false));
    }
  }, [authLoading, user]);

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

  const renderItem = ({ item }: { item: MateriaDTO }) => (
    <TouchableOpacity style={subjectsStyles.subjectButton}>
      <Text style={subjectsStyles.subjectText}>{item.nome}</Text>
    </TouchableOpacity>
  );

  // Calcular a margem para o cabeçalho no Android
  const topBarAndroidMargin = Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 0;
  // O subjectsStyles.bottomSafe já tem um paddingTop inicial de 24, que é um valor fixo.
  const bottomSafeAndroidPaddingTop = 0; // Ou ajuste conforme a necessidade da sua tela

  return (
    <>
      {/* Header / Modal (usando subjectsStyles para consistência visual do modal) */}
      <SafeAreaView style={subjectsStyles.topSafe}>
        <View style={[subjectsStyles.topBar, { marginTop: topBarAndroidMargin }]}> {/* Aplicar a margem aqui */}
          <TouchableOpacity
            style={subjectsStyles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Image
              source={require('../../assets/voltar.png')}
              style={subjectsStyles.backIcon}
            />
          </TouchableOpacity>
          <View style={subjectsStyles.topBarSpacer} />
          <TouchableOpacity
            style={subjectsStyles.profileButton}
            onPress={openProfileModal}
          >
            <Image
              source={require('../../assets/profile.png')}
              style={subjectsStyles.profileIcon}
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
          <View style={subjectsStyles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={subjectsStyles.modalContainer}>
          <Text style={subjectsStyles.modalHeader}>
            {`Olá${user?.nome ? `, ${user.nome}` : ''}`}
          </Text>
          <View style={subjectsStyles.modalDivider} />
          <TouchableOpacity
            style={subjectsStyles.modalButton}
            onPress={handleChangePassword}
          >
            <Text style={subjectsStyles.modalButtonText}>ALTERAR SENHA</Text>
            <Image
              source={require('../../assets/cadeado.png')}
              style={subjectsStyles.modalButtonIcon}
            />
          </TouchableOpacity>
          <View style={subjectsStyles.modalDivider} />
          <TouchableOpacity
            style={subjectsStyles.modalButton}
            onPress={handleLogout}
          >
            <Text style={subjectsStyles.modalButtonText}>SAIR</Text>
            <Image
              source={require('../../assets/exit.png')}
              style={subjectsStyles.modalButtonIcon}
            />
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Conteúdo principal */}
      <SafeAreaView style={subjectsStyles.bottomSafe}>
        <View style={subjectsStyles.container}>
          <Text style={subjectsStyles.title}>DISCIPLINAS</Text>

          {loading ? (
            <ActivityIndicator size="large" color="#333" />
          ) : ( // Removida a verificação 'error ?' e o Text de erro
            <FlatList
              data={materias}
              keyExtractor={m => String(m.id)}
              renderItem={renderItem}
              contentContainerStyle={subjectsStyles.listContainer}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={materias.length === 0 && !loading ? (
                <Text style={subjectsStyles.noDataText}>Nenhuma disciplina encontrada.</Text>
              ) : null}
            />
          )}
        </View>
      </SafeAreaView>
    </>
  );
}