import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  Platform,
  Image,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  StatusBar,
} from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import styles from '../styles/academicCalendarStyles';
import Toast from 'react-native-toast-message';

interface ProvaDTO {
  id: number;
  nome: string;
  data: string;
  turmaId: number;
  nota: number;
}
interface TrabalhoDTO {
  id: number;
  nome: string;
  data: string;
  turmaId: number;
  nota: number;
}

export default function AcademicCalendarScreen() {
  const navigation = useNavigation();
  const { user, loading: authLoading, signOut } = useContext(AuthContext);

  const [provas, setProvas] = useState<ProvaDTO[]>([]);
  const [trabalhos, setTrabalhos] = useState<TrabalhoDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const formatDateBr = (iso: string) =>
    new Date(iso).toLocaleDateString('pt-BR');

  useEffect(() => {
    if (!authLoading && user?.turmaId) {
      setLoading(true);
      Promise.all([
        api.get<ProvaDTO[]>('/provas'),
        api.get<TrabalhoDTO[]>('/trabalhos'),
      ])
        .then(([pRes, tRes]) => {
          setProvas(pRes.data.filter(p => p.turmaId === user.turmaId));
          setTrabalhos(tRes.data.filter(t => t.turmaId === user.turmaId));
        })
        .catch((err) => {
          console.error("Erro ao carregar calendário:", err);
          let errorMessage = 'Não foi possível carregar o calendário.';
          if (err.response && typeof err.response.data === 'string') {
            errorMessage = err.response.data;
          } else if (err.message === 'Network Error') {
            errorMessage = 'Erro de conexão: Verifique sua internet.';
          }

          Toast.show({
            type: 'error',
            text1: 'Erro ao Carregar Dados',
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

  const renderHeader = () => (
    <View style={styles.tableHeader}>
      <Text style={[styles.headerCell, { flex: 2 }]}>Matéria</Text>
      <Text style={styles.headerCell}>Data</Text>
      <Text style={styles.headerCell}>Peso</Text>
    </View>
  );

  const renderProva = ({ item }: { item: ProvaDTO }) => (
    <View style={[styles.tableRow, styles.provaRow]}>
      <Text style={[styles.cell, { flex: 2 }]}>{item.nome}</Text>
      <Text style={styles.cell}>{formatDateBr(item.data)}</Text>
      <Text style={styles.cell}>{item.nota}</Text>
    </View>
  );
  const renderTrabalho = ({ item }: { item: TrabalhoDTO }) => (
    <View style={[styles.tableRow, styles.trabalhoRow]}>
      <Text style={[styles.cell, { flex: 2 }]}>{item.nome}</Text>
      <Text style={styles.cell}>{formatDateBr(item.data)}</Text>
      <Text style={styles.cell}>{item.nota}</Text>
    </View>
  );

  const topBarAndroidMargin = Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 0;
  const bottomSafeAndroidPaddingTop = Platform.OS === 'android' ? 24 : 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
      <StatusBar barStyle="light-content" backgroundColor="#333C56" />

      <SafeAreaView style={styles.topSafe}>
        <View style={[styles.topBar, { marginTop: topBarAndroidMargin }]}> 
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Image
              source={require('../../assets/voltar.png')}
              style={styles.backIcon}
            />
          </TouchableOpacity>
          <View style={styles.topBarSpacer} />
          <TouchableOpacity
            style={styles.profileButton}
            onPress={openProfileModal}
          >
            <Image
              source={require('../../assets/profile.png')}
              style={styles.profileIcon}
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
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.modalContainer}>
          <Text style={styles.modalHeader}>
            {`Olá${user?.nome ? `, ${user.nome}` : ''}`}
          </Text>
          <View style={styles.modalDivider} />
          <TouchableOpacity
            style={styles.modalButton}
            onPress={handleChangePassword}
          >
            <Text style={styles.modalButtonText}>ALTERAR SENHA</Text>
            <Image
              source={require('../../assets/cadeado.png')}
              style={styles.modalButtonIcon}
            />
          </TouchableOpacity>
          <View style={styles.modalDivider} />
          <TouchableOpacity
            style={styles.modalButton}
            onPress={handleLogout}
          >
            <Text style={styles.modalButtonText}>SAIR</Text>
            <Image
              source={require('../../assets/exit.png')}
              style={styles.modalButtonIcon}
            />
          </TouchableOpacity>
        </View>
      </Modal>

      <SafeAreaView style={[styles.bottomSafe, { paddingTop: bottomSafeAndroidPaddingTop }]}> 
        <View style={styles.container}>
          <Text style={styles.title}>CALENDÁRIO ACADÊMICO</Text>

          {loading ? (
            <ActivityIndicator size="large" color="#333" />
          ) : (
            <>
              <Text style={styles.sectionTitle}>Provas</Text>
              {renderHeader()}
              <FlatList
                data={provas}
                keyExtractor={i => String(i.id)}
                renderItem={renderProva}
                scrollEnabled={false}
              />

              <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Trabalhos</Text>
              {renderHeader()}
              <FlatList
                data={trabalhos}
                keyExtractor={i => String(i.id)}
                renderItem={renderTrabalho}
                scrollEnabled={false}
              />
            </>
          )}
        </View>
      </SafeAreaView>

      <Toast />
    </SafeAreaView>
  );
}