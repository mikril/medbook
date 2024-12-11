import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
const { width } = Dimensions.get('window');
const Appointment = ({ item }) => {
  // Получаем последний элемент из массива descriptions
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.measurementCard}
      onPress={() => navigation.navigate('CurrentAppointment', { id: item.id })}
    >
      <View style={styles.textContainer}>
        <Text style={styles.title}>
        {item.doctorType}
        </Text>
        <Text style={styles.comment} numberOfLines={2}>
        {item.doctorComment} 
        </Text>
        <Text style={styles.data}>
        {item.appointmentData}
        </Text>
      </View>
      <Text style={styles.arrow}>{'>'}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  measurementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: width * 0.05,
    marginBottom: width * 0.03,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'visible',
  },
  textContainer: {
    flex: 1,

  },
  title: {
    fontSize: width * 0.045,
    fontWeight: 'bold', // Жирный текст для заголовка
    color: '#000',
    marginBottom: width * 0.02,
  },
  comment: {
    fontSize: width * 0.03,
    color: '#999',
    marginBottom: width * 0.02,
  },
  data: {
    fontSize: width * 0.03,
    color: '#999',
  },
  arrow: {
    fontSize: width * 0.05,
    color: '#C4C4C4',
  },
});

export default Appointment;
