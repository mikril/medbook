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
  const { state } = useClientData();
  const [clientData, setClientData] = useState(state.clientData);

  const handleSave = () => {
    const userData = { 
      name, 
      gender, 
      role, 
      comment 
    };

    acountUser(userData)
      .then((data) => {
        Alert.alert('Данные сохранены', 'Ваши данные успешно обновлены');
      })
      .catch((error) => {
        Alert.alert('Ошибка', error.message);
      });
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
        onChangeText={setName}
        placeholder="Имя"
        style={styles.input}
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

      <TouchableOpacity style={styles.deleteButton} onPress={() => alert('Удалить')}>
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
  closeButtonText: {
    color: '#fff',
    fontSize: width * 0.046,
  },
});

export default Acount;
