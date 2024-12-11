import React, { useState, useEffect } from 'react';
import { Text, Button, View, Image, FlatList, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Notification from './notification/notification';
import Appointment from './appointment/appointment';
import Measurement from './measurement/measurement';
import PressureChart from './pressureChart/pressureChart';
import NavigationPanel from '../navigationPanel/navigationPanel';
import { useNavigation } from '@react-navigation/native';
import { useClientData } from '../../ClientDataContext';

 
const Main = () => {
  const { state } = useClientData();
  const [clientData, setClientData] = useState(state.clientData);

  const navigation = useNavigation();

  // Имитация запроса данных клиента после авторизации
  useEffect(() => {
    setClientData(state.clientData);
  }, [state.clientData]);

  if (!clientData) {
    return <Text>Загрузка...</Text>;
  }

  return (
    <View style={styles.page}>
      
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Главная</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Accounts')}>
          <Image source={require('./src/menu.svg')} />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
      <TouchableOpacity  style={styles.header} onPress={() => navigation.navigate('Acount', { userId: clientData.id })}>
        <Image source={ clientData.logo } style={styles.profileImage} />
        <Text style={styles.welcomeText}>Добрый день, {clientData.clientName}</Text>
      </TouchableOpacity >


      <View style={styles.notificationList}>
      {clientData.notifications.map((notification, index) => (
        <Notification
          key={index}
          type={notification.type}
          title={notification.title}
          description={notification.description}
          style={styles.notificationCard}
        />
      ))}
      </View>

      <View style={styles.chartContainer}>
        <PressureChart data={clientData.pressureChart}/>
      </View>

      <View style={styles.listContainer}>
      <FlatList
      contentContainerStyle={styles.listMeasurements}
        data={clientData.lastMeasurements}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Measurement title={item.title} description={item.description} />
        )}
        numColumns={4} // Размещаем 4 карточки в строке  
      />
      </View>

      <View style={styles.appointmentList}>  
      {clientData.appointments.slice(-2).map((appointment, index) => (
        <Appointment
          key={index}
          doctorType={appointment.doctorType}
          appointmentData={appointment.appointmentData}
          doctorComment={appointment.doctorComment}
          style={styles.appointmentsContainer}
        />
      ))}
      </View>
    <TouchableOpacity 
    style={styles.enrollButton}>
      <Text 
    style={styles.enrollText}>Записаться на прием </Text>
      
      <Image source={require('./src/esia.svg')} />
      </TouchableOpacity>
      </View>
      <View style={styles.menu}>
        <NavigationPanel activeTab="Main" />
      </View>
    </View>
  );
};


const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  page: {
    height: height,
    backgroundColor: '#FBFBFB',
  },
  menu: {
  },
  container: {
    marginTop: height*0.1,
    paddingBottom: 100,
    overflow:"scroll",
    flex: 1,
    padding: width * 0.05,  // Отступы относительно ширины экрана
    backgroundColor: '#FBFBFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.02,  // Отступ снизу относительно высоты экрана
  },
  headerContainer: {
    width: width,
    height: height*0.1,
    //flex: 1,  // Отступы относительно ширины экрана
    backgroundColor: '#FBFBFB',
    flexDirection: 'row', // Размещение элементов в строку
    justifyContent: 'space-between', // Заголовок слева, кнопка справа
    alignItems: 'center', // Выравнивание по центру вертикали
    
    paddingHorizontal: width * 0.05,

    marginBottom: height * 0.021,
    position: "fixed",
    top: 0
  },
  headerText: {
    fontSize: width * 0.088,
    fontWeight: 'bold',
  },
  listMeasurements:{
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  listContainer: {
    borderRadius: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: height * 0.018,
    backgroundColor: '#FBFBFB',
    
  },
  menuAccount: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    paddingHorizontal: 8,
    height: height * 0.06,
    marginBottom: height * 0.024,
    
  },
  profileImage: {
    width: width * 0.11, // Размер изображения относительно ширины экрана
    height: width * 0.11, // Размер изображения относительно ширины экрана
    borderRadius: width * 0.075, // Полукруглый вид
    marginRight: width * 0.05,
  },
  welcomeText: {
    fontSize: width * 0.045,  // Размер шрифта относительно ширины экрана
    fontWeight: 'bold',
    color: '#333',
  },
  appointmentsContainer: {
    backgroundColor: '#FBFBFB',
    padding: width * 0.04,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    
  },
  button: {
    backgroundColor: '#0057FF',
    padding: width * 0.04,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: height * 0.05,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
  notificationList: {
    flexDirection: 'row', // Уведомления идут горизонтально
    flexWrap: 'wrap', // Перенос уведомлений на следующую строку, если их много
    justifyContent: 'space-between', // Равномерное распределение уведомлений
    backgroundColor: '#FBFBFB',
    
  },
  appointmentList: {
    flexDirection: 'column', // Записи располагаются друг под другом
    backgroundColor: '#FBFBFB',
    marginBottom: height * 0.0005,
    
  },
  enrollButton: {
    backgroundColor: '#fff',
   display: "flex",
   flexDirection: "row",
   justifyContent: "center",
   alignItems: "center",
   gap: 8,
   paddingHorizontal: 12,
   borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
   marginBottom: height * 0.024,
  },
  enrollText: {
    color: '#000000',
    fontSize: width * 0.04,
    fontWeight: 'bold',
  }
});


export default Main;
