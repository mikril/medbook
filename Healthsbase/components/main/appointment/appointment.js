import React from 'react';
import { Text, View, StyleSheet, Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

const Appointment = ({ doctorType, appointmentData, doctorComment }) => {
  return (
    <View style={styles.appointmentContainer}>
      <View style={styles.header}>
        <Text style={styles.doctorType}>{doctorType}</Text>
        <Text style={styles.appointmentData}>{appointmentData}</Text>
      </View>
      <Text style={styles.doctorComment} numberOfLines={2}>{doctorComment}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  appointmentContainer: {
    width: '100%', // Карточка занимает всю ширину
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: width*0.03,
    marginBottom: height*0.015, // Отступ между записями
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row', // Название врача и дата в одной строке
    justifyContent: 'space-between', // Распределение по краям
    alignItems: 'center',
    marginBottom: width*0.02, // Отступ между заголовком и описанием
  },
  doctorType: {
    fontSize: width*0.04,
    fontWeight: 'bold',
    color: '#333',
  },
  appointmentData: {
    fontSize: width*0.04,
    fontWeight: 'bold',
    color: '#333',
  },
  doctorComment: {
    fontSize: width*0.035,
    color: '#666',
    
  },
});

export default Appointment;
