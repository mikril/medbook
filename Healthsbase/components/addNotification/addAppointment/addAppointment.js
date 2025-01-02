import React, { useState } from 'react';
import { TouchableOpacity, Image, Modal, Text, View, TextInput, StyleSheet, Dimensions, Alert } from 'react-native';
import { TimePickerModal } from 'react-native-paper-dates';
import DatePicker from 'react-native-modern-datepicker';
import { useClientData } from '../../../ClientDataContext';
const { width, height } = Dimensions.get('window');
import Constants from 'expo-constants';

const AddAppointment = ({ userId }) => {
  const { state, dispatch } = useClientData();
  const clientData = state.clientData;
  const [doctorType, setDoctorType] = useState('');
  const [clinic, setClinic] = useState('');
  const [time, setTime] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [visible, setVisible] = useState(false);

  // Валидация
  const [doctorTypeError, setDoctorTypeError] = useState('');
  const [clinicError, setClinicError] = useState('');
  const [timeError, setTimeError] = useState('');
  const [dateError, setDateError] = useState('');

  const formatTime = (hours, minutes) => {
    const formattedHours = hours.toString().padStart(2, '0'); // Добавляем ведущий ноль к часам
    const formattedMinutes = minutes.toString().padStart(2, '0'); // Добавляем ведущий ноль к минутам
    return `${formattedHours}:${formattedMinutes}`;
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setIsModalVisible(false); // Закрываем модальное окно после выбора
  };

  const openPicker = () => setVisible(true);
  const closePicker = () => setVisible(false);

  const handleSave = async () => {
    let isValid = true;
    // Проверяем, что все поля заполнены корректно
    if (!doctorType) {
      setDoctorTypeError('Это поле обязательно');
      isValid = false;
    } else {
      setDoctorTypeError('');
    }

    if (!clinic) {
      setClinicError('Это поле обязательно');
      isValid = false;
    } else {
      setClinicError('');
    }

    if (!time) {
      setTimeError('Выберите время');
      isValid = false;
    } else {
      setTimeError('');
    }

    if (!selectedDate) {
      setDateError('Выберите дату');
      isValid = false;
    } else {
      setDateError('');
    }

    if (!isValid) return; // Если есть ошибки, не сохраняем

    try {
      // Преобразование даты в формат YYYY-MM-DD
      const formattedDate = selectedDate.replace(/\//g, '-'); // Заменяем '/' на '-'

      const reminderData = {
        specialization_doctor: doctorType,
        name_clinic: clinic.trim() ? clinic : null,
        date_appointment: formattedDate, // Формат YYYY-MM-DD
        time_appointment: `${time}:00`, // Добавляем секунды
      };

      console.log('Отправляемые данные:', reminderData);
      const apiUrl = Constants.manifest.extra.apiUrl;
      const response = await fetch(`${apiUrl}/user/${clientData.id}/reminder_appointment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reminderData),
      });

      if (response.ok) {
        const data = await response.json();
        Alert.alert('Успех', `Напоминание добавлено с ID: ${data.reminder_id}`);
      } else {
        const error = await response.json();
        console.error('Ошибка API:', error);
        Alert.alert('Ошибка', error.detail || 'Не удалось добавить напоминание.');
      }
      await dispatch({
        type: "SET_CLIENT_DATA",
        payload: {
          id: "asd",  // Оставляем только id
          id_account: clientData.id_account,  // Оставляем только id_account
          clientName: null,  // Обнуляем clientName
          avatar: null,  // Обнуляем avatar
          notifications: [],  // Обнуляем notifications
          pressureChart: [],  // Обнуляем pressureChart
          lastMeasurements: [],  // Обнуляем lastMeasurements
          nextAppointments: [],  // Обнуляем nextAppointments
          medicines: [],  // Обнуляем medicines
          allMeasurements: [],  // Обнуляем allMeasurements
          users: [],  // Обнуляем users
          appointments: []
        },
      });
      await navigation.navigate('Main');
    } catch (error) {
      console.error('Ошибка запроса:', error);
      Alert.alert('Ошибка', 'Произошла ошибка при сохранении данных.');
    }
  };

  return (
    <View>
      {doctorTypeError ? <Text style={styles.errorText}>{doctorTypeError}</Text> : null}
      <TextInput
        value={doctorType}
        onChangeText={setDoctorType}
        placeholder="Врач"
        style={[styles.input, doctorTypeError && styles.errorInput]}
        placeholderTextColor="#BDBDBD"
      />
      

      {clinicError ? <Text style={styles.errorText}>{clinicError}</Text> : null}
      <TextInput
        value={clinic}
        onChangeText={setClinic}
        placeholder="Клиника"
        style={[styles.input, clinicError && styles.errorInput]}
        placeholderTextColor="#BDBDBD"
      />
      

      {timeError ? <Text style={styles.errorText}>{timeError}</Text> : null}
      <Text style={styles.label}>Время приёма</Text>
      <TouchableOpacity style={styles.input} onPress={openPicker}>
        <View style={styles.datePickerContainer}>
          <Text style={[styles.textInput, !time && styles.placeholder]}>{time || "Не выбрано"}</Text>
          <Image source={require('../src/clock.svg')} />
        </View>
      </TouchableOpacity>
      

      <TimePickerModal
        visible={visible}
        onDismiss={closePicker}
        onConfirm={(params) => {
          setTime(formatTime(params.hours, params.minutes)); // Используем функцию форматирования
          closePicker();
        }}
        hours={12}
        minutes={0}
        label="Выберите время"
        animationType="fade"
      />
      
      {dateError ? <Text style={styles.errorText}>{dateError}</Text> : null}
      <Text style={styles.label}>Дата приёма</Text>
      <TouchableOpacity style={styles.input} onPress={() => setIsModalVisible(true)}>
        <View style={styles.datePickerContainer}>
          <Text style={[styles.textInput, !selectedDate && styles.placeholder]}>{selectedDate || "Не выбрано"}</Text>
          <Image source={require('../src/Vector.svg')} />
        </View>
      </TouchableOpacity>
      

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
              style={styles.pickerContainer}
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

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Сохранить</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#2F80ED',
    padding: width * 0.03,
    alignItems: 'center',
    borderRadius: 12,
    marginTop: height * 0.02,
    width: width * 0.9,
    alignSelf: 'center',
    position: "fixed",
    bottom: "16px"
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  input: {
    borderColor: '#BDBDBD',
    fontSize: width * 0.042,
    color: '#333',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: width * 0.035,
    paddingVertical: height * 0.017,
    marginBottom: width * 0.03,
    textAlignVertical: 'top',
  },
  errorInput: {
    borderColor: 'red', // Красный цвет для ошибок
  },
  errorText: {
    color: 'red',
    fontSize: width * 0.035,
    marginBottom: width * 0.03,
  },
  placeholder: {
    color: '#BDBDBD',
  },
  label: {
    fontSize: width * 0.04,
    fontWeight: "600",
    marginBottom: width * 0.025,
    color: '#333',
  },
  textInput: {
    fontSize: width * 0.04,
    color: '#333',
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
    borderRadius: 12,
    backgroundColor: '#007bff',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: width * 0.046,
  },
  datePickerContainer: {
    height: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    placeholderTextColor: "#BDBDBD"
  },
});
export default AddAppointment;
