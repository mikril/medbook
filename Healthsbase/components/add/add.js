import React from 'react';
import { Text,Image, View, StyleSheet, Dimensions,TouchableOpacity,Button} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import NavigationPanel from '../navigationPanel/navigationPanel';
const { width, height } = Dimensions.get('window');

const Add = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.page}>
      <View style={styles.container}>
          <Text style={styles.header}>Добавить</Text>
          <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate('AddAppointment')}>
            <Text style={styles.buttonText}>Прием врача</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate('AddAnalyzes')}>
            <Text style={styles.buttonText}>Анализы</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate('AddPressure')}>
            <Text style={styles.buttonText}>Измерение давления</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate('AddNotification')}>
            <Text style={styles.buttonText}>Напоминание</Text>
          </TouchableOpacity>
      </View>
      <View style={styles.menu}>
        <NavigationPanel activeTab="Add" />
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
    flex: 1,
    padding: width * 0.05,
    backgroundColor: '#fbfbfb',
  },
  header: {
    fontSize: width * 0.088,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: height * 0.012,
  },
  buttonContainer: {
    width: '100%',
    height: height * 0.081,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    padding: height * 0.029,
    borderRadius: 8,
    marginBottom: height * 0.012,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.25, 
    shadowRadius: 3.84, 
    elevation: 5, 
  },
  buttonText: {
    fontSize: width * 0.044,
  },
});

export default Add;
