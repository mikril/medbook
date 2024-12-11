import React from 'react';
import { Text, View, StyleSheet, Dimensions  } from 'react-native';

const { width, height } = Dimensions.get('window');

// Компонент Appointment
const Appointment = ({ clinic, doctorType, date, time }) => {
  return (
    <View style={styles.appointmentContainer}>
      <Text style={styles.clinicDoctorText}>{clinic} - {doctorType}</Text>
      <Text style={styles.dateText}>{date} {time}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  appointmentContainer: {
    paddingHorizontal: width * 0.031,
    paddingVertical: height * 0.008,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: height * 0.024,
  },
  clinicDoctorText: {
    fontSize: width * 0.044,
    fontWeight: '600',
    color: '#333333',
    marginBottom: width * 0.008,
  },
  dateText: {
    fontSize: width * 0.027,
    color: '#555555',
  },
});

export default Appointment;
