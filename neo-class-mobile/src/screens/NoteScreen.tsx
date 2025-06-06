// src/screens/NoteScreen.tsx
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

// Supondo que seu tipo de DTO seja algo assim:
export interface NotaDTO {
  materiaId:   number;
  materiaNome: string;
  nota1:       number;
  nota2:       number;
  nota3:       number;
  nota4:       number;
}

import lackStyles from '../styles/lackStyles'; // Reaproveitamos o mesmo estilo de header/modal

export default function NoteScreen() {
  const navigation = useNavigation();
  const { user, signOut } = useContext(AuthContext);

  const [notas, setNotas] = useState<NotaDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [modalVisible, setModalVisible] = useState(false);

  // 1. Assim que o usuário (“user”) estiver disponível, buscamos as notas
  useEffect(() => {
    if (user && user.id) {
      buscarNotasPorAluno(user.id);
    }
  }, [user]);

  async function buscarNotasPorAluno(alunoId: number) {
    setLoading(true);
    setError('');
    try {
      // Exemplo de endpoint: GET /api/notas/aluno/{alunoId}
      const response = await api.get<NotaDTO[]>(`/notas/aluno/${alunoId}`);
      setNotas(response.data);
    } catch (err: any) {
      console.log('Erro ao buscar notas:', err);
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

  // 2. Funções do Modal de perfil
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
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Login' as never }],
      })
    );
  };

  // 3. Monta o cabeçalho da “tabela” (linha fixa)
  function renderHeader() {
    return (
      <View style={innerStyles.tableHeader}>
        <Text style={[innerStyles.headerCell, { flex: 2 }]}>Matéria</Text>
        <Text style={innerStyles.headerCell}>1B</Text>
        <Text style={innerStyles.headerCell}>2B</Text>
        <Text style={innerStyles.headerCell}>3B</Text>
        <Text style={innerStyles.headerCell}>4B</Text>
      </View>
    );
  }

  // 4. Render de cada linha da tabela: uma matéria + 4 notas
  const renderItem = ({ item }: { item: NotaDTO }) => (
    <View style={innerStyles.tableRow}>
      <Text style={[innerStyles.cell, { flex: 2 }]}>{item.materiaNome}</Text>
      <Text style={innerStyles.cell}>{item.nota1}</Text>
      <Text style={innerStyles.cell}>{item.nota2}</Text>
      <Text style={innerStyles.cell}>{item.nota3}</Text>
      <Text style={innerStyles.cell}>{item.nota4}</Text>
    </View>
  );

  return (
    <>
      {/* === 1. SafeAreaView superior (fundo escuro) com botão “voltar” e ícone de perfil === */}
      <SafeAreaView style={lackStyles.topSafe}>
        <View style={lackStyles.topBar}>
          {/* Botão voltar para Home */}
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

          {/* Ícone de perfil para abrir modal */}
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

      {/* === 2. Modal de perfil === */}
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

      {/* === 3. SafeAreaView principal (conteúdo) === */}
      <SafeAreaView style={innerStyles.bottomSafe}>
        <View style={innerStyles.container}>
          <Text style={innerStyles.title}>DETALHAMENTO NOTAS</Text>

          {loading ? (
            <ActivityIndicator size="large" color="#EA0000" />
          ) : error ? (
            <Text style={innerStyles.errorText}>{error}</Text>
          ) : (
            <View style={{ flex: 1 }}>
              {/* Cabeçalho fixo da tabela */}
              {renderHeader()}

              {/* Lista as linhas com as notas */}
              <FlatList
                data={notas}
                keyExtractor={(item) => item.materiaId.toString()}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={innerStyles.listContainer}
              />
            </View>
          )}
        </View>
      </SafeAreaView>
    </>
  );
}

// 4. Estilos internos da NoteScreen (tabela, título, etc.)
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
  title: {
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
  // Estilo da linha de cabeçalho
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#EEE',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  headerCell: {
    flex: 1,
    fontWeight: '700',
    fontSize: 14,
    textAlign: 'center',
    color: '#333',
  },
  // Estilo de cada linha de dados
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#F9F9F9',
    borderBottomWidth: 1,
    borderColor: '#DDD',
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  cell: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
});
