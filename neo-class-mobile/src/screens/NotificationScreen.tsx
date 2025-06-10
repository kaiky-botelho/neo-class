import React, { useEffect, useState, useContext, useRef } from "react";
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
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  StatusBar, // <--- KEEP THIS IMPORT!
} from "react-native";
import { useNavigation, CommonActions } from "@react-navigation/native";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import notificationStyles from "../styles/notificationStyles";
import { AxiosError } from "axios";
import Toast from 'react-native-toast-message'; // <--- Importar Toast aqui

interface ChatMessage {
  id: string;
  type: "sent" | "received";
  text: string;
  timestamp: Date;
}

interface NotificacaoDTO {
  id: number;
  texto: string;
  dataEnvio: string;
  alunoId: number;
  resposta?: string;
  dataResposta?: string;
  secretariaId?: number;
  status: "PENDENTE" | "RESPONDIDA";
}

export default function NotificationScreen() {
  const navigation = useNavigation();
  const { user, signOut } = useContext(AuthContext);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [sending, setSending] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);

  const predefinedMessages = [
    "Solicitar Histórico Escolar",
    "Solicitar Declaração de Matrícula",
    "Solicitar Segunda Via de Identidade Estudantil",
    "Solicitar Atestado de Frequência",
    "Solicitar Ementa de Disciplinas"
  ];

  const flatListRef = useRef<FlatList<ChatMessage>>(null);

  useEffect(() => {
    if (user?.id) {
      loadChatMessages();
    }
  }, [user]);

  async function loadChatMessages() {
    setLoading(true);
    try {
      const res = await api.get<NotificacaoDTO[]>("/notificacoes");
      const fetchedNotifs = res.data.filter((n) => n.alunoId === user!.id);

      const receivedResponses: ChatMessage[] = [];

      fetchedNotifs.forEach((notif) => {
        if (notif.status === "RESPONDIDA" && notif.resposta && notif.dataResposta) {
          let receivedTimestamp: Date;
          try {
            receivedTimestamp = new Date(notif.dataResposta);
            if (isNaN(receivedTimestamp.getTime())) {
              console.warn(
                "Data de resposta inválida do backend para notificação ID:",
                notif.id,
                "Data:",
                notif.dataResposta
              );
              receivedTimestamp = new Date();
            }
          } catch (e) {
            console.warn(
              "Erro ao parsear data de resposta do backend para notificação ID:",
              notif.id,
              "Data:",
              notif.dataResposta,
              "Erro:",
              e
            );
            receivedTimestamp = new Date();
          }

          receivedResponses.push({
            id: `received-${notif.id}`,
            type: "received",
            text: notif.resposta,
            timestamp: receivedTimestamp,
          });
        }
      });

      receivedResponses.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
      setChatMessages(receivedResponses);

      if (receivedResponses.length > 0) {
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
      }
    } catch (err: any) { // Captura o erro para exibir no toast
      console.error("Erro ao carregar mensagens de chat:", err);
      let errorMessage = 'Não foi possível carregar as respostas.';

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
        text1: 'Erro ao Carregar Respostas',
        text2: errorMessage,
        position: 'top',
        visibilityTime: 4000,
        autoHide: true,
      });
    } finally {
      setLoading(false);
    }
  }

  const handleSelectMessage = (messageText: string) => {
    setSelectedMessage(messageText === selectedMessage ? null : messageText);
  };

  async function handleConfirmSend() {
    if (!selectedMessage) {
      console.warn("Nenhuma mensagem selecionada para enviar.");
      // Exibe um toast para o usuário
      Toast.show({
        type: 'info', // Use 'info' ou 'error' para essa validação
        text1: 'Atenção',
        text2: 'Selecione uma mensagem para enviar.',
        position: 'top',
        visibilityTime: 3000,
        autoHide: true,
      });
      return;
    }
    setSending(true);
    Keyboard.dismiss();

    const currentLocalTime = new Date();
    const isoStringUTC = currentLocalTime.toISOString();

    console.log("Data/Hora Local ANTES de enviar (Ribeirao Preto):", currentLocalTime.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }));
    console.log("Data/Hora UTC ENVIADA para a API:", isoStringUTC);
    console.log(`[FUSO DIAGNOSE] current Date().toString(): ${currentLocalTime.toString()}`);
    console.log(`[FUSO DIAGNOSE] current Date().getTimezoneOffset(): ${currentLocalTime.getTimezoneOffset()}`);
    console.log(`[FUSO DIAGNOSE] current Date().toLocaleTimeString(): ${currentLocalTime.toLocaleTimeString()}`);


    try {
      const response = await api.post("/notificacoes", {
        texto: selectedMessage.trim(),
        dataEnvio: isoStringUTC,
        alunoId: user!.id,
        status: "PENDENTE",
      });
      console.log("Mensagem enviada com sucesso. Dados da resposta da API:", response.data);

      setSelectedMessage(null);
      await loadChatMessages(); // Recarrega todas as mensagens (incluindo a enviada e novas respostas)

      // Exibe toast de sucesso
      Toast.show({
        type: 'success',
        text1: 'Mensagem Enviada!',
        text2: 'Sua solicitação foi enviada com sucesso para a secretaria.',
        position: 'top',
        visibilityTime: 3000,
        autoHide: true,
      });

      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    } catch (err: any) { // Captura o erro para exibir no toast
      let errorMessage = 'Erro ao enviar sua mensagem.';
      if (err instanceof AxiosError) {
        console.error("Erro Axios ao enviar mensagem:", err.message);
        if (err.response) {
          console.error("Status de erro do servidor:", err.response.status);
          console.error("Dados da resposta de erro do servidor:", err.response.data);
          errorMessage = typeof err.response.data === 'string'
            ? err.response.data
            : `Erro do servidor: ${err.response.status}`;
        } else if (err.request) {
          console.error("Nenhuma resposta recebida para a requisição:", err.request);
          errorMessage = 'Erro de rede: Nenhuma resposta do servidor.';
        } else {
          console.error("Erro na configuração da requisição:", err.message);
          errorMessage = 'Erro na configuração da sua solicitação.';
        }
      } else {
        console.error("Erro inesperado ao enviar mensagem:", err);
      }

      // Exibe o toast de erro
      Toast.show({
        type: 'error',
        text1: 'Falha no Envio!',
        text2: errorMessage,
        position: 'top',
        visibilityTime: 4000,
        autoHide: true,
      });
    } finally {
      setSending(false);
    }
  }

  const renderChatItem = ({ item }: { item: ChatMessage }) => {
    if (item.type !== "received") return null;

    return (
      <View
        style={[
          notificationStyles.chatMessageContainer,
          notificationStyles.receivedMessage,
        ]}
      >
        <Text style={notificationStyles.messageText}>{item.text}</Text>
        <Text
          style={[
            notificationStyles.messageDate,
          ]}
        >
          {item.timestamp.toLocaleDateString("pt-BR", {day: '2-digit', month: '2-digit', year: 'numeric'})}
        </Text>
      </View>
    );
  };

  const openProfileModal = () => setModalVisible(true);
  const closeProfileModal = () => setModalVisible(false);
  const handleChangePassword = () => {
    closeProfileModal();
    navigation.navigate("ChangePassword" as never);
  };
  const handleLogout = () => {
    closeProfileModal();
    signOut();
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Login" as never }],
      })
    );
  };

  // Calculate topBarAndroidMargin here in the component, outside StyleSheet.create
  const topBarAndroidMargin = Platform.OS === "android" ? (StatusBar.currentHeight || 0) : 0;

  const keyboardVerticalOffset =
    Platform.OS === "ios"
      ? (notificationStyles.topBar.paddingVertical || 0) * 2 +
        topBarAndroidMargin +
        (StatusBar.currentHeight || 0)
      : 0;


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: notificationStyles.topSafe.backgroundColor }}>
      {/* Apply marginTop as an inline style */}
      <View style={[notificationStyles.topBar, { marginTop: topBarAndroidMargin }]}>
        <TouchableOpacity
          style={notificationStyles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Image
            source={require("../../assets/voltar.png")}
            style={notificationStyles.backIcon}
          />
        </TouchableOpacity>
        <View style={notificationStyles.topBarSpacer} />
        <TouchableOpacity
          style={notificationStyles.profileButton}
          onPress={openProfileModal}
        >
          <Image
            source={require("../../assets/profile.png")}
            style={notificationStyles.profileIcon}
          />
        </TouchableOpacity>
      </View>

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
            {`Olá${user?.nome ? `, ${user.nome}` : ""}`}
          </Text>
          <View style={notificationStyles.modalDivider} />
          <TouchableOpacity
            style={notificationStyles.modalButton}
            onPress={handleChangePassword}
          >
            <Text style={notificationStyles.modalButtonText}>ALTERAR SENHA</Text>
            <Image
              source={require("../../assets/cadeado.png")}
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
              source={require("../../assets/exit.png")}
              style={notificationStyles.modalButtonIcon}
            />
          </TouchableOpacity>
        </View>
      </Modal>

      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: '#FFF' }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={keyboardVerticalOffset}
      >
        {/* Section for predefined buttons and confirm button */}
        <View style={notificationStyles.predefinedButtonsSection}>
          <View style={notificationStyles.predefinedButtonsContainer}>
            {predefinedMessages.map((msg, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  notificationStyles.predefinedButton,
                  selectedMessage === msg && notificationStyles.predefinedButtonSelected,
                ]}
                onPress={() => handleSelectMessage(msg)}
                disabled={sending}
              >
                <Text style={notificationStyles.predefinedButtonText}>{msg}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[
              notificationStyles.confirmSendButton,
              (!selectedMessage || sending) && notificationStyles.confirmSendButtonDisabled,
            ]}
            onPress={handleConfirmSend}
            disabled={!selectedMessage || sending}
          >
            {sending ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text style={notificationStyles.confirmSendButtonText}>Confirmar Envio</Text>
            )}
          </TouchableOpacity>
        </View>


        {/* Respostas da Secretaria Section */}
        <Text style={notificationStyles.historyHeader}>Caixa de Entrada da Secretaria</Text>
        {loading ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: '#FFF' }}>
            <ActivityIndicator size="large" color="#EAAD3B" />
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={chatMessages}
            keyExtractor={(item) => item.id}
            renderItem={renderChatItem}
            contentContainerStyle={notificationStyles.mainContentContainer}
            ListEmptyComponent={
              <Text style={notificationStyles.emptyChatText}>
                Nenhuma resposta da secretaria ainda.
              </Text>
            }
            keyboardShouldPersistTaps="handled"
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}