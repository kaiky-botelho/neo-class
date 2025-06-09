// src/screens/NotificationScreen.tsx
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
  TextInput,
} from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import notificationStyles from '../styles/notificationStyles';

interface NotificacaoDTO {
  id: number;
  texto: string;
  dataEnvio: string;
  alunoId: number;
  resposta?: string;
  dataResposta?: string;
  secretariaId?: number;
  status: 'PENDENTE' | 'RESPONDIDA';
}

export default function NotificationScreen() {
  const navigation = useNavigation();
  const { user, signOut } = useContext(AuthContext);

  const [notifs, setNotifs] = useState<NotificacaoDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadNotifications();
    }
  }, [user]);

  async function loadNotifications() {
    setLoading(true);
    try {
      const res = await api.get<NotificacaoDTO[]>('/notificacoes');
      setNotifs(res.data.filter(n => n.alunoId === user!.id));
    } catch (err) {
      console.log('Erro ao carregar notificações:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSend() {
    if (!message.trim()) return;
    setSending(true);
    try {
      await api.post('/notificacoes', {
        texto: message.trim(),
        dataEnvio: new Date().toISOString(),
        alunoId: user!.id,
        status: 'PENDENTE',
      });
      setMessage('');
      loadNotifications();
    } catch (err) {
      console.log('Erro ao enviar notificação:', err);
    } finally {
      setSending(false);
    }
  }

  const pendentes = notifs.filter(n => n.status === 'PENDENTE');
  const respondidas = notifs.filter(n => n.status === 'RESPONDIDA');

  function renderHeader() {
    return (
      <View style={notificationStyles.tableHeader}>
        <Text style={[notificationStyles.headerCell, { flex: 2 }]}>Mensagem</Text>
        <Text style={notificationStyles.headerCell}>Data</Text>
        <Text style={notificationStyles.headerCell}>Status</Text>
      </View>
    );
  }

  function renderSentItem({ item }: { item: NotificacaoDTO }) {
    return (
      <View style={[notificationStyles.tableRow, notificationStyles.sentRow]}>
        <Text style={[notificationStyles.cell, { flex: 2 }]}>{item.texto}</Text>
        <Text style={notificationStyles.cell}>
          {new Date(item.dataEnvio).toLocaleDateString('pt-BR')}
        </Text>
        <Text style={notificationStyles.cell}>
          {item.status === 'PENDENTE' ? 'Enviada' : 'Respondida'}
        </Text>
      </View>
    );
  }

  function renderResponseItem({ item }: { item: NotificacaoDTO }) {
    return (
      <View style={notificationStyles.responseRow}>
        <Text style={notificationStyles.responseText}>{item.resposta}</Text>
        <Text style={notificationStyles.responseDate}>
          {item.dataResposta
            ? new Date(item.dataResposta).toLocaleDateString('pt-BR')
            : ''}
        </Text>
      </View>
    );
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
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Login' as never }],
      })
    );
  };

  return (
    <>
      {/* Header / Modal */}
      <SafeAreaView style={notificationStyles.topSafe}>
        <View style={notificationStyles.topBar}>
          <TouchableOpacity
            style={notificationStyles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Image
              source={require('../../assets/voltar.png')}
              style={notificationStyles.backIcon}
            />
          </TouchableOpacity>
          <View style={notificationStyles.topBarSpacer} />
          <TouchableOpacity
            style={notificationStyles.profileButton}
            onPress={openProfileModal}
          >
            <Image
              source={require('../../assets/profile.png')}
              style={notificationStyles.profileIcon}
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
          <View style={notificationStyles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={notificationStyles.modalContainer}>
          <Text style={notificationStyles.modalHeader}>
            {`Olá${user?.nome ? `, ${user.nome}` : ''}`}
          </Text>
          <View style={notificationStyles.modalDivider} />
          <TouchableOpacity
            style={notificationStyles.modalButton}
            onPress={handleChangePassword}
          >
            <Text style={notificationStyles.modalButtonText}>
              ALTERAR SENHA
            </Text>
            <Image
              source={require('../../assets/cadeado.png')}
              style={notificationStyles.modalButtonIcon}
            />
          </TouchableOpacity>
          <View style={notificationStyles.modalDivider} />
          <TouchableOpacity
            style={notificationStyles.modalButton}
            onPress={handleLogout}
          >
            <Text style={notificationStyles.modalButtonText}>SAIR</Text>
            <Image
              source={require('../../assets/exit.png')}
              style={notificationStyles.modalButtonIcon}
            />
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Conteúdo */}
      <SafeAreaView style={notificationStyles.container}>
        <Text style={notificationStyles.title}>Notificações enviadas</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#EAAD3B" />
        ) : (
          <>
            {renderHeader()}
            <FlatList
              data={pendentes}
              keyExtractor={i => i.id.toString()}
              renderItem={renderSentItem}
              scrollEnabled={false}
            />
          </>
        )}

        <Text style={[notificationStyles.title, { marginTop: 24 }]}>
          Notificações respondidas
        </Text>
        {!loading && (
          <FlatList
            data={respondidas}
            keyExtractor={i => i.id.toString()}
            renderItem={renderResponseItem}
            ListEmptyComponent={
              <Text style={notificationStyles.emptyText}>
                Nenhuma resposta ainda
              </Text>
            }
          />
        )}
      </SafeAreaView>

      {/* Input + Botão enviar */}
      <View style={notificationStyles.inputContainer}>
        <TextInput
          style={notificationStyles.textInput}
          placeholder="Digite sua mensagem..."
          placeholderTextColor="#999"
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity
          style={[
            notificationStyles.sendButton,
            sending && notificationStyles.sendButtonDisabled,
          ]}
          onPress={handleSend}
          disabled={sending}
        >
          <Image
            source={require('../../assets/arrow.png')}
            style={notificationStyles.sendIcon}
          />
        </TouchableOpacity>
      </View>
    </>
  );
}
