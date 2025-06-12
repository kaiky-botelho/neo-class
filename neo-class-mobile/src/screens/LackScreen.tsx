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
  Platform,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { FaltaDTO } from '../types/falta';
import lackStyles from '../styles/lackStyles';
import Toast from 'react-native-toast-message';
import { PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width - 48; // padding horizontal

export default function LackScreen() {
  const navigation = useNavigation();
  const { user, signOut } = useContext(AuthContext);

  const [faltas, setFaltas] = useState<FaltaDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (user?.id) {
      buscarFaltas(user.id);
    }
  }, [user]);

  async function buscarFaltas(alunoId: number) {
    setLoading(true);
    try {
      const res = await api.get<FaltaDTO[]>(`/frequencias/faltas/${alunoId}`);
      setFaltas(res.data);
    } catch (err: any) {
      let errorMessage = 'Não foi possível carregar as faltas.';
      if (err.response) {
        if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        } else {
          errorMessage = `Erro na requisição (${err.response.status}).`;
        }
      } else if (err.message === 'Network Error') {
        errorMessage = 'Erro de conexão: Verifique sua internet.';
      }
      Toast.show({
        type: 'error',
        text1: 'Erro ao Carregar Faltas',
        text2: errorMessage,
        position: 'top',
        visibilityTime: 4000,
      });
    } finally {
      setLoading(false);
    }
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
      CommonActions.reset({ index: 0, routes: [{ name: 'Login' as never }] })
    );
  };

  const topBarAndroidMargin = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

  // Prepare pie chart data
  const chartData = faltas.map((item, index) => ({
    name: item.materiaNome,
    population: item.totalFaltas,
    color: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'][index % 5],
    legendFontColor: '#333',
    legendFontSize: 14,
  }));

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={lackStyles.topSafe}>
        <View style={[lackStyles.topBar, { marginTop: topBarAndroidMargin }]}> 
          <TouchableOpacity style={lackStyles.backButton} onPress={() => navigation.goBack()}>
            <Image source={require('../../assets/voltar.png')} style={lackStyles.backIcon} />
          </TouchableOpacity>
          <View style={lackStyles.topBarSpacer} />
          <TouchableOpacity style={lackStyles.profileButton} onPress={openProfileModal}>
            <Image source={require('../../assets/profile.png')} style={lackStyles.profileIcon} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <Modal visible={modalVisible} animationType="fade" transparent onRequestClose={closeProfileModal}>
        <View style={{ flex: 1 }}>
          <TouchableWithoutFeedback onPress={closeProfileModal}>
            <View style={lackStyles.modalOverlay} />
          </TouchableWithoutFeedback>
          <View style={lackStyles.modalContainer}>
            <Text style={lackStyles.modalHeader}>{`Olá${user?.nome ? `, ${user.nome}` : ''}`}</Text>
            <View style={lackStyles.modalDivider} />
            <TouchableOpacity style={lackStyles.modalButton} onPress={handleChangePassword}>
              <Text style={lackStyles.modalButtonText}>ALTERAR SENHA</Text>
              <Image source={require('../../assets/cadeado.png')} style={lackStyles.modalButtonIcon} />
            </TouchableOpacity>
            <View style={lackStyles.modalDivider} />
            <TouchableOpacity style={lackStyles.modalButton} onPress={handleLogout}>
              <Text style={lackStyles.modalButtonText}>SAIR</Text>
              <Image source={require('../../assets/exit.png')} style={lackStyles.modalButtonIcon} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
        <View style={lackStyles.container}>
          <Text style={lackStyles.headerTitle}>FALTAS POR MATÉRIA</Text>

          {loading ? (
            <ActivityIndicator size="large" color="#EB5757" />
          ) : (
            <>  
              {chartData.length > 0 && (
                <PieChart
                  data={chartData}
                  width={screenWidth}
                  height={220}
                  chartConfig={{
                    color: () => `rgba(0, 0, 0, 0.5)`,
                  }}
                  accessor="population"
                  backgroundColor="transparent"
                  paddingLeft="15"
                  absolute
                />
              )}

              <FlatList
                data={faltas}
                keyExtractor={i => String(i.materiaId)}
                renderItem={({ item }) => (
                  <View style={lackStyles.listItem}>
                    <Text style={lackStyles.subjectText}>{item.materiaNome}</Text>
                    <View style={lackStyles.badge}>
                      <Text style={lackStyles.badgeText}>{item.totalFaltas}</Text>
                    </View>
                  </View>
                )}
                contentContainerStyle={lackStyles.listContainer}
                ListEmptyComponent={
                  !loading && faltas.length === 0 ? (
                    <Text style={lackStyles.noDataText}>Nenhuma falta registrada.</Text>
                  ) : null
                }
              />
            </>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}
