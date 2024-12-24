import React from 'react';
import { Text, View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';

const { width, height } = Dimensions.get('window');

const Notification = ({ name, dose, doctorType, time }) => {
  return (
    <View style={styles.notificationContainer}>
      <View style={styles.infoContainer}>
        <Text style={styles.nameText}>{name}</Text>
        {doctorType && <Text style={styles.doctorType}>{doctorType}</Text>}
        {dose && <Text style={styles.doseText}>{dose}</Text>}
      </View>

      <Text style={styles.timeText}>{time}</Text>
     
    </View>
  );
};

const styles = StyleSheet.create({
  deleteButton: {
    justifyContent: 'center', 
    alignItems: 'center', 
    fontWeight: 'bold',
    fontSize: width * 0.04,

    paddingLeft: width * 0.03,
  },
  notificationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: width * 0.031,
    paddingVertical: height * 0.008,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: height * 0.012,
    
  },
  infoContainer: {
    flex: 1,
    paddingRight: 10,
  },
  nameText: {
    fontSize: width * 0.044,
    fontWeight: '600',
    color: '#333333',
    marginBottom: width * 0.008,
  },
  doctorType: {
    fontSize: width * 0.027,
    color: '#555555',
    marginBottom: width * 0.008,
  },
  doseText: {
    fontSize: width * 0.027,
    color: '#777777',
  },
  timeText: {
    fontSize: width * 0.054,
    color: '#000',
  },
});

export default Notification;
