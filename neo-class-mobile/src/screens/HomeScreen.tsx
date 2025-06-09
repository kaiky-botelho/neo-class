// src/screens/HomeScreen.tsx
import React, { useContext, useState, useEffect } from "react";
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
  TextInput,
  Alert,
} from "react-native";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { AuthContext } from "../context/AuthContext";
import homeStyles from "../styles/homeStyles";
import { RootStackParamList } from "../../App";

type HomeNavigationProp = NativeStackNavigationProp<RootStackParamList, "Home">;

export default function HomeScreen() {
  const navigation = useNavigation<HomeNavigationProp>();
  const { user, signOut, changePassword } = useContext(AuthContext);

  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [pwModalVisible, setPwModalVisible] = useState(false);
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [pwError, setPwError] = useState("");

  // configura calendário em pt-BR
  useEffect(() => {
    LocaleConfig.locales["pt"] = {
      monthNames: [
        "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
        "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"
      ],
      monthNamesShort: [
        "Jan","Fev","Mar","Abr","Mai","Jun",
        "Jul","Ago","Set","Out","Nov","Dez"
      ],
      dayNames: [
        "Domingo","Segunda-feira","Terça-feira","Quarta-feira",
        "Quinta-feira","Sexta-feira","Sábado"
      ],
      dayNamesShort: ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"],
      today: "Hoje",
    };
    LocaleConfig.defaultLocale = "pt";
  }, []);

  const getTodayBrazilString = (): string => {
    const now = new Date();
    const utcMillis = now.getTime() + now.getTimezoneOffset() * 60000;
    const brasilOffset = -3 * 60 * 60 * 1000;
    const brasilDate = new Date(utcMillis + brasilOffset);
    return brasilDate.toISOString().split("T")[0];
  };
  const todayString = getTodayBrazilString();
  const markedDates = {
    [todayString]: { selected: true, selectedColor: "#E6BC51" },
  };

  const openProfileModal = () => setProfileModalVisible(true);
  const closeProfileModal = () => setProfileModalVisible(false);

  const openPwModal = () => {
    closeProfileModal();
    setNewPass("");
    setConfirmPass("");
    setPwError("");
    setPwModalVisible(true);
  };
  const closePwModal = () => setPwModalVisible(false);

  const handleLogout = () => {
    closeProfileModal();
    signOut();
    navigation.dispatch(
      CommonActions.reset({ index: 0, routes: [{ name: "Login" }] })
    );
  };

  const submitPasswordChange = async () => {
    if (newPass.length < 6) {
      setPwError("A senha deve ter ao menos 6 caracteres");
      return;
    }
    if (newPass !== confirmPass) {
      setPwError("As senhas não coincidem");
      return;
    }
    try {
      await changePassword(newPass);
      closePwModal();
      Alert.alert("Sucesso", "Senha alterada com sucesso");
    } catch {
      setPwError("Erro ao alterar senha");
    }
  };

  const onDayPress = (day: { dateString: string }) => {
    console.log("Dia selecionado:", day.dateString);
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#333C56" />

      {/* HEADER */}
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

      {/* PROFILE MODAL */}
      <Modal
        visible={profileModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeProfileModal}
      >
        <TouchableWithoutFeedback onPress={closeProfileModal}>
          <View style={homeStyles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={homeStyles.modalContainer}>
          <Text style={homeStyles.modalHeader}>
            {`Olá${user?.nome ? `, ${user.nome}` : ""}`}
          </Text>
          <View style={homeStyles.modalDivider} />
          <TouchableOpacity
            style={homeStyles.modalButton}
            onPress={openPwModal}
          >
            <Text style={homeStyles.modalButtonText}>ALTERAR SENHA</Text>
            <Image
              source={require("../../assets/cadeado.png")}
              style={homeStyles.modalButtonIcon}
            />
          </TouchableOpacity>
          <View style={homeStyles.modalDivider} />
          <TouchableOpacity
            style={homeStyles.modalButton}
            onPress={handleLogout}
          >
            <Text style={homeStyles.modalButtonText}>SAIR</Text>
            <Image
              source={require("../../assets/exit.png")}
              style={homeStyles.modalButtonIcon}
            />
          </TouchableOpacity>
        </View>
      </Modal>

      {/* CHANGE PASSWORD MODAL */}
      <Modal
        visible={pwModalVisible}
        transparent
        animationType="slide"
        onRequestClose={closePwModal}
      >
        <View style={homeStyles.changeOverlay}>
          <View style={homeStyles.changeContainer}>
            <Text style={homeStyles.changeTitle}>Alterar Senha</Text>
            <TextInput
              placeholder="Nova senha"
              secureTextEntry
              style={homeStyles.changeInput}
              value={newPass}
              onChangeText={setNewPass}
            />
            <TextInput
              placeholder="Confirme a senha"
              secureTextEntry
              style={homeStyles.changeInput}
              value={confirmPass}
              onChangeText={setConfirmPass}
            />
            {pwError ? (
              <Text style={homeStyles.errorText}>{pwError}</Text>
            ) : null}
            <View style={homeStyles.changeButtons}>
              <TouchableOpacity
                style={homeStyles.cancelButton}
                onPress={closePwModal}
              >
                <Text style={homeStyles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={homeStyles.saveButton}
                onPress={submitPasswordChange}
              >
                <Text style={homeStyles.saveText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MAIN CONTENT */}
      <SafeAreaView style={homeStyles.bottomSafe}>
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

        <TouchableOpacity
          style={homeStyles.calendarButton}
          onPress={() => navigation.navigate("AcademicCalendar")}
        >
          <Text style={homeStyles.calendarButtonText}>
            Calendário acadêmico
          </Text>
          <Image
            source={require("../../assets/arrow.png")}
            style={homeStyles.arrowIcon}
          />
        </TouchableOpacity>

        <View style={homeStyles.buttonsWrapper}>
          <TouchableOpacity
            style={[homeStyles.discButton, homeStyles.discButtonBlue]}
            onPress={() => navigation.navigate("Subjects")}
          >
            <Image
              source={require("../../assets/triangulo_inferior.png")}
              style={[homeStyles.discButtonTriangleTop, homeStyles.triangleDecor]}
            />
            <Image
              source={require("../../assets/triangulo_superior.png")}
              style={[homeStyles.discButtonTriangleBottom, homeStyles.triangleDecor]}
            />
            <Image
              source={require("../../assets/disciplinas.png")}
              style={homeStyles.discIcon}
            />
            <View style={homeStyles.discTextWrapper}>
              <Text style={homeStyles.discText}>Disciplinas</Text>
            </View>
          </TouchableOpacity>

          <View style={homeStyles.rightColumn}>
            <TouchableOpacity
              style={[homeStyles.smallButton, homeStyles.smallButtonWhite]}
              onPress={() => navigation.navigate("Note")}
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

        <TouchableOpacity
          style={[homeStyles.supportButton, homeStyles.supportButtonGrey]}
          onPress={() => navigation.navigate("Notification")}
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
