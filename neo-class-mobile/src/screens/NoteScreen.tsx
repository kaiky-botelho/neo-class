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
import noteStyles from '../styles/noteStyles';
import Toast from 'react-native-toast-message';

// tipos vindos da API
type RawNotaDTO = {
  id: number;
  bimestre: number;
  valor: number;
  turmaId: number;
  alunoId: number;
  materiaId: number;
};

type MateriaDTO = {
  id: number;
  nome: string;
};

export interface NotaDTO {
  materiaId:    number;
  materiaNome: string;
  nota1:        number;
  nota2:        number;
  nota3:        number;
  nota4:        number;
}

export default function NoteScreen() {
  const navigation = useNavigation();
  const { user, loading: authLoading, signOut } = useContext(AuthContext);

  const [rawNotas, setRawNotas] = useState<RawNotaDTO[]>([]);
  const [materias, setMaterias] = useState<MateriaDTO[]>([]);
  const [notas, setNotas] = useState<NotaDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (!authLoading && user?.id) {
      setLoading(true);
      Promise.all([
        api.get<RawNotaDTO[]>('/notas'),
        api.get<MateriaDTO[]>('/materias'),
      ])
        .then(([notasRes, matRes]) => {
          setRawNotas(notasRes.data);
          setMaterias(matRes.data);
        })
        .catch(err => {
          console.log('Erro ao buscar dados:', err);
          let errorMessage = 'Falha ao carregar dados de notas.';
          if (err.response && typeof err.response.data === 'string') {
            errorMessage = err.response.data;
          } else if (err.message === 'Network Error') {
            errorMessage = 'Erro de conexão: Verifique sua internet.';
          }
          Toast.show({
            type: 'error',
            text1: 'Erro ao Carregar Notas',
            text2: errorMessage,
            position: 'top',
            visibilityTime: 4000,
            autoHide: true,
          });
        })
        .finally(() => setLoading(false));
    }
  }, [authLoading, user]);

  useEffect(() => {
    if (rawNotas.length && materias.length && user?.id) {
      const nomeMap = new Map<number, string>();
      materias.forEach(m => nomeMap.set(m.id, m.nome));

      const temp: Record<number, NotaDTO> = {};
      rawNotas
        .filter(n => n.alunoId === user.id)
        .forEach(n => {
          if (!temp[n.materiaId]) {
            temp[n.materiaId] = {
              materiaId: n.materiaId,
              materiaNome: nomeMap.get(n.materiaId) ?? `#${n.materiaId}`,
              nota1: 0,
              nota2: 0,
              nota3: 0,
              nota4: 0,
            };
          }
          switch (n.bimestre) {
            case 1:
              temp[n.materiaId].nota1 = n.valor;
              break;
            case 2:
              temp[n.materiaId].nota2 = n.valor;
              break;
            case 3:
              temp[n.materiaId].nota3 = n.valor;
              break;
            case 4:
              temp[n.materiaId].nota4 = n.valor;
              break;
          }
        });

      setNotas(Object.values(temp));
    }
  }, [rawNotas, materias, user]);

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
  const bottomSafeAndroidPaddingTop = 0;

  const renderHeader = () => (
    <View style={noteStyles.tableHeader}>
      <Text style={[noteStyles.headerCell, { flex: 2 }]}>Matéria</Text>
      <Text style={noteStyles.headerCell}>1B</Text>
      <Text style={noteStyles.headerCell}>2B</Text>
      <Text style={noteStyles.headerCell}>3B</Text>
      <Text style={noteStyles.headerCell}>4B</Text>
    </View>
  );

  const renderItem = ({ item }: { item: NotaDTO }) => (
    <View style={noteStyles.tableRow}>
      <Text style={[noteStyles.cell, { flex: 2 }]}>{item.materiaNome}</Text>
      <Text style={noteStyles.cell}>{item.nota1}</Text>
      <Text style={noteStyles.cell}>{item.nota2}</Text>
      <Text style={noteStyles.cell}>{item.nota3}</Text>
      <Text style={noteStyles.cell}>{item.nota4}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={noteStyles.topSafe}>
        <View style={[noteStyles.topBar, { marginTop: topBarAndroidMargin }]}> 
          <TouchableOpacity
            style={noteStyles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Image
              source={require('../../assets/voltar.png')}
              style={noteStyles.backIcon}
            />
          </TouchableOpacity>
          <View style={noteStyles.topBarSpacer} />
          <TouchableOpacity
            style={noteStyles.profileButton}
            onPress={openProfileModal}
          >
            <Image
              source={require('../../assets/profile.png')}
              style={noteStyles.profileIcon}
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
        <View style={{ flex: 1 }}>
          <TouchableWithoutFeedback onPress={closeProfileModal}>
            <View style={noteStyles.modalOverlay} />
          </TouchableWithoutFeedback>
          <View style={noteStyles.modalContainer}>
            <Text style={noteStyles.modalHeader}>
              {`Olá${user?.nome ? `, ${user.nome}` : ''}`}
            </Text>
            <View style={noteStyles.modalDivider} />
            <TouchableOpacity
              style={noteStyles.modalButton}
              onPress={handleChangePassword}
            >
              <Text style={noteStyles.modalButtonText}>ALTERAR SENHA</Text>
              <Image
                source={require('../../assets/cadeado.png')}
                style={noteStyles.modalButtonIcon}
              />
            </TouchableOpacity>
            <View style={noteStyles.modalDivider} />
            <TouchableOpacity
              style={noteStyles.modalButton}
              onPress={handleLogout}
            >
              <Text style={noteStyles.modalButtonText}>SAIR</Text>
              <Image
                source={require('../../assets/exit.png')}
                style={noteStyles.modalButtonIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <SafeAreaView style={[noteStyles.bottomSafe, { flex: 1, paddingTop: bottomSafeAndroidPaddingTop }]}> 
        <View style={noteStyles.container}>
          <Text style={noteStyles.title}>DETALHAMENTO NOTAS</Text>

          {loading ? (
            <ActivityIndicator size="large" color="#EA0000" />
          ) : (
            <View style={{ flex: 1 }}>
              {renderHeader()}
              <FlatList
                data={notas}
                keyExtractor={item => item.materiaId.toString()}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={noteStyles.listContainer}
                ListEmptyComponent={!loading && notas.length === 0 ? (
                  <Text style={noteStyles.noDataText}>Nenhuma nota registrada.</Text>
                ) : null}
              />
            </View>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}
