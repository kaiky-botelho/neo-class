// src/screens/HomeScreen.tsx
import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Image,
  StatusBar,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import {
  useNavigation,
  CommonActions
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { AuthContext } from "../context/AuthContext";
import homeStyles from "../styles/homeStyles";

// **Aqui** importamos o tipo do stack, que agora está exportado de App.tsx:
import { RootStackParamList } from "../../App";

// Defina o tipo de navegação para esta tela:
type HomeNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Home"
>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeNavigationProp>();
  const { signOut } = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);

  // 1) Configurar LocaleConfig em português (pt-BR)
  LocaleConfig.locales["pt"] = {
    monthNames: [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
    ],
    monthNamesShort: [
      "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
      "Jul", "Ago", "Set", "Out", "Nov", "Dez",
    ],
    dayNames: [
      "Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira",
      "Quinta-feira", "Sexta-feira", "Sábado",
    ],
    dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
    today: "Hoje",
  };
  LocaleConfig.defaultLocale = "pt";

  // 2) Função para obter “hoje” no fuso “America/Sao_Paulo” sem libs externas
  const getTodayBrazilString = (): string => {
    const now = new Date();
    const utcMillis = now.getTime() + now.getTimezoneOffset() * 60000;
    const brasilOffset = -3 * 60 * 60 * 1000; // UTC-3
    const brasilDate = new Date(utcMillis + brasilOffset);
    return brasilDate.toISOString().split("T")[0]; // “YYYY-MM-DD”
  };

  // String “YYYY-MM-DD” de hoje em Brasília
  const todayString = getTodayBrazilString();

  // Forçar destaque apenas em todayString (ex.: “2025-06-02”)
  const markedDates = {
    [todayString]: {
      selected: true,
      selectedColor: "#E6BC51",
    },
  };

  // Handler de clique num dia
  const onDayPress = (day: { dateString: string }) => {
    console.log("Dia selecionado:", day.dateString);
  };

  // Abre o modal de perfil
  const openProfileModal = () => {
    setModalVisible(true);
  };

  // Fecha o modal
  const closeProfileModal = () => {
    setModalVisible(false);
  };

  // Navega para a tela de Alterar Senha (depois você criará essa tela)
  const handleChangePassword = () => {
    closeProfileModal();
    navigation.navigate("ChangePassword");
  };

  // Faz logout limpando credenciais e voltando para a tela de Login
  const handleLogout = () => {
    closeProfileModal();
    signOut();
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Login" }],
      })
    );
  };

  return (
    <>
      {/* StatusBar em modo claro sobre fundo escuro */}
      <StatusBar barStyle="light-content" backgroundColor="#333C56" />

      {/* SafeAreaView superior (notch/status bar) */}
      <SafeAreaView style={homeStyles.topSafe}>
        <View style={homeStyles.topBar}>
          <View style={homeStyles.topBarSpacer} />
          <TouchableOpacity
            style={homeStyles.profileButton}
            onPress={openProfileModal}
          >
            <Image
              source={require("../../assets/profile.png")}
              style={homeStyles.profileIcon}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Modal de perfil */}
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent
        onRequestClose={closeProfileModal}
      >
        <TouchableWithoutFeedback onPress={closeProfileModal}>
          <View style={homeStyles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={homeStyles.modalContainer}>
          <Text style={homeStyles.modalHeader}>OLÁ</Text>
          <View style={homeStyles.modalDivider} />

          <TouchableOpacity
            style={homeStyles.modalButton}
            onPress={handleChangePassword}
          >
            <Text style={homeStyles.modalButtonText}>ALTERAR SENHA</Text>
            <Image
              source={require("../../assets/cadeado.png")}
              style={homeStyles.modalButtonIcon}
            />
          </TouchableOpacity>
          <View style={homeStyles.modalDivider} />

          <TouchableOpacity style={homeStyles.modalButton} onPress={handleLogout}>
            <Text style={homeStyles.modalButtonText}>SAIR</Text>
            <Image
              source={require("../../assets/exit.png")}
              style={homeStyles.modalButtonIcon}
            />
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Conteúdo principal */}
      <SafeAreaView style={homeStyles.bottomSafe}>
        {/* CALENDÁRIO */}
        <View style={homeStyles.calendarContainer}>
          <Calendar
            current={todayString}
            onDayPress={onDayPress}
            markedDates={markedDates}
            theme={{
              arrowColor: "#2D2D2D",
              todayTextColor: "#2D2D2D",
              dayTextColor: "#2D2D2D",
              textDayFontFamily:
                Platform.OS === "android" ? "Roboto" : undefined,
              textMonthFontWeight: "bold",
              monthTextColor: "#2D2D2D",
              textDisabledColor: "#2D2D2D",
              selectedDayBackgroundColor: "#FFF",
              selectedDayTextColor: "#2D2D2D",
            }}
            style={homeStyles.calendar}
            firstDay={1}
          />
        </View>

        {/* BOTÃO “CALENDÁRIO ACADÊMICO” */}
        <TouchableOpacity
          style={homeStyles.calendarButton}
          onPress={() => {
            /* ação do calendário acadêmico */
          }}
        >
          <Text style={homeStyles.calendarButtonText}>
            Calendário acadêmico
          </Text>
          <Image
            source={require("../../assets/arrow.png")}
            style={homeStyles.arrowIcon}
          />
        </TouchableOpacity>

        {/* DISTRIBUIÇÃO DE BOTÕES */}
        <View style={homeStyles.buttonsWrapper}>
          {/* 4.1 DISCIPLINAS */}
          <TouchableOpacity
            style={[homeStyles.discButton, homeStyles.discButtonBlue]}
            onPress={() => {
              /* ação Disciplinas */
            }}
          >
            <Image
              source={require("../../assets/triangulo_inferior.png")}
              style={[
                homeStyles.discButtonTriangleTop,
                homeStyles.triangleDecor,
              ]}
            />
            <Image
              source={require("../../assets/triangulo_superior.png")}
              style={[
                homeStyles.discButtonTriangleBottom,
                homeStyles.triangleDecor,
              ]}
            />
            <Image
              source={require("../../assets/disciplinas.png")}
              style={homeStyles.discIcon}
            />
            <View style={homeStyles.discTextWrapper}>
              <Text style={homeStyles.discText}>Disciplinas</Text>
            </View>
          </TouchableOpacity>

          {/* 4.2 COLUNA DIREITA */}
          <View style={homeStyles.rightColumn}>
            <TouchableOpacity
              style={[homeStyles.smallButton, homeStyles.smallButtonWhite]}
              onPress={() => {
                /* ação Notas */
              }}
            >
              <Image
                source={require("../../assets/notas.png")}
                style={homeStyles.smallIcon}
              />
              <Text style={[homeStyles.smallText, { color: "#333" }]}>
                Notas
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[homeStyles.smallButton, homeStyles.smallButtonRed]}
              onPress={() => navigation.navigate("Lack")}
            >
              <Image
                source={require("../../assets/trianguloFalta.png")}
                style={[homeStyles.faltaTriangle, homeStyles.triangleDecor]}
              />
              <Text style={[homeStyles.smallText, { color: "#2D2D2D" }]}>
                Faltas
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* BOTÃO “SUPORTE” */}
        <TouchableOpacity
          style={[homeStyles.supportButton, homeStyles.supportButtonGrey]}
          onPress={() => {
            /* ação Suporte */
          }}
        >
          <Image
            source={require("../../assets/trianguloEsquerdo.png")}
            style={[homeStyles.supportTriangleLeft, homeStyles.triangleDecor]}
          />
          <Text style={homeStyles.supportText}>Suporte</Text>
          <Image
            source={require("../../assets/suporte.png")}
            style={homeStyles.supportIcon}
          />
          <Image
            source={require("../../assets/trianguloDireito.png")}
            style={[homeStyles.supportTriangleRight, homeStyles.triangleDecor]}
          />
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
}
