import React, { useContext, useState, useEffect } from 'react';
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
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { AuthContext } from '../context/AuthContext';
import homeStyles from '../styles/homeStyles';
import api from '../services/api';
import { RootStackParamList } from '../../App';

LocaleConfig.locales.pt = {
  monthNames: [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ],
  monthNamesShort: [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
  ],
  dayNames: [
    'Domingo', 'Segunda', 'Terça', 'Quarta',
    'Quinta', 'Sexta', 'Sábado',
  ],
  dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
  today: 'Hoje',
};
LocaleConfig.defaultLocale = 'pt';

type HomeNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface ProvaDTO {
  id: number;
  nome: string;
  data: string;
  turmaId: number;
  nota: number;
}
interface TrabalhoDTO {
  id: number;
  nome: string;
  data: string;
  turmaId: number;
  nota: number;
}

export default function HomeScreen() {
  const navigation = useNavigation<HomeNavigationProp>();
  const { user, signOut } = useContext(AuthContext);

  const [provas, setProvas] = useState<ProvaDTO[]>([]);
  const [trabalhos, setTrabalhos] = useState<TrabalhoDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileModalVisible, setProfileModalVisible] = useState(false);

  useEffect(() => {
    if (user?.turmaId) {
      setLoading(true);
      Promise.all([
        api.get<ProvaDTO[]>('/provas'),
        api.get<TrabalhoDTO[]>('/trabalhos'),
      ])
        .then(([pRes, tRes]) => {
          setProvas(pRes.data.filter(p => p.turmaId === user.turmaId));
          setTrabalhos(tRes.data.filter(t => t.turmaId === user.turmaId));
        })
        .catch(err => console.error('Erro ao carregar calendário:', err))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const getTodayBrazilString = (): string => {
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const br = new Date(utc - 3 * 3600000);
    return br.toISOString().split('T')[0];
  };
  const todayString = getTodayBrazilString();

  const markedDates: Record<string, any> = {
    [todayString]: { selected: true, selectedColor: '#E6BC51' },
  };
  provas.forEach(p => {
    markedDates[p.data] = {
      customStyles: {
        container: { backgroundColor: '#FF9C9C' },
        text: { color: '#FFF', fontWeight: 'bold' },
      }
    };
  });
  trabalhos.forEach(t => {
    if (markedDates[t.data]) {
      const dayMark = markedDates[t.data]!;
      dayMark.customStyles!.container.borderColor = '#A0BFE8';
      dayMark.customStyles!.container.borderWidth = 2;
    } else {
      markedDates[t.data] = {
        customStyles: {
          container: { backgroundColor: '#A0BFE8' },
          text: { color: '#FFF', fontWeight: 'bold' },
        }
      };
    }
  });

  const onDayPress = (day: { dateString: string }) =>
    console.log('Dia selecionado:', day.dateString);

  const openProfileModal = () => setProfileModalVisible(true);
  const closeProfileModal = () => setProfileModalVisible(false);
  const handleNavigateToChangePassword = () => {
    closeProfileModal();
    navigation.navigate('ChangePassword');
  };
  const handleLogout = () => {
    closeProfileModal();
    signOut();
    navigation.dispatch(
      CommonActions.reset({ index: 0, routes: [{ name: 'Login' as never }] })
    );
  };

  const topBarAndroidMargin = Platform.OS === 'android'
    ? (StatusBar.currentHeight || 0)
    : 0;
  const bottomSafeAndroidPaddingTop = Platform.OS === 'android' ? 24 : 0;

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#333C56" />

      <SafeAreaView style={homeStyles.topSafe}>
        <View style={[homeStyles.topBar, { marginTop: topBarAndroidMargin }]}>
          <View style={homeStyles.topBarSpacer} />
          <TouchableOpacity
            style={homeStyles.profileButton}
            onPress={openProfileModal}
          >
            <Image
              source={require('../../assets/profile.png')}
              style={homeStyles.profileIcon}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

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
          <TouchableOpacity
            style={homeStyles.modalButton}
            onPress={handleNavigateToChangePassword}
          >
            <Text style={homeStyles.modalButtonText}>ALTERAR SENHA</Text>
            <Image
              source={require('../../assets/cadeado.png')}
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
              source={require('../../assets/exit.png')}
              style={homeStyles.modalButtonIcon}
            />
          </TouchableOpacity>
        </View>
      </Modal>

      <SafeAreaView style={[homeStyles.bottomSafe, { paddingTop: bottomSafeAndroidPaddingTop }]}>
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
          {loading ? (
            <ActivityIndicator size="large" color="#333" style={{ marginTop: 40 }} />
          ) : (
            <View style={homeStyles.calendarContainer}>
              <Calendar
                markingType="custom"
                markedDates={markedDates}
                onDayPress={onDayPress}
                firstDay={1}
                theme={{
                  arrowColor: '#2D2D2D',
                  todayTextColor: '#2D2D2D',
                  dayTextColor: '#2D2D2D',
                  textDisabledColor: '#B8B8B8',
                  monthTextColor: '#2D2D2D',
                  textMonthFontWeight: 'bold',
                  textDayFontFamily:
                    Platform.OS === 'android' ? 'Roboto' : 'System',
                  textDayHeaderFontFamily:
                    Platform.OS === 'android' ? 'Roboto' : 'System',
                  textMonthFontFamily:
                    Platform.OS === 'android' ? 'Roboto' : 'System',
                }}
                style={homeStyles.calendar}
              />
            </View>
          )}

          <TouchableOpacity
            style={homeStyles.calendarButton}
            onPress={() => navigation.navigate('AcademicCalendar')}
          >
            <Text style={homeStyles.calendarButtonText}>
              Calendário acadêmico
            </Text>
            <Image
              source={require('../../assets/arrow.png')}
              style={homeStyles.arrowIcon}
            />
          </TouchableOpacity>

          <View style={homeStyles.buttonsWrapper}>
            <TouchableOpacity
              style={[homeStyles.discButton, homeStyles.discButtonBlue]}
              onPress={() => navigation.navigate('Subjects')}
            >
              <Image
                source={require('../../assets/triangulo_inferior.png')}
                style={[homeStyles.discButtonTriangleTop, homeStyles.triangleDecor]}
              />
              <Image
                source={require('../../assets/triangulo_superior.png')}
                style={[homeStyles.discButtonTriangleBottom, homeStyles.triangleDecor]}
              />
              <Image
                source={require('../../assets/disciplinas.png')}
                style={homeStyles.discIcon}
              />
              <View style={homeStyles.discTextWrapper}>
                <Text style={homeStyles.discText}>Disciplinas</Text>
              </View>
            </TouchableOpacity>

            <View style={homeStyles.rightColumn}>
              <TouchableOpacity
                style={[homeStyles.smallButton, homeStyles.smallButtonWhite]}
                onPress={() => navigation.navigate('Note')}
              >
                <Image
                  source={require('../../assets/notas.png')}
                  style={homeStyles.smallIcon}
                />
                <Text style={[homeStyles.smallText, { color: '#333' }]}>
                  Notas
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[homeStyles.smallButton, homeStyles.smallButtonRed]}
                onPress={() => navigation.navigate('Lack')}
              >
                <Image
                  source={require('../../assets/trianguloFalta.png')}
                  style={[homeStyles.faltaTriangle, homeStyles.triangleDecor]}
                />
                <Text style={[homeStyles.smallText, { color: '#2D2D2D' }]}>
                  Faltas
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[homeStyles.supportButton, homeStyles.supportButtonGrey]}
            onPress={() => navigation.navigate('Notification')}
          >
            <Image
              source={require('../../assets/trianguloEsquerdo.png')}
              style={[homeStyles.supportTriangleLeft, homeStyles.triangleDecor]}
            />
            <Text style={homeStyles.supportText}>Suporte</Text>
            <Image
              source={require('../../assets/suporte.png')}
              style={homeStyles.supportIcon}
            />
            <Image
              source={require('../../assets/trianguloDireito.png')}
              style={[homeStyles.supportTriangleRight, homeStyles.triangleDecor]}
            />
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
