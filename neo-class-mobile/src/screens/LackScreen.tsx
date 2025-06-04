// src/screens/LackScreen.tsx
import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  Platform,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { FaltaDTO } from '../types/falta';

export default function LackScreen() {
  const { user } = useContext(AuthContext);
  const [faltas, setFaltas] = useState<FaltaDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (user && user.id) {
      buscarFaltas();
    }
  }, [user]);

  async function buscarFaltas() {
    setLoading(true);
    setError('');
    try {
      // GET /api/faltas → o backend já devolve { materiaId, materiaNome, totalFaltas }
      const response = await api.get<FaltaDTO[]>('/faltas');
      setFaltas(response.data);
    } catch (err: any) {
      console.log('Erro ao buscar faltas:', err);
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

  const renderItem = ({ item }: { item: FaltaDTO }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.materiaNome}>{item.materiaNome}</Text>
      <Text style={styles.totalFaltas}>{item.totalFaltas} faltas</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Faltas por Matéria</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#EA9216" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : faltas.length === 0 ? (
          <Text style={styles.semFaltasText}>Nenhuma falta encontrada.</Text>
        ) : (
          <FlatList
            data={faltas}
            keyExtractor={(item) => item.materiaId.toString()}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            contentContainerStyle={{ paddingBottom: 24 }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
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
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  errorText: {
    color: '#f66',
    textAlign: 'center',
    marginTop: 16,
  },
  semFaltasText: {
    textAlign: 'center',
    marginTop: 16,
    color: '#666',
  },
  separator: {
    height: 1,
    backgroundColor: '#DDD',
    marginVertical: 8,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
  },
  materiaNome: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    flexWrap: 'wrap',
  },
  totalFaltas: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EA0000',
    marginLeft: 12,
  },
});
