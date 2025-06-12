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
  Platform,
  StatusBar,
} from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import subjectsStyles from '../styles/subjectsStyles';
import Toast from 'react-native-toast-message';

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
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (!authLoading && user?.turmaId) {
      setLoading(true);
      api
        .get<MateriaDTO[]>('/materias')
        .then(res => {
          setMaterias(res.data.filter(m => m.turmaId === user.turmaId));
        })
        .catch(err => {
          console.log('Erro ao carregar disciplinas:', err);
          let errorMessage = 'Não foi possível carregar as disciplinas.';
          if (err.response) {
            if (typeof err.response.data === 'string') {
              errorMessage = err.response.data;
            } else if (err.response.data?.message) {
              errorMessage = err.response.data.message;
            } else {
              errorMessage = `Erro na requisição (${err.response.status}).`;
            }
          } else if (err.message === 'Network Error') {
            errorMessage = 'Erro de conexão: Verifique sua internet.';
          }
          Toast.show({
            type: 'error',
            text1: 'Erro ao Carregar Disciplinas',
            text2: errorMessage,
            position: 'top',
            visibilityTime: 4000,
            autoHide: true,
          });
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

  const topBarAndroidMargin =
    Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

  return (
    <View style={{ flex: 1 }}>
      {/* HEADER */}
      <SafeAreaView style={subjectsStyles.topSafe}>
        <View style={[subjectsStyles.topBar, { marginTop: topBarAndroidMargin }]}> 
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={require('../../assets/voltar.png')}
              style={subjectsStyles.backIcon}
            />
          </TouchableOpacity>
          <View style={subjectsStyles.topBarSpacer} />
          <TouchableOpacity onPress={openProfileModal}>
            <Image
              source={require('../../assets/profile.png')}
              style={subjectsStyles.profileIcon}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* MODAL */}
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent
        onRequestClose={closeProfileModal}
      >
        <View style={{ flex: 1 }}>
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
              <Text style={subjectsStyles.modalButtonText}>
                ALTERAR SENHA
              </Text>
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
        </View>
      </Modal>

      {/* CONTEÚDO */}
      <SafeAreaView style={[subjectsStyles.bottomSafe, { flex: 1 }]}> 
        <View style={subjectsStyles.container}>
          <Text style={subjectsStyles.title}>DISCIPLINAS</Text>

          {loading ? (
            <ActivityIndicator size="large" color="#333" />
          ) : (
            <FlatList
              data={materias}
              keyExtractor={m => String(m.id)}
              renderItem={({ item }) => (
                <TouchableOpacity style={subjectsStyles.subjectButton}>
                  <Text style={subjectsStyles.subjectText}>{item.nome}</Text>
                </TouchableOpacity>
              )}
              contentContainerStyle={subjectsStyles.listContainer}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                !loading && materias.length === 0 ? (
                  <Text style={subjectsStyles.noDataText}>
                    Nenhuma disciplina encontrada.
                  </Text>
                ) : null
              }
            />
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}
