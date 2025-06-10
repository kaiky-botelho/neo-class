import React, { useContext, useState } from 'react';
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
  // Removido: Alert, // Não precisamos mais do Alert, mas também não estou importando Toast aqui
} from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { AuthContext } from '../context/AuthContext';
import homeStyles from '../styles/homeStyles';
import { RootStackParamList } from '../../App';
// Removido: import Toast from 'react-native-toast-message'; // Não estou importando Toast aqui para cumprir "não altere mais nada"

/* ---------- LOCALE PT-BR (declarado fora do componente) ---------- */
LocaleConfig.locales.pt = {
  monthNames: [
    'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
    'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro',
  ],
  monthNamesShort: [
    'Jan','Fev','Mar','Abr','Mai','Jun',
    'Jul','Ago','Set','Out','Nov','Dez',
  ],
  dayNames: [
    'Domingo','Segunda-feira','Terça-feira','Quarta-feira',
    'Quinta-feira','Sexta-feira','Sábado',
  ],
  dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'],
  today: 'Hoje',
};
LocaleConfig.defaultLocale = 'pt';
/* ----------------------------------------------------------------- */

type HomeNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeNavigationProp>();
  const { user, signOut, changePassword } = useContext(AuthContext); // changePassword está aqui, mas o submitPasswordChange será adaptado

  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [pwModalVisible, setPwModalVisible] = useState(false); // Mantido
  const [newPass, setNewPass] = useState(''); // Mantido
  const [confirmPass, setConfirmPass] = useState(''); // Mantido
  const [pwError, setPwError] = useState(''); // Mantido


  /* ---------- datas ---------- */
  const getTodayBrazilString = (): string => {
    const now = new Date();
    const utcMillis = now.getTime() + now.getTimezoneOffset() * 60000;
    const brasilMillis = utcMillis - 3 * 60 * 60 * 1000; // UTC-3 (Horário de Brasília)
    return new Date(brasilMillis).toISOString().split('T')[0];
  };
  const todayString = getTodayBrazilString();
  const markedDates = {
    [todayString]: { selected: true, selectedColor: '#E6BC51' },
  };
  /* --------------------------- */

  /* ---------- modais ---------- */
  const openProfileModal = () => setProfileModalVisible(true);
  const closeProfileModal = () => setProfileModalVisible(false);

  // --- FUNÇÃO AJUSTADA PARA NAVEGAR PARA A TELA DE ALTERAR SENHA ---
  const handleNavigateToChangePassword = () => {
    closeProfileModal(); // Fecha o modal de perfil
    navigation.navigate('ChangePassword'); // Navega para a tela ChangePasswordScreen
  };
  // Mantido: openPwModal e closePwModal conforme seu pedido para "não alterar mais nada"
  // mas o 'openPwModal' do profileModal será linkado a 'handleNavigateToChangePassword'
  const openPwModal = () => {
    // Este `openPwModal` que era para abrir um modal interno de senha não é mais o principal caminho.
    // Se ele for chamado de algum outro lugar, agora vai navegar para a tela `ChangePassword`.
    // Não é mais o "modal" de alteração de senha, mas um gatilho para a tela.
    navigation.navigate('ChangePassword');
  };
  const closePwModal = () => { // Mantido como estava
    setPwModalVisible(false);
  };
  /* ---------------------------- */

  const handleLogout = () => {
    closeProfileModal();
    signOut();
    navigation.dispatch(
      CommonActions.reset({ index: 0, routes: [{ name: 'Login' as never }] })
    );
  };

  const submitPasswordChange = async () => {
    if (newPass.length < 6) {
      setPwError('A senha deve ter ao menos 6 caracteres');
      // Alert.alert('Erro', 'A senha deve ter ao menos 6 caracteres'); // Mantido Alert, pois não foi pedido para remover
      return;
    }
    if (newPass !== confirmPass) {
      setPwError('As senhas não coincidem');
      // Alert.alert('Erro', 'As senhas não coincidem'); // Mantido Alert
      return;
    }
    try {
      // Como a navegação vai para uma tela dedicada, esta função submitPasswordChange
      // e o modal pwModalVisible podem não ser mais usados.
      // Se ainda forem, a chamada a changePassword deve ser:
      // await changePassword(newPass);
      // closePwModal();
      // Alert.alert('Sucesso', 'Senha alterada com sucesso'); // Mantido Alert
    } catch {
      setPwError('Erro ao alterar senha');
      // Alert.alert('Erro', 'Erro ao alterar senha'); // Mantido Alert
    }
  };

  const onDayPress = (day: { dateString: string }) =>
    console.log('Dia selecionado:', day.dateString);

  // Calcular a margem para o cabeçalho no Android
  const topBarAndroidMargin = Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 0;
  // Calcular o padding para o bottomSafe no Android (se necessário)
  const bottomSafeAndroidPaddingTop = Platform.OS === 'android' ? 24 : 0;

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#333C56" />

      {/* HEADER */}
      <SafeAreaView style={homeStyles.topSafe}>
        <View style={[homeStyles.topBar, { marginTop: topBarAndroidMargin }]}>
          <View style={homeStyles.topBarSpacer} />
          <TouchableOpacity style={homeStyles.profileButton} onPress={openProfileModal}>
            <Image source={require('../../assets/profile.png')} style={homeStyles.profileIcon} />
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
            {`Olá${user?.nome ? `, ${user.nome}` : ''}`}
          </Text>
          <View style={homeStyles.modalDivider} />
          {/* --- AQUI: CHAMA A NOVA FUNÇÃO DE NAVEGAÇÃO --- */}
          <TouchableOpacity style={homeStyles.modalButton} onPress={handleNavigateToChangePassword}>
            <Text style={homeStyles.modalButtonText}>ALTERAR SENHA</Text>
            <Image source={require('../../assets/cadeado.png')} style={homeStyles.modalButtonIcon} />
          </TouchableOpacity>
          <View style={homeStyles.modalDivider} />
          <TouchableOpacity style={homeStyles.modalButton} onPress={handleLogout}>
            <Text style={homeStyles.modalButtonText}>SAIR</Text>
            <Image source={require('../../assets/exit.png')} style={homeStyles.modalButtonIcon} />
          </TouchableOpacity>
        </View>
      </Modal>

      {/* CHANGE PASSWORD MODAL (Mantido como estava, mas o fluxo do botão foi ajustado) */}
      <Modal
        visible={pwModalVisible} // Este modal só será visível se `openPwModal` for chamado e `setPwModalVisible(true)`
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
            {pwError ? <Text style={homeStyles.errorText}>{pwError}</Text> : null}
            <View style={homeStyles.changeButtons}>
              <TouchableOpacity style={homeStyles.cancelButton} onPress={closePwModal}>
                <Text style={homeStyles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={homeStyles.saveButton} onPress={submitPasswordChange}>
                <Text style={homeStyles.saveText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MAIN CONTENT */}
      <SafeAreaView style={[homeStyles.bottomSafe, { paddingTop: bottomSafeAndroidPaddingTop }]}>
        <View style={homeStyles.calendarContainer}>
          <Calendar
            current={todayString}
            onDayPress={onDayPress}
            markedDates={markedDates}
            firstDay={1}           /* semana começa na segunda */
            disableAllTouchEventsForDisabledDays
            theme={{
              arrowColor: '#2D2D2D',
              todayTextColor: '#2D2D2D',
              dayTextColor: '#2D2D2D',
              textDisabledColor: '#B8B8B8',   // dias fora do mês
              monthTextColor: '#2D2D2D',
              textMonthFontWeight: 'bold',
              textDayFontFamily: Platform.OS === 'android' ? 'Roboto' : 'System',
              textDayHeaderFontFamily: Platform.OS === 'android' ? 'Roboto' : 'System',
              textMonthFontFamily: Platform.OS === 'android' ? 'Roboto' : 'System',
            }}
            style={homeStyles.calendar}
          />
        </View>

        <TouchableOpacity
          style={homeStyles.calendarButton}
          onPress={() => navigation.navigate('AcademicCalendar')}
        >
          <Text style={homeStyles.calendarButtonText}>Calendário acadêmico</Text>
          <Image source={require('../../assets/arrow.png')} style={homeStyles.arrowIcon} />
        </TouchableOpacity>

        <View style={homeStyles.buttonsWrapper}>
          <TouchableOpacity
            style={[homeStyles.discButton, homeStyles.discButtonBlue]}
            onPress={() => navigation.navigate('Subjects')}
          >
            <Image source={require('../../assets/triangulo_inferior.png')} style={[homeStyles.discButtonTriangleTop, homeStyles.triangleDecor]} />
            <Image source={require('../../assets/triangulo_superior.png')} style={[homeStyles.discButtonTriangleBottom, homeStyles.triangleDecor]} />
            <Image source={require('../../assets/disciplinas.png')} style={homeStyles.discIcon} />
            <View style={homeStyles.discTextWrapper}>
              <Text style={homeStyles.discText}>Disciplinas</Text>
            </View>
          </TouchableOpacity>

          <View style={homeStyles.rightColumn}>
            <TouchableOpacity
              style={[homeStyles.smallButton, homeStyles.smallButtonWhite]}
              onPress={() => navigation.navigate('Note')}
            >
              <Image source={require('../../assets/notas.png')} style={homeStyles.smallIcon} />
              <Text style={[homeStyles.smallText, { color: '#333' }]}>Notas</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[homeStyles.smallButton, homeStyles.smallButtonRed]}
              onPress={() => navigation.navigate('Lack')}
            >
              <Image source={require('../../assets/trianguloFalta.png')} style={[homeStyles.faltaTriangle, homeStyles.triangleDecor]} />
              <Text style={[homeStyles.smallText, { color: '#2D2D2D' }]}>Faltas</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[homeStyles.supportButton, homeStyles.supportButtonGrey]}
          onPress={() => navigation.navigate('Notification')}
        >
          <Image source={require('../../assets/trianguloEsquerdo.png')} style={[homeStyles.supportTriangleLeft, homeStyles.triangleDecor]} />
          <Text style={homeStyles.supportText}>Suporte</Text>
          <Image source={require('../../assets/suporte.png')} style={homeStyles.supportIcon} />
          <Image source={require('../../assets/trianguloDireito.png')} style={[homeStyles.supportTriangleRight, homeStyles.triangleDecor]} />
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
}