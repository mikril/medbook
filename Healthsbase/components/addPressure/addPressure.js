import React, { useState } from 'react';
import { Text, TextInput, View, Modal, StyleSheet, TouchableOpacity, Image, Dimensions, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useClientData } from '../../ClientDataContext';
import { addPressures } from './api';
import DatePicker from 'react-native-modern-datepicker';

const { width, height } = Dimensions.get('window');

const AddPressure = () => {
  const { state, dispatch } = useClientData();
  const clientData = state.clientData;

  const [selectedIndex, setSelectedIndex] = useState(null);
  // Состояние для хранения списка измерений
  const [pressures, setPressures] = useState([
    { upper: '', lower: '', pulse: '', date: '', error: {} },
  ]);

  // Состояние для хранения ошибок
  const [errors, setErrors] = useState({});

  // Функция для добавления нового набора полей
  const addPressure = () => {
    setPressures([
      ...pressures,
      { upper: '', lower: '', pulse: '', date: '', error: {} },
    ]);
  };

  // Функция для обновления конкретного поля в измерении
  const handleInputChange = (index, field, value) => {
    const updatedPressures = [...pressures];
    updatedPressures[index][field] = value;
    setPressures(updatedPressures);
  };

  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  const handleDateChangePressure = (date) => {
    const newPressures = [...pressures];
    newPressures[selectedIndex].date =  date.replace(/\//g, '-'); // Обновляем дату для выбранного индекса
    setPressures(newPressures);
    setIsDatePickerVisible(false); // Закрываем модальное окно
  };

  const navigation = useNavigation();

  // Функция для проверки данных
  const validateData = () => {
    let valid = true;
    let newErrors = {};

    pressures.forEach((pressure, index) => {
      const { upper, lower, pulse, date } = pressure;
      let fieldErrors = {};

      if (!upper || !lower || !pulse || !date) {
        fieldErrors.empty = 'Все поля обязательны для заполнения';
      }

      if (isNaN(upper) || isNaN(lower) || isNaN(pulse)) {
        fieldErrors.number = 'Давление и пульс должны быть числовыми значениями';
      }

      if (Number(upper) <= 0 || Number(lower) <= 0 || Number(pulse) <= 0) {
        fieldErrors.positive = 'Давление и пульс должны быть положительными числами';
      }

      if (Object.keys(fieldErrors).length > 0) {
        valid = false;
        newErrors[index] = fieldErrors;
      }
    });

    setErrors(newErrors);
    return valid;
  };

  const handleAddPressure = async () => {
    // Выполняем проверку данных перед отправкой
    if (!validateData()) return;

    const pressureData = {
      measurements: pressures.map(pressure => ({
        upper: pressure.upper,
        lower: pressure.lower,
        pulse: pressure.pulse,
        date: pressure.date,
      })),
    };

    try {
      const newPressure = await addPressures(clientData.id, pressureData);
      console.log("Новый замер давления добавлен:", newPressure);
      await navigation.navigate('Main');
    } catch (error) {
      console.error("Ошибка при добавлении замера давления:", error);
    }

    await dispatch({
      type: "SET_CLIENT_DATA",
      payload: {
        id: "a",  // Оставляем только id
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
  console.log(pressures)
  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Давление</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Add')}>
            <Image source={require('./src/HomeOutline.svg')} style={styles.imageMenuAccount} />
          </TouchableOpacity>
        </View>

        {/* Динамическое отображение всех измерений */}
        <FlatList
          data={[...pressures, { isAddButton: true }]} // Добавляем виртуальный элемент для кнопки "+"
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            if (item.isAddButton) {
              return (
                <TouchableOpacity style={styles.addButton} onPress={addPressure}>
                  <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
              );
            }
            return (
              <View key={index} style={styles.inputGroup}>
                <Text style={styles.subHeader}>Измерение</Text>
                {errors[index]?.empty && (
                    <Text style={styles.errorText}>{errors[index].empty}</Text>
                  )}
                  
                <View style={styles.row}>

                  <TextInput
                    value={item.upper}
                    onChangeText={(text) => handleInputChange(index, 'upper', text)}
                    placeholder="Верхнее"
                    placeholderTextColor="#BDBDBD"
                    style={[
                      styles.inputSmall,
                      styles.inputWide,
                      errors[index]?.empty || errors[index]?.number || errors[index]?.positive ? styles.inputError : {},
                    ]}
                    keyboardType="numeric"
                  />
                  
                  <TextInput
                    value={item.lower}
                    onChangeText={(text) => handleInputChange(index, 'lower', text)}
                    placeholder="Нижнее"
                    placeholderTextColor="#BDBDBD"
                    style={[
                      styles.inputSmall,
                      styles.inputWide,
                      errors[index]?.empty || errors[index]?.number || errors[index]?.positive ? styles.inputError : {},
                    ]}
                    keyboardType="numeric"
                  />
                  
                  <TextInput
                    value={item.pulse}
                    onChangeText={(text) => handleInputChange(index, 'pulse', text)}
                    placeholder="Пульс"
                    placeholderTextColor="#BDBDBD"
                    style={[
                      styles.inputSmall,
                      styles.inputNarrow,
                      errors[index]?.empty || errors[index]?.number || errors[index]?.positive ? styles.inputError : {},
                    ]}
                    keyboardType="numeric"
                  />
                </View>
               

                <TouchableOpacity  onPress={() => {setSelectedIndex(index);setIsDatePickerVisible(true);}} style={styles.buttonDate}>
                  <View style={styles.datePickerContainer}>
                    <Text style={[styles.dateText, errors[index]?.empty ? styles.inputError : {},]}>{item.date || 'Выберите дату'}</Text>
                    <svg width="14" height="16" viewBox="0 0 14 16" style={styles.image}fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.66667 1.33337V4.00004M4.33333 1.33337V4.00004M1 6.66671H13M2.33333 2.66671H11.6667C12.403 2.66671 13 3.26366 13 4.00004V13.3334C13 14.0698 12.403 14.6667 11.6667 14.6667H2.33333C1.59695 14.6667 1 14.0698 1 13.3334V4.00004C1 3.26366 1.59695 2.66671 2.33333 2.66671Z" stroke="#333333" stroke-opacity="0.36" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </View>
                </TouchableOpacity>

                <Modal
                  visible={isDatePickerVisible}
                  animationType="fade"
                  transparent={true}
                  onRequestClose={() => setIsDatePickerVisible(false)}
                >
                  <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                      <Text style={styles.modalHeader}>{pressures[index].date & "Выберите дату приема"}</Text>
                      <DatePicker
                        mode="calendar"
                        selectedDate={pressures[index].date}
                        onDateChange={(date) => handleDateChangePressure(date)} 
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
                        onPress={() => setIsDatePickerVisible(false)}
                      >
                        <Text style={styles.closeButtonText}>Закрыть</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
                
              </View>
            );
          }}
          contentContainerStyle={{ paddingBottom: height * 0.06 }}
        />

        <TouchableOpacity onPress={handleAddPressure} style={styles.button}>
          <Text style={styles.buttonText}>Добавить</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    height: height,
  },
  container: {
    flex: 1,
    padding: width * 0.05,
    backgroundColor: '#fbfbfb',
  },

  header: {
    fontSize: width * 0.085,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: width * 0.03,
  },
  headerContainer: {
    flexDirection: 'row',
    gap: width * 0.001,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imageMenuAccount: {
    width: width * 0.06,
    height: width * 0.06,
    resizeMode: 'contain',
  },
  subHeader: {
    fontSize: width * 0.043,
    color: '#000',
    marginBottom: width * 0.025,
    fontWeight: 'bold',
  },
  inputGroup: {
    marginBottom: width * 0.025,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: width * 0.025,
  },
  inputSmall: {
    borderWidth: 1,
    borderColor: '#BDBDBD',
    borderRadius: 12,
    padding: width * 0.035,
    fontSize: width * 0.04,
    backgroundColor: '#FBFBFB',
    textAlign: 'center',
  },
  inputWide: {
    width: width * 0.33, // Примерно 35% ширины экрана
  },
  inputNarrow: {
    width: width * 0.2, // Примерно 20% ширины экрана
  },
  input: {
    borderWidth: 1,
    borderColor: '#BDBDBD',
    borderRadius: 12,
    padding: width * 0.035,
    paddingLeft: width * 0.05,
    fontSize: width * 0.04,
    backgroundColor: '#FBFBFB',
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: width * 0.035,
    marginTop: width * 0.005,
  },
  addButton: {
    backgroundColor: '#FBFBFB',
    borderWidth: 1,
    borderColor: '#BDBDBD',
    paddingVertical: width * 0.035,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: width * 0.025,
  },
  addButtonText: {
    color: '#BDBDBD',
    fontSize: width * 0.04,
    fontWeight: 'bold',
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
  button: {
    marginTop: height * 0.005,
    backgroundColor: '#2F80ED',
    padding: width * 0.03,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: width * 0.05,
    fontWeight: 'bold',
  },
});

export default AddPressure;
