import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, View, FlatList, StyleSheet, Dimensions } from 'react-native';
import { useClientData } from '../../ClientDataContext';
import Appointment from './appointment/appointment';
import Notification from './notification/notification';
import NavigationPanel from '../navigationPanel/navigationPanel';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

// Функция для преобразования даты из формата DD.MM.YYYY в ISO (YYYY-MM-DD)
const parseDate = (dateString) => {
  const [day, month, year] = dateString.split('.');
  return `${year}-${month}-${day}`;
};

// Функция для форматирования даты в читабельный вид
const formatDate = (dateString) => {
  const isoDate = parseDate(dateString);
  const options = { day: 'numeric', month: 'long' };
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat('ru-RU', options).format(date);
};

const Notifications = () => {
  const { state } = useClientData();
  const [firstAppointment, setFirstAppointment] = useState(null);
  const [groupedData, setGroupedData] = useState({});
  const navigation = useNavigation();

  useEffect(() => {
    const nextAppointments = state.clientData?.nextAppointments || [];
    const medicines = state.clientData?.medicines || [];
    console.log(nextAppointments)
    console.log(medicines)

    // Устанавливаем первый приём
    if (nextAppointments.length > 0) {
      setFirstAppointment(nextAppointments[0]);
    }

    // Формируем объединённый массив для FlatList
    let combined = [];

    // Добавляем приёмы врачей
    nextAppointments.forEach((appointment) => {
      combined.push({
        name: appointment.clinic,
        doctorType: appointment.doctorType,
        date: appointment.date,
        time: appointment.time,
      });
    });

    // Добавляем лекарства
    medicines.forEach((medicine) => {
      medicine.drug.forEach((drug) => {
        combined.push({
          name: drug.name,
          dose: drug.dose,
          date: medicine.data,
          time: drug.time,
        });
      });
    });

    // Сортируем по дате и времени
    combined.sort((a, b) => {
      const dateA = new Date(`${parseDate(a.date)} ${a.time}`);
      const dateB = new Date(`${parseDate(b.date)} ${b.time}`);
      return dateA - dateB;
    });

    // Группируем данные по дате
    const grouped = combined.reduce((acc, item) => {
      const formattedDate = formatDate(item.date);
      if (!acc[formattedDate]) {
        acc[formattedDate] = [];
      }
      acc[formattedDate].push(item);
      return acc;
    }, {});

    setGroupedData(grouped);
  }, [state.clientData]);

  console.log(groupedData);

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <Text style={styles.header}>Напоминания</Text>
        
        <Text style={styles.text}>Ближайший приём</Text>
        {firstAppointment ? (
          <Appointment
            clinic={firstAppointment.clinic}
            doctorType={firstAppointment.doctorType}
            date={formatDate(firstAppointment.date)}
            time={firstAppointment.time}
          />
        ) : (
          <Text style={styles.noDataText}>Нет ближайших приёмов</Text>
        )}
    
        {Object.keys(groupedData).length > 0 ? (
          <FlatList
            data={Object.keys(groupedData)}
            keyExtractor={(item) => item}
            renderItem={({ item }) => {
              const notificationsForDate = groupedData[item];
              return (
                <View>
                  <Text style={styles.dateHeader}>{item}</Text>
                  {notificationsForDate.map((notification, index) => (
                    <Notification
                      key={index}
                      name={notification.name}
                      dose={notification.dose}
                      doctorType={notification.doctorType}
                      time={notification.time}
                    />
                  ))}
                </View>
              );
            }}
          />
        ) : (
          <Text style={styles.noDataText}>Нет данных для отображения</Text>
        )}

        <TouchableOpacity style={styles.buttonAdd} onPress={() => navigation.navigate('AddNotification')}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.menu}>
        <NavigationPanel activeTab="Notifications" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    height: height,
    backgroundColor: '#FBFBFB',
  },
  menu: {
  },
  container: {
    maxHeight: height * 0.93,
    flex: 1,
    padding: width * 0.05,  // Отступы относительно ширины экрана
    backgroundColor: '#FBFBFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.012,  
    fontSize: width * 0.088,
    fontWeight: 'bold',
  },
  text: {
    fontWeight: 'bold',
    fontSize: width * 0.044,
    marginBottom: height * 0.012,
  },
  dateHeader: {
    fontSize: width * 0.044,
    fontWeight: 'bold',
    marginBottom: height * 0.012,
  },
  buttonAdd: {
    backgroundColor: '#fbfbfb',
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
    marginVertical: height * 0.011,
  },
  addButtonText: {
    fontWeight: 'bold',
    fontSize: width * 0.04,
    color: '#ccc',
  },
  noDataText: {
    fontSize: width * 0.04,
    color: '#999',
  },
});

export default Notifications;
