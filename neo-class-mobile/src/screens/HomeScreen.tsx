// src/screens/HomeScreen.tsx
import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Image,
  StatusBar,
} from 'react-native';

import { Calendar, LocaleConfig } from 'react-native-calendars';
import { AuthContext } from '../context/AuthContext';

// 1) Configurar LocaleConfig em português (pt-BR)
LocaleConfig.locales['pt'] = {
  monthNames: [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ],
  monthNamesShort: [
    'Jan',
    'Fev',
    'Mar',
    'Abr',
    'Mai',
    'Jun',
    'Jul',
    'Ago',
    'Set',
    'Out',
    'Nov',
    'Dez',
  ],
  dayNames: [
    'Domingo',
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
  ],
  dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
  today: 'Hoje',
};
LocaleConfig.defaultLocale = 'pt';

export default function HomeScreen() {
  const { signOut, user } = useContext(AuthContext);

  // 2) Função para obter “hoje” no fuso “America/Sao_Paulo” sem libs externas
  const getTodayBrazilString = (): string => {
    const now = new Date();
    const utcMillis = now.getTime() + now.getTimezoneOffset() * 60000;
    const brasilOffset = -3 * 60 * 60 * 1000; // UTC-3
    const brasilDate = new Date(utcMillis + brasilOffset);
    return brasilDate.toISOString().split('T')[0]; // “YYYY-MM-DD”
  };

  // String “YYYY-MM-DD” de hoje em Brasília
  const todayString = getTodayBrazilString();

  // Forçar destaque apenas em todayString (ex.: “2025-06-02”)
  const markedDates = {
    [todayString]: {
      selected: true,
      selectedColor: '#EA9216',
    },
  };

  // Handler de clique num dia
  const onDayPress = (day: { dateString: string }) => {
    console.log('Dia selecionado:', day.dateString);
  };

  return (
    <>
      {/* 
        1. StatusBar em modo claro sobre fundo escuro
      */}
      <StatusBar barStyle="light-content" backgroundColor="#333C56" />

      {/* 
        2. SafeAreaView superior somente para cobrir notch/status bar, em fundo escuro 
      */}
      <SafeAreaView style={styles.topSafe}>
        <View style={styles.topBar}>
          <View style={styles.topBarSpacer} />
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => {
              /* navegar para perfil, se existir */
            }}
          >
            <Image
              source={require('../../assets/profile.png')}
              style={styles.profileIcon}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* 
        3. SafeAreaView inferior (conteúdo principal) em fundo branco
      */}
      <SafeAreaView style={styles.bottomSafe}>
        {/* ---------- 2. CALENDÁRIO ---------- */}
        <View style={styles.calendarContainer}>
          <Calendar
            current={todayString}
            onDayPress={onDayPress}
            markedDates={markedDates}
            theme={{
              arrowColor: '#EA9216',
              todayTextColor: '#333',
              dayTextColor: '#333',
              textDayFontFamily: Platform.OS === 'android' ? 'Roboto' : undefined,
              textMonthFontWeight: 'bold',
              monthTextColor: '#EA9216',
              textDisabledColor: '#BBB',
              selectedDayBackgroundColor: '#EA9216',
              selectedDayTextColor: '#FFF',
            }}
            style={styles.calendar}
            firstDay={1}
          />
        </View>

        {/* ---------- 3. BOTÃO “CALENDÁRIO ACADÊMICO” ---------- */}
        <TouchableOpacity
          style={styles.calendarButton}
          onPress={() => {
            /* ação do calendário acadêmico */
          }}
        >
          <Text style={styles.calendarButtonText}>Calendário acadêmico</Text>
          <Image
            source={require('../../assets/arrow.png')}
            style={styles.arrowIcon}
          />
        </TouchableOpacity>

        {/* ---------- 4. DISTRIBUIÇÃO DE BOTÕES ---------- */}
        <View style={styles.buttonsWrapper}>
          {/* 4.1 DISCIPLINAS */}
          <TouchableOpacity
            style={[styles.discButton, styles.discButtonBlue]}
            onPress={() => {
              /* ação Disciplinas */
            }}
          >
            <Image
              source={require('../../assets/disciplinas.png')}
              style={styles.discIcon}
            />
            <Text style={[styles.discText, { color: '#FFF' }]}>
              Disciplinas
            </Text>
          </TouchableOpacity>

          {/* 4.2 COLUNA DIREITA */}
          <View style={styles.rightColumn}>
            <TouchableOpacity
              style={[styles.smallButton, styles.smallButtonWhite]}
              onPress={() => {
                /* ação Notas */
              }}
            >
              <Image
                source={require('../../assets/notas.png')}
                style={styles.smallIcon}
              />
              <Text style={[styles.smallText, { color: '#333' }]}>Notas</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.smallButton, styles.smallButtonRed]}
              onPress={() => {
                /* ação Faltas */
              }}
            >
              <Text style={[styles.smallText, { color: '#FFF' }]}>Faltas</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ---------- 5. BOTÃO DE SUPORTE (FULL WIDTH) ---------- */}
        <TouchableOpacity
          style={[styles.supportButton, styles.supportButtonGrey]}
          onPress={() => {
            /* ação Suporte */
          }}
        >
          <Text style={[styles.supportText, { color: '#FFF' }]}>Suporte</Text>
          <Image
            source={require('../../assets/suporte.png')}
            style={styles.supportGearIcon}
          />
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  // ===================================================================
  // 1. SafeAreaView superior cobrindo notch/status bar (fundo escuro)
  // ===================================================================
  topSafe: {
    backgroundColor: '#333C56',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingVertical: 12,
    // AQUI ADICIONAMOS UM ESPAÇAMENTO EXTRA NO TOPO
    marginTop: 30,
  },
  topBarSpacer: {
    flex: 1,
  },
  profileButton: {
    padding: 4,
  },
  profileIcon: {
    width: 28,
    height: 28,
    tintColor: '#FFF',
    resizeMode: 'contain',
  },

  // ===================================================================
  // 2. SafeAreaView inferior (conteúdo principal, fundo branco)
  // ===================================================================
  bottomSafe: {
    flex: 1,
    backgroundColor: '#FFF',
  },

  // 3. CALENDÁRIO
  calendarContainer: {
    marginHorizontal: 24,
    marginTop: 16,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
    backgroundColor: '#FFF',
  },
  calendar: {
    borderRadius: 8,
  },

  // 4. BOTÃO “CALENDÁRIO ACADÊMICO”
  calendarButton: {
    flexDirection: 'row',
    backgroundColor: '#F2C94C',
    marginHorizontal: 24,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    elevation: 2,
  },
  calendarButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  arrowIcon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
  },

  // 5. DISTRIBUIÇÃO DE BOTÕES (Disciplinas / Notas / Faltas)
  buttonsWrapper: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginTop: 24,
    justifyContent: 'space-between',
    height: 160, // altura fixa para alinhar
  },
  // 5.1 DISCIPLINAS (esquerda)
  discButton: {
    width: '60%',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  discButtonBlue: {
    backgroundColor: '#4F8EF7',
  },
  discIcon: {
    width: 48,
    height: 48,
    resizeMode: 'contain',
  },
  discText: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: '600',
  },
  // 5.2 COLUNA DIREITA (Notas em cima, Faltas embaixo)
  rightColumn: {
    width: '38%', // 60% + 38% + (2% gap aproximado) = 100%
    justifyContent: 'space-between',
  },
  smallButton: {
    height: '48%', // metade do espaço vertical disponível
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  smallButtonWhite: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  smallButtonRed: {
    backgroundColor: '#EB5757',
  },
  smallIcon: {
    width: 36,
    height: 36,
    resizeMode: 'contain',
  },
  smallText: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '600',
  },

  // 6. BOTÃO DE SUPORTE (FULL WIDTH)
  supportButton: {
    flexDirection: 'row',
    backgroundColor: '#333C56',
    marginHorizontal: 24,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 24,
    elevation: 2,
  },
  supportButtonGrey: {},
  supportGearIcon: {
    width: 24,
    height: 24,
    tintColor: '#FFF',
    resizeMode: 'contain',
  },
  supportText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
});
