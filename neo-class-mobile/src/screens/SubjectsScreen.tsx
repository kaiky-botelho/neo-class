// src/screens/SubjectsScreen.tsx
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
} from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import lackStyles from '../styles/lackStyles';
import subjectsStyles from '../styles/subjectsStyles';

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
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (!authLoading && user?.turmaId) {
      setLoading(true);
      api.get<MateriaDTO[]>('/materias')
        .then(res => {
          setMaterias(
            res.data.filter(m => m.turmaId === user.turmaId)
          );
        })
        .catch(err => {
          console.log('Erro ao carregar disciplinas:', err);
          setError('Não foi possível carregar disciplinas');
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

  return (
    <>
      {/* Header / Modal (igual às outras telas) */}
      <SafeAreaView style={lackStyles.topSafe}>
        <View style={lackStyles.topBar}>
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
            <Text style={lackStyles.modalButtonText}>ALTERAR SENHA</Text>
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

      {/* Conteúdo principal */}
      <SafeAreaView style={subjectsStyles.bottomSafe}>
        <View style={subjectsStyles.container}>
          <Text style={subjectsStyles.title}>DISCIPLINAS</Text>

          {loading ? (
            <ActivityIndicator size="large" color="#333" />
          ) : error ? (
            <Text style={subjectsStyles.errorText}>{error}</Text>
          ) : (
            <FlatList
              data={materias}
              keyExtractor={m => String(m.id)}
              renderItem={renderItem}
              contentContainerStyle={subjectsStyles.listContainer}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </SafeAreaView>
    </>
  );
}
