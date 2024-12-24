import React, { useState } from 'react';
import { TouchableOpacity,FlatList, Image ,Modal , Text, View,Button, StyleSheet, Dimensions, TextInput, Platform } from 'react-native';
import { TimePickerModal } from 'react-native-paper-dates';
import DatePicker from 'react-native-modern-datepicker';
import { useClientData } from '../../../ClientDataContext';
const { width, height } = Dimensions.get('window');
const AddMedecine = ({ userId }) => {
  const [name, setName] = useState('');
  const [doze, setDoze] = useState('');
  const [isEveryDay, setIsEveryDay] = useState(false);
  const [times, setTimes] = useState([]);
  
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [isModalStartVisible, setIsModalStartVisible] = useState(false);
  const [isModalEndVisible, setIsModalEndVisible] = useState(false);
  const [n, setN] = useState(1);
  const { state, dispatch } = useClientData();
  const clientData = state.clientData;
  const handleStartDateChange = (date) => {
    setSelectedStartDate(date);
    setIsModalStartVisible(false); // Закрываем модальное окно после выбора
  };
  const handleEndDateChange = (date) => {
    setSelectedEndDate(date);
    setIsModalEndVisible(false); // Закрываем модальное окно после выбора
  };

  const [visible, setVisible] = useState(false);
  const [time, setTime] = useState(null);

  const openPicker = () => setVisible(true);
  const closePicker = () => setVisible(false);

  const onConfirm = ({ hours, minutes }) => {
    setTimes([
      ...times,
      `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`, // Добавляем новый анализ с пустыми полями
    ]);
    closePicker();
  };
 
  const handleRemoveTime = (index) => {
    setTimes((prevTimes) => prevTimes.filter((_, i) => i !== index));
  };

  const [errors, setErrors] = useState({});

  const validateFields = () => {
    const newErrors = {};
  
    // Проверка названия
    if (!name.trim()) {
      newErrors.name = 'Название лекарства обязательно для заполнения';
    }
  
    // Проверка дозировки (только формат "цифры пробел буквы", например, "15 мг")
    const doseRegex = /^\d+\s[а-яА-Яa-zA-Z]+$/;
    if (!doze.trim()) {
      newErrors.doze = 'Дозировка обязательна для заполнения';
    } else if (!doseRegex.test(doze.trim())) {
      newErrors.doze = 'Пример заполнения поля: 15 мг';
    }
  
    // Проверка времени приема
    if (times.length === 0) {
      newErrors.times = 'Укажите хотя бы одно время приема лекарства';
    }
  
    // Проверка даты начала и окончания
    if (!selectedStartDate) {
      newErrors.startDate = 'Дата начала обязательна для заполнения';
    }
    if (!selectedEndDate) {
      newErrors.endDate = 'Дата окончания обязательна для заполнения';
    }
  
    // Проверка частоты приема
    if (!n || parseInt(n, 10) <= 0) {
      newErrors.n = 'Укажите количество дней между приемами';
    }
  
    setErrors(newErrors);
  
    // Если нет ошибок, возвращаем true
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSave = async () => {
    if (!validateFields()) {
      return; // Если есть ошибки, форма не отправляется
    }
    console.log(doze)
    // Преобразование дат в формат YYYY-MM-DD
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0]; // Берём только дату
    };
  
    const startDate = formatDate(selectedStartDate);
    const endDate = formatDate(selectedEndDate);
  
    // Формирование данных для отправки
    const reminderData = {
      name_medicine: name,
      dose: doze, // Преобразование дозировки в число
      reception_time: times, // Массив времени приёма
      start_date: startDate, // Дата начала (формат YYYY-MM-DD)
      end_date: endDate, // Дата окончания (формат YYYY-MM-DD)
      number_times: parseInt(n, 10) || 0, // Преобразование частоты в число
    };
  
    console.log(reminderData);
  
    // Отправка данных на сервер
    fetch(`http://127.0.0.1:8000/user/${clientData.id}/reminder_medicine`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reminderData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Ошибка сервера: ${response.data}`);
        }
        return response.json();
      })
      .catch((error) => {
        console.log('Ошибка', `Не удалось сохранить напоминание: ${error.message}`);
      });
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
  };
  
  
  

  return (
  <View>
    <View>
      {/* Ошибка для поля "Название" */}
      {errors.name && (
        <Text style={styles.errorText}>{errors.name}</Text>
      )}
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Название"
        style={[styles.input, errors.name && { borderColor: 'red' }]}
      />
    </View>

    <View>
      {/* Ошибка для поля "Дозировка" */}
      {errors.doze && (
        <Text style={styles.errorText}>{errors.doze}</Text>
      )}
      <TextInput
        value={doze}
        onChangeText={setDoze}
        placeholder="Дозировка"
        style={[styles.input, errors.doze && { borderColor: 'red' }]}
      />
    </View>

    <View>
      <Text style={styles.textBold}>Часы приёма лекарств</Text>
      {errors.times && (
    <Text style={styles.errorText}>{errors.times}</Text>
  )}
      <FlatList
        contentContainerStyle={styles.listMeasurements}
        data={times}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <Text style={styles.addTime}>
            {item}
            <TouchableOpacity onPress={() => handleRemoveTime(index)}>
              <Text style={styles.removeTime}>×</Text>
            </TouchableOpacity>
          </Text>
        )}
      />
    </View>

    <TouchableOpacity onPress={openPicker} style={styles.addTime}>
      Добавить время
    </TouchableOpacity>

    <TimePickerModal
      visible={visible}
      onDismiss={closePicker}
      onConfirm={onConfirm}
      hours={12} // начальные часы
      minutes={0} // начальные минуты
      label="Выберите время"
      animationType="fade"
    />

    <Text style={styles.textBold}>Период приёма лекарств</Text>
    <View style={styles.dateBlock}>
      {/* Ошибка для даты начала */}
      <TouchableOpacity
        style={[styles.buttonDate, errors.startDate && { borderColor: 'red' }]}
        onPress={() => setIsModalStartVisible(true)}
      >
        <View style={styles.datePickerContainer}>
          <Text style={styles.placeholder}>
            {selectedStartDate || 'Выберите дату'}
          </Text>
        </View>
      </TouchableOpacity>

      <Modal
        visible={isModalStartVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setIsModalStartVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Выберите дату</Text>
            <DatePicker
              mode="calendar"
              selectedDate={selectedStartDate}
              onDateChange={handleStartDateChange}
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
              onPress={() => setIsModalStartVisible(false)}
            >
              <Text style={styles.closeButtonText}>Закрыть</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Text style={styles.textDefis}>-</Text>
      {/* Ошибка для даты окончания */}
      <TouchableOpacity
        style={[styles.buttonDate, errors.endDate && { borderColor: 'red' }]}
        onPress={() => setIsModalEndVisible(true)}
      >
        <View style={styles.datePickerContainer}>
          <Text style={styles.placeholder}>
            {selectedEndDate || 'Выберите дату'}
          </Text>
        </View>
      </TouchableOpacity>

      <Modal
        visible={isModalEndVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setIsModalEndVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Выберите дату</Text>
            <DatePicker
              mode="calendar"
              selectedDate={selectedEndDate}
              onDateChange={handleEndDateChange}
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
              onPress={() => setIsModalEndVisible(false)}
            >
              <Text style={styles.closeButtonText}>Закрыть</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>

    <View>
      {/* Ошибка для интервала дней */}
      {errors.n && (
        <Text style={styles.errorText}>{errors.n}</Text>
      )}
      <Text style={styles.text}>
        Принимать лекарство раз в
        <TextInput
          value={String(n)}
          onChangeText={setN}
          placeholder="n"
          style={[styles.inputDays, errors.n && { borderColor: 'red' }]}
        />{' '}
        дней
      </Text>
    </View>

    <TouchableOpacity style={styles.button} onPress={handleSave}>
      <Text style={styles.buttonText}>Сохранить</Text>
    </TouchableOpacity>
  </View>
);
};

const styles = StyleSheet.create({
  errorContainer: {
    marginBottom: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 4,
  },
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
    textAlignVertical: 'top', // Важно для многострочного текста
    placeholderTextColor: "#BDBDBD"
  },
  
  timeButton: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
    placeholderTextColor: "#BDBDBD"
  },
  datePickerContainer: {
    height: "100%",
    display: "flex",
    
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    placeholderTextColor: "#BDBDBD"
  },
  buttonDate: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 8,
    height: height * 0.06,
    marginBottom: height * 0.024,
    flex: 1 
  },
  dateButton: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  checkbox: {
    marginBottom: 10,
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
  addTime: {
    backgroundColor: "#2F80ED",
    color: "white",
    textAlign: "center",
    paddingTop: "4px",
    borderRadius: "6px",
    marginRight: "8px",
    padding: "8px",
    marginTop: "8px",
    marginBottom: "16px",
    
  },
  placeholder: {
    placeholderTextColor: "#BDBDBD"
  },
  listMeasurements: {
    display: "flex",
    flexDirection: "row",
  },
  textBold: {
    fontSize: width * 0.04,
    marginBottom: height * 0.014,
    fontWeight: "600  "
  },
  text: {
    fontSize: width * 0.044,
    marginBottom: height * 0.014,
  },
  dateBlock: {
    display: "flex",
    flexDirection: "row",
    alignContent: "center"
  },
  textDefis: {
    paddingTop: "16px",
    marginHorizontal: "8px"
  },
  inputDays: {
    borderColor: '#BDBDBD',
    fontSize: width * 0.042,
    
    placeholderTextColor: "#BDBDBD",
    color: '#333',
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: width * 0.03,
    textAlignVertical: 'top', // Важно для многострочного текста
    width: 50,
    marginHorizontal: "6px",
    textAlign: "center",  
  },
  removeTime: {
    marginLeft: "5px"
  }
});

export default AddMedecine;