import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet } from 'react-native';

export default function Notifications() {
  const [msg, setMsg] = useState('');
  const [lista, setLista] = useState<string[]>([]);

  function enviar() {
    // chamar api.post('/notificacoes', { mensagem: msg })
    setLista([msg, ...lista]);
    setMsg('');
  }

  return ( 
    <View style={styles.container}>
      <FlatList data={lista} keyExtractor={(_,i)=>String(i)}
        renderItem={({item}) => <Text style={styles.item}>{item}</Text>}
      />
      <TextInput
        placeholder="Escreva a notificação"
        style={styles.input}
        value={msg}
        onChangeText={setMsg}
      />
      <Button title="Enviar" onPress={enviar} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  item: {
    padding: 12,
    backgroundColor: '#f5f5dc',
    marginBottom: 8,
    borderRadius: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#a9a9a9',
    borderRadius: 6,
    padding: 10,
    marginTop: 12,
  },
});
