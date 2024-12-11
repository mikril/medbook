import React, { useState, useEffect } from 'react';
import {TouchableOpacity,Text, View, FlatList, StyleSheet, Dimensions, Image } from 'react-native';
import { useClientData } from '../../ClientDataContext';
import NavigationPanel from '../navigationPanel/navigationPanel';
import Appointment from './appointment/appointment';
import { useNavigation } from '@react-navigation/native';
const { width, height } = Dimensions.get('window');
const Appointments = () => {
  const navigation = useNavigation();
  const { state } = useClientData();
  const [clientData, setClientData] = useState(state.clientData);
  // Получение данных по `title` из массива `allMeasurements`
  useEffect(() => {
    setClientData(state.clientData);
  }, []);

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <Text style={styles.header}>Приемы</Text>
        <FlatList
          data={clientData.appointments}  // Используем allMeasurements из состояния
          renderItem={({ item }) => <Appointment item={item} />}  // Передаем item в компонент Measurement
          keyExtractor={(item) => item.title} 
          ListFooterComponent={
              <TouchableOpacity style={styles.buttonAdd} onPress={() => navigation.navigate('AddAppointment')}>+</TouchableOpacity>
            } 
        />
      </View>
      <View style={styles.menu}>
        <NavigationPanel activeTab="Appointments"/>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  page: {
    height: height
  },
  menu: {
   
    
  },
  container: {
    height: height,
    overflow:"scroll",
    flex: 1,
    padding: width * 0.05,  // Отступы относительно ширины экрана
    backgroundColor: '#FBFBFB',
    
    paddingBottom: 100,
  },
  header: {
    fontSize: width * 0.085,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: width * 0.03,
  },
  buttonAdd: {
    justifyContent: 'center', 
    alignItems: 'center', 
    fontWeight: 'bold',
    fontSize: width * 0.04,
    color: '#ccc',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    paddingVertical: height * 0.0175,
    paddingHorizontal: width * 0.03,
  },
});
export default Appointments;
