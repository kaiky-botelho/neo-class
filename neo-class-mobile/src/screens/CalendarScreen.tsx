import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';

export default function CalendarScreen() {
  return (
    <View style={styles.container}>
      <Calendar
        // formate dias, tema, onDayPress...
      />
    </View>
  );
}
