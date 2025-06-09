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
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  StatusBar,
} from "react-native";
import { useNavigation, CommonActions } from "@react-navigation/native";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import notificationStyles from "../styles/notificationStyles";
import { AxiosError } from 'axios';

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
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

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

      const newChatMessages: ChatMessage[] = [];

      fetchedNotifs.forEach((notif) => {
        let sentTimestamp: Date;
        try {
          sentTimestamp = new Date(notif.dataEnvio);
          if (isNaN(sentTimestamp.getTime())) {
            console.warn("Data de envio inválida do backend para notificação ID:", notif.id, "Data:", notif.dataEnvio);
            sentTimestamp = new Date();
          }
        } catch (e) {
          console.warn("Erro ao parsear data de envio do backend para notificação ID:", notif.id, "Data:", notif.dataEnvio, "Erro:", e);
          sentTimestamp = new Date();
        }

        newChatMessages.push({
          id: `sent-${notif.id}`,
          type: "sent",
          text: notif.texto,
          timestamp: sentTimestamp,
        });

        if (notif.status === "RESPONDIDA" && notif.resposta && notif.dataResposta) {
          let receivedTimestamp: Date;
          try {
            receivedTimestamp = new Date(notif.dataResposta);
            if (isNaN(receivedTimestamp.getTime())) {
                console.warn("Data de resposta inválida do backend para notificação ID:", notif.id, "Data:", notif.dataResposta);
                receivedTimestamp = new Date();
            }
          } catch (e) {
            console.warn("Erro ao parsear data de resposta do backend para notificação ID:", notif.id, "Data:", notif.dataResposta, "Erro:", e);
            receivedTimestamp = new Date();
          }

          newChatMessages.push({
            id: `received-${notif.id}`,
            type: "received",
            text: notif.resposta,
            timestamp: receivedTimestamp,
          });
        }
      });

      newChatMessages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
      setChatMessages(newChatMessages);

      if (newChatMessages.length > 0) {
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
      }
    } catch (err) {
      console.error("Erro ao carregar mensagens de chat:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSend() {
    if (!message.trim()) return;
    setSending(true);
    Keyboard.dismiss();

    const currentLocalTime = new Date();
    const isoStringUTC = currentLocalTime.toISOString();

    console.log("Data/Hora Local ANTES de enviar:", currentLocalTime.toLocaleString());
    console.log("Data/Hora UTC ENVIADA para a API:", isoStringUTC);
    const testDate = new Date();
    console.log(`[FUSO DIAGNOSE] current Date().toString(): ${testDate.toString()}`);
    console.log(`[FUSO DIAGNOSE] current Date().getTimezoneOffset(): ${testDate.getTimezoneOffset()}`);
    console.log(`[FUSO DIAGNOSE] current Date().toLocaleTimeString(): ${testDate.toLocaleTimeString()}`);


    try {
      const response = await api.post("/notificacoes", {
        texto: message.trim(),
        dataEnvio: isoStringUTC,
        alunoId: user!.id,
        status: "PENDENTE",
      });
      console.log("Mensagem enviada com sucesso. Dados da resposta da API:", response.data);

      setMessage("");
      await loadChatMessages();

      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    } catch (err) {
      if (err instanceof AxiosError) {
        console.error("Erro Axios ao enviar mensagem:", err.message);
        if (err.response) {
          console.error("Status de erro do servidor:", err.response.status);
          console.error("Dados da resposta de erro do servidor:", err.response.data);
        } else if (err.request) {
          console.error("Nenhuma resposta recebida para a requisição:", err.request);
        } else {
          console.error("Erro na configuração da requisição:", err.message);
        }
      } else {
        console.error("Erro inesperado ao enviar mensagem:", err);
      }
    } finally {
      setSending(false);
    }
  }

  const renderChatItem = ({ item }: { item: ChatMessage }) => {
    const isSent = item.type === "sent";

    console.log(`[RENDER] ID: ${item.id}, Type: ${item.type}`);
    console.log(`[RENDER] Timestamp Objeto: ${item.timestamp}`);
    console.log(`[RENDER] Timestamp ISO (interno): ${item.timestamp.toISOString()}`);
    console.log(`[RENDER] Timestamp Local (exibição): ${item.timestamp.toLocaleDateString("pt-BR")} ${item.timestamp.toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' })}`);


    return (
      <View
        style={[
          notificationStyles.chatMessageContainer,
          isSent ? notificationStyles.sentMessage : notificationStyles.receivedMessage,
        ]}
      >
        <Text style={notificationStyles.messageText}>{item.text}</Text>
        <Text
          style={[
            notificationStyles.messageDate,
            !isSent && notificationStyles.receivedMessageDate,
          ]}
        >
          {item.timestamp.toLocaleDateString("pt-BR")}
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

  const keyboardVerticalOffset = Platform.OS === 'ios'
    ? (notificationStyles.topBar.paddingVertical || 0) * 2 + (notificationStyles.topBar.marginTop || 0) + (StatusBar.currentHeight || 0)
    : 0;


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: notificationStyles.topSafe.backgroundColor }}>
      <View style={notificationStyles.topBar}>
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
            <Text style={notificationStyles.modalButtonText}>
              ALTERAR SENHA
            </Text>
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
        {/* FlatList agora diretamente dentro do KeyboardAvoidingView, com justifyContent no contentContainerStyle */}
        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#EAAD3B" />
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={chatMessages}
            keyExtractor={(item) => item.id}
            renderItem={renderChatItem}
            // AQUI A MUDANÇA MAIS IMPORTANTE: Aplicar justifyContent: 'flex-end' diretamente no contentContainerStyle
            contentContainerStyle={[notificationStyles.mainContentContainer, { justifyContent: 'flex-end' }]}
            inverted={true}
            ListEmptyComponent={
              <Text style={notificationStyles.emptyChatText}>
                Inicie uma conversa ou aguarde uma mensagem.
              </Text>
            }
            keyboardShouldPersistTaps="handled"
          />
        )}

        <View style={notificationStyles.bottomInputContainer}>
          <TextInput
            style={notificationStyles.textInput}
            placeholder="Digite sua mensagem..."
            placeholderTextColor="#999"
            value={message}
            onChangeText={setMessage}
            returnKeyType="send"
            onSubmitEditing={handleSend}
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
              source={require("../../assets/arrow.png")}
              style={notificationStyles.sendIcon}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}