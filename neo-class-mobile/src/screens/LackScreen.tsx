// src/screens/LackScreen.tsx
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
  StyleSheet,
} from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { FaltaDTO } from '../types/falta';
import lackStyles from '../styles/lackStyles';

export default function LackScreen() {
  const navigation = useNavigation();
  const { user, signOut } = useContext(AuthContext);

  const [faltas, setFaltas] = useState<FaltaDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [modalVisible, setModalVisible] = useState(false);

  // Assim que o user estiver disponível (ou mudar), buscamos as faltas
  useEffect(() => {
    if (user && user.id) {
      buscarFaltasPorAluno(user.id);
    }
  }, [user]);

  async function buscarFaltasPorAluno(alunoId: number) {
    setLoading(true);
    setError('');
    try {
      // Passamos o ID do aluno para o endpoint de faltas agrupadas:
      // GET /api/frequencias/faltas/{alunoId}
      const response = await api.get<FaltaDTO[]>(
        `/frequencias/faltas/${alunoId}`
      );
      setFaltas(response.data);
    } catch (err: any) {
      console.log('Erro ao buscar faltas:', err);
      if (err.response) {
        setError(
          typeof err.response.data === 'string'
            ? err.response.data
            : `Erro ${err.response.status}`
        );
      } else {
        setError('Falha de rede ou servidor');
      }
    } finally {
      setLoading(false);
    }
  }

  // ---------- Modal de perfil (trocar senha / logout) ----------
  const openProfileModal = () => setModalVisible(true);
  const closeProfileModal = () => setModalVisible(false);

  const handleChangePassword = () => {
    closeProfileModal();
    // supondo que você tenha uma rota "ChangePassword"
    navigation.navigate('ChangePassword' as never);
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

  // Renderiza cada item da lista: matéria + número de faltas
  const renderItem = ({ item }: { item: FaltaDTO }) => (
    <View style={innerStyles.listItem}>
      <Text style={innerStyles.subjectText}>{item.materiaNome}</Text>
      <View style={innerStyles.badge}>
        <Text style={innerStyles.badgeText}>{item.totalFaltas}</Text>
      </View>
    </View>
  );

  return (
    <>
      {/* === 1. SafeAreaView superior (fundo escuro) com botão Voltar e Perfil === */}
      <SafeAreaView style={lackStyles.topSafe}>
        <View style={lackStyles.topBar}>
          {/* Botão "voltar" */}
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

          {/* Ícone de perfil que abre o modal */}
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

      {/* === 2. Modal de Perfil === */}
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
          {/* Exibe “Olá, {nome}” puxando diretamente de user.nome */}
          <Text style={lackStyles.modalHeader}>
            {`Olá${user?.nome ? `, ${user.nome}` : ''}`}
          </Text>
          <View style={lackStyles.modalDivider} />

          {/* Botão “Alterar Senha” */}
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

          {/* Botão “Sair” */}
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

      {/* === 3. SafeAreaView principal (conteúdo) === */}
      <SafeAreaView style={innerStyles.bottomSafe}>
        <View style={innerStyles.container}>
          <Text style={innerStyles.headerTitle}>FALTAS</Text>

          {loading ? (
            <ActivityIndicator size="large" color="#EB5757" />
          ) : error ? (
            <Text style={innerStyles.errorText}>{error}</Text>
          ) : (
            <FlatList
              data={faltas}
              keyExtractor={(item) => item.materiaId.toString()}
              renderItem={renderItem}
              contentContainerStyle={innerStyles.listContainer}
            />
          )}
        </View>
      </SafeAreaView>
    </>
  );
}

const innerStyles = StyleSheet.create({
  bottomSafe: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingTop: Platform.OS === 'android' ? 24 : 0,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
    color: '#333',
  },
  errorText: {
    color: '#f66',
    textAlign: 'center',
    marginTop: 16,
  },
  listContainer: {
    paddingBottom: 24,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F3F3',
    borderRadius: 8,
    marginVertical: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  subjectText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  badge: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#EB5757',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#FFF',
    fontWeight: '700',
  },
});
