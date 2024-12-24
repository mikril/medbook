import React, { useState, useEffect } from 'react';
import DatePicker from 'react-native-modern-datepicker';
import { Button, Modal, Text, TextInput, TouchableOpacity, View, StyleSheet, Alert, Dimensions, Image, Picker } from 'react-native';
import { acountUser } from './api';
import { useNavigation } from '@react-navigation/native';
import { useClientData } from '../../ClientDataContext';

// Вычисляем размеры экрана
const { width, height } = Dimensions.get('window');

const Acount = ({ route }) => {
  const { userId } = route.params;
  const [avatar, setAvatar] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [role, setRole] = useState('');
  const [comment, setComment] = useState('');
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { state, dispatch } = useClientData();
  const [clientData, setClientData] = useState(state.clientData);

  const [nameError, setNameError] = useState(false);

const handleSave = async () => {
  // Проверка имени пользователя
  if (!name.trim()) {
    setNameError(true);
    Alert.alert('Ошибка', 'Пожалуйста, заполните имя пользователя.');
    return;
  } else {
    setNameError(false);
  }

  if (!selectedDate) {
    Alert.alert('Ошибка', 'Пожалуйста, выберите дату рождения.');
    return;
  }

  let formattedDate;
  if (selectedDate.includes('.')) {
    formattedDate = selectedDate.split('.').reverse().join('-');
  } else if (selectedDate.includes('/')) {
    formattedDate = selectedDate.split('/').join('-');
  }

  const userData = {
    avatar,
    name,
    gender,
    role,
    comment,
    birthday: formattedDate,
  };

  fetch(`http://127.0.0.1:8000/user/${userId}`, {
    method: 'PATCH',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      Alert.alert('Успех', 'Данные сохранены успешно');
    })
    .catch((error) => {
      Alert.alert('Ошибка', `Не удалось сохранить данные: ${error.message}`);
    });

  await dispatch({
    type: 'SET_CLIENT_DATA',
    payload: {
      id: 'asd',
      id_account: clientData.id_account,
      clientName: null,
      avatar: null,
      notifications: [],
      pressureChart: [],
      lastMeasurements: [],
      nextAppointments: [],
      medicines: [],
      allMeasurements: [],
      users: clientData.users,
      appointments: [],
    },
  });
  await navigation.navigate('Main');
};
  
  const deleteProfile = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/user/delete/${userId}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.status}`);
      }
      

      const updatedUsers = clientData.users.filter(user => user.id !== userId);
      // Очищаем localStorage
      await localStorage.setItem('clientData', JSON.stringify({
        id: updatedUsers[0].id,  // ID пользователя
        id_account: clientData.id_account
      }));
      console.log('Профиль был успешно удалён');
      // Обновляем глобальное состояние
      await dispatch({
        type: 'SET_CLIENT_DATA',
        payload: {
          id: updatedUsers[0].id,
          id_account: clientData.id_account,
          clientName: null,
          avatar: null,
          notifications: [],
          pressureChart: [],
          lastMeasurements: [],
          nextAppointments: [],
          medicines: [],
          allMeasurements: [],
          users: updatedUsers,
          appointments: [],
        },
      });

      // Перенаправляем пользователя
      await navigation.navigate('Main');
    } catch (error) {
      console.error('Не удалось удалить профиль:', error.message);
    }
  };
  
  

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setIsModalVisible(false); // Закрываем модальное окно после выбора
  };
  useEffect(() => {
    const foundUser = state.clientData?.users?.find((u) => u.id === userId);
    if (foundUser) {
      setAvatar(foundUser.avatar);
      setName(foundUser.name);
      setGender(foundUser.gender);
      setRole(foundUser.role);
      setComment(foundUser.comment);
      setSelectedDate(foundUser.birthDate);
    } else {
      Alert.alert('Ошибка', 'Пользователь не найден');
    }
  }, [userId, state.clientData]);
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Редактирование</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Main')}>
          <Image source={require('./src/HomeOutline.svg')} style={styles.imageMenuAccount} />
        </TouchableOpacity>
      </View>
      <View style={styles.imageContainer}>
        <Image source={avatar} style={styles.logo} />
      </View>
      <Text style={styles.text}>Имя</Text>
<TextInput
  value={name}
  onChangeText={(text) => {
    setName(text);
    if (text.trim()) setNameError(false); // Сбрасываем ошибку, если поле заполнено
  }}
  placeholder="Имя"
  style={[styles.input, nameError && styles.errorInput]} // Добавляем стиль ошибки, если ошибка есть
/>

      <Text style={styles.text}>Пол</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={gender}
          onValueChange={(itemValue) => setGender(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Выберите пол" value="" />
          <Picker.Item label="Мужской" value="male" />
          <Picker.Item label="Женский" value="female" />
        </Picker>
      </View>

      <Text style={styles.text}>Роль</Text>
      <TextInput
        value={role}
        onChangeText={setRole}
        placeholder="Роль"
        style={styles.input}
      />
      
      <Text style={styles.text}>Дата рождения</Text>
      <TouchableOpacity style={styles.buttonDate} onPress={() => setIsModalVisible(true)}>
        <View style={styles.datePickerContainer}>
          <Text>{selectedDate || 'Выберите дату'}</Text>
          <Image source={require('./src/Vector.svg')} style={styles.image} />
        </View>
      </TouchableOpacity>

      {/* Модальное окно для выбора даты */}
      <Modal
        visible={isModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Выберите дату</Text>
            <DatePicker
              mode="calendar"
              selectedDate={selectedDate}
              onDateChange={handleDateChange}
              style={styles.calendar}
              options={{
                backgroundColor: '#fbfbfb',
                textHeaderColor: '#000',
                selectedTextColor: '#fff',
                mainColor: '#007bff',
                textSecondaryColor: '#8e8e8e',
                borderColor: '#8e8e8e',
              }}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Закрыть</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Text style={styles.text}>Комментарий</Text>
      <TextInput 
        value={comment}
        onChangeText={setComment}
        placeholder="Комментарий"
        style={styles.commentInput}
        multiline={true}
        numberOfLines={4}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Сохранить</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={deleteProfile}>
        <Text style={styles.deleteButtonText}>Удалить</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: width * 0.05,
    backgroundColor: '#fbfbfb',
  },
  header: {
    fontSize: width * 0.088,
    fontWeight: 'bold',
    color: '#000',
  },
  headerContainer: {
    flexDirection: 'row', // Размещение элементов в строку
    justifyContent: 'space-between', // Заголовок слева, кнопка справа
    alignItems: 'center', // Выравнивание по центру вертикали
    marginBottom: height * 0.012,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: height * 0.0083,
  },
  logo: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  text: {
    fontSize: width * 0.044,
    marginBottom: height * 0.014,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 8,
    height: height * 0.06,
    marginBottom: height * 0.024,
    fontSize: width * 0.04,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: height * 0.024,
    height: height * 0.06,
    justifyContent: 'center',
    backgroundColor: "#fbfbfb",
  },
  picker: {
    border: "none",
    borderRadius: 8,
    padding: 4,
    height: '100%',
    justifyContent: 'center',
    backgroundColor: "#fbfbfb",
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 16, // Увеличиваем горизонтальные отступы
    paddingVertical: 8,    // Добавляем вертикальные отступы
    textAlignVertical: 'top', // Расположение текста сверху для многострочного поля
    marginBottom: height * 0.024,
    fontSize: width * 0.04,
  },
  saveButton: {
    width: '100%',
    height: height * 0.045,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: height * 0.012,
    shadowColor: '#000', // Цвет тени
    shadowOffset: { width: 0, height: 2 }, // Смещение тени (iOS)
    shadowOpacity: 0.25, // Прозрачность тени (iOS)
    shadowRadius: 3.84, // Радиус размытия тени (iOS)
    elevation: 5, // Тень для Android
  },
  saveButtonText: {
    color: '#fff',
    fontSize: width * 0.043,
  },
  deleteButton: {
    width: '100%',
    height: height * 0.045,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    shadowColor: '#000', // Цвет тени
    shadowOffset: { width: 0, height: 2 }, // Смещение тени (iOS)
    shadowOpacity: 0.25, // Прозрачность тени (iOS)
    shadowRadius: 3.84, // Радиус размытия тени (iOS)
    elevation: 5, // Тень для Android
  },
  deleteButtonText: {
    color: '#ff4d4d',
    fontSize: width * 0.044,
  },
  datePickerContainer: {
    height: "100%",
    display: "flex",
    
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonDate: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 8,
    height: height * 0.06,
    marginBottom: height * 0.024,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    borderRadius: 8,
    backgroundColor: '#fff',
    padding: width * 0.041,
    alignItems: 'center',
  },
  modalHeader: {
    fontSize: width * 0.046,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#007bff',
  },
  errorInput: {
    borderColor: '#FF4D4D', },

  closeButtonText: {
    color: '#fff',
    fontSize: width * 0.046,
  },
});

export default Acount;
