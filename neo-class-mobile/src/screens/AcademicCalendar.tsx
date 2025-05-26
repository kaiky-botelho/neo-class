import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import api from '../api/api';

type Item = { materia: string; data: string };

export default function AcademicCalendar() {
  const [provas, setProvas] = useState<Item[]>([]);
  const [trabalhos, setTrabalhos] = useState<Item[]>([]);

  useEffect(() => {
    api.get('/academico/provas').then(r => setProvas(r.data));
    api.get('/academico/trabalhos').then(r => setTrabalhos(r.data));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Provas</Text>
      <FlatList data={provas} keyExtractor={i=>i.materia}
        renderItem={({item}) => (
          <View style={styles.row}>
            <Text>{item.materia}</Text>
            <Text>{item.data}</Text>
          </View>
        )}
      />
      <Text style={styles.header}>Trabalhos</Text>
      <FlatList data={trabalhos} keyExtractor={i=>i.materia}
        renderItem={({item}) => (
          <View style={styles.row}>
            <Text>{item.materia}</Text>
            <Text>{item.data}</Text>
          </View>
        )}
      />
    </View>
  );
}
