import React, { useState, useEffect } from 'react';
import {TouchableOpacity,Text, View, FlatList, StyleSheet, Dimensions, Image,TextInput  } from 'react-native';


const { width, height } = Dimensions.get('window');
const AddAppointment = () => {
  const [doctorType, setDoctorType] = useState('');
  const [clinic, setClinic] = useState('');
  const [time, setTime] = useState(''); 
  const [date, setDate] = useState('');
  return (
    <View >
      <TextInput
        value={doctorType}
        onChangeText={setDoctorType}
        placeholder="Врач"
        style={styles.input}
        placeholderTextColor="#BDBDBD" 
      />
      <TextInput
        value={clinic}
        onChangeText={setClinic}
        placeholder="Клиника"
        style={styles.input}
        placeholderTextColor="#BDBDBD"
      />
      <Text>Время приёма</Text>
      <TextInput
        value={time}
        onChangeText={setTime}
        placeholder=""
        style={styles.input}
      />
      <Text>Дата приема</Text>
      <TextInput
        value={date}
        onChangeText={setDate}
        placeholder=""
        style={styles.input}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  input: {
    borderColor: '#BDBDBD',
    fontSize: width * 0.042,
    color: '#333',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: width * 0.035,
    paddingVertical: height * 0.017,
    marginBottom: width * 0.03,
    textAlignVertical: 'top', // Важно для многострочного текста
  },
  
});
export default AddAppointment;
