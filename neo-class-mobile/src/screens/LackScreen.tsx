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

/**
 * DTO interno para “faltas por matéria” após agrupamento.
 * Como não temos “materiaNome” vindo do backend, 
 * usaremos apenas o ID e exibiremos como “Matéria {id}”.
 */
interface FaltaDTO {
  materiaId: number;
  totalFaltas: number;
}

export default function LackScreen() {
  const { user } = useContext(AuthContext);
  const [faltas, setFaltas] = useState<FaltaDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Só dispara quando user estiver definido
    if (user) {
      buscarFrequencias();
    }
  }, [user]);

  /**
   * 1) Busca todas as frequências do aluno (GET /api/frequencias).
   * 2) Filtra apenas { presente: false } (faltas).
   * 3) Agrupa por materiaId, contando quantas faltas há em cada.
   */
  async function buscarFrequencias() {
    setLoading(true);
    setError('');
    try {
      // GET /api/frequencias → retorna array de { id, data, presente, alunoId, turmaId, materiaId }
      const response = await api.get<
        {
          id: number;
          data: string;
          presente: boolean;
          alunoId: number;
          turmaId: number;
          materiaId: number;
        }[]
      >('/frequencias');

      const todas = response.data;

      // Filtrar apenas faltas (presente === false)
      const somenteFaltas = todas.filter((f) => !f.presente);

      // Agrupar por materiaId
      const mapa: Record<number, FaltaDTO> = {};
      somenteFaltas.forEach((f) => {
        const mid = f.materiaId;
        if (!mapa[mid]) {
          mapa[mid] = { materiaId: mid, totalFaltas: 1 };
        } else {
          mapa[mid].totalFaltas += 1;
        }
      });

      // Transformar em array
      const lista: FaltaDTO[] = Object.values(mapa);
      setFaltas(lista);
    } catch (err: any) {
      console.log('Erro ao buscar frequências:', err);
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

  // Se user ainda não estiver definido, não renderiza nada
  if (!user) {
    return null;
  }

  const renderItem = ({ item }: { item: FaltaDTO }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.materiaNome}>Matéria {item.materiaId}</Text>
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
