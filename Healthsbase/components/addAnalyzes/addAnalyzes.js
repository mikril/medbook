import React, { useState } from 'react';
import { Text, TextInput, View, Modal, StyleSheet, TouchableOpacity, Image, Dimensions, FlatList } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import { useClientData } from '../../ClientDataContext';
import { handleSubmit } from './api'; // Импортируем функцию handleSubmit
import { addAnalyze2 } from './api';
import DatePicker from 'react-native-modern-datepicker';
import  Loading  from '../loading/loading';

const { width, height } = Dimensions.get('window');

const AddAnalyzes = () => {
  const { state, dispatch } = useClientData();
  const clientData = state.clientData;
  const [imageUri, setImageUri] = useState(null);
  const [date, setDate] = useState('');
  const [analyzes, setAnalyzes] = useState([]);
  const [errors, setErrors] = useState({ date: '', analyzes: [] });  // Стейт для ошибок
  const navigation = useNavigation();
  const validateDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value);
  const validateAnalyzeName = (value) => value.trim().length > 0;
  const validateAnalyzeValue = (value) => /^[\d.,!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?а-яА-Яa-zA-Z\s]*$/.test(value);

  const [isModalVisible, setIsModalVisible] = useState(false); 
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  const handleDateChangeAnalyze = (date) => {
    setDate(date.replace(/\//g, '-')); // Обновляем дату приема
    setIsDatePickerVisible(false);  // Закрываем модальное окно
  };

  const validateForm = () => {
    const newErrors = {
      date: validateDate(date) ? '' : 'Дата должна быть в формате YYYY-MM-DD',
      analyzes: analyzes.map((analyze) => ({
        name: validateAnalyzeName(analyze.name) ? '' : 'Обязательное',
        value: validateAnalyzeValue(analyze.value) ? '' : 'число значение',
      })),
    };
    setErrors(newErrors);
    return !newErrors.date && newErrors.analyzes.every((analyze) => !analyze.name && !analyze.value);
  };

   const [loading, setLoading] = useState(false);
  const handleImagePick = () => {
    launchImageLibrary({ mediaType: 'photo' }, async (response) => {
      if (response.assets && response.assets[0]) {
        const selectedImage = response.assets[0];
        setImageUri(selectedImage.uri); // Сохраняем URI изображения
        
        try {
          setLoading(true);  // Start loading
          await handleSubmit(selectedImage, setDate, setAnalyzes); 
        } catch (error) {
              Alert.alert("Ошибка", "Не удалось загрузить изображение");
            } finally {
              console.log(analyzes);
              setLoading(false);  // Stop loading
            }
      }
    });
  };

  // Функция для изменения данных анализов
  const handleAnalyzesChange = (index, field, value) => {
    const updatedAnalyzes = [...analyzes];
    updatedAnalyzes[index][field] = value; 
    setAnalyzes(updatedAnalyzes);
  };

  // Функция для добавления нового набора полей
  const addAnalyze = () => {
    setAnalyzes([
      ...analyzes,
      { name: '', value: ''}, // Добавляем новый анализ с пустыми полями
    ]);
  };

  const handleAddAnalyze = async () => {
    if (!validateForm()) {
      return; // Прерываем выполнение, если форма не прошла валидацию
    }
    const analyzeData = {
      date: date.replace(/\//g, '-'),
      file: imageUri || "",
      analyzes: analyzes.map(analyze => ({
        name: analyze.name,  // Имя анализа из каждого элемента
        value: parseInt(analyze.value.split(" ")[0], 10), // Значение анализа из каждого элемента
        unit: analyze.value.split(" ")[1],
      }))
    };
    console.log(analyzeData)
    try {
      const newAnalyze = await addAnalyze2(clientData.id, analyzeData);
      console.log("Новый анализ добавлен:", newAnalyze);
      await navigation.navigate('Main');
    } catch (error) {
      console.error("Ошибка при добавлении анализа:", error);
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
  if (loading){
    return <Loading/>
  }
  
  return (
    <View style={styles.page}>

      <View style={styles.container}>
        <View style={styles.headerContainer}>
            <Text style={styles.header}>Анализы</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Add')}>
              <Image source={require('./src/HomeOutline.svg')} style={styles.imageMenuAccount} />
            </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.imageContainer} onPress={handleImagePick}>
        {imageUri ? (
          <>
            <Image source={{ uri: imageUri }} style={styles.image} />
            <View style={styles.overlay}>
              <Text style={styles.overlayText}>Загрузите файл</Text>
            </View>
          </>
        ) : (
          <Text style={styles.imagePlaceholder}>Загрузите файл</Text>
        )}

        </TouchableOpacity>
        
        {errors.date && <Text style={styles.errorText}>{errors.date}</Text>}
        <TouchableOpacity style={styles.buttonDate} onPress={() => setIsDatePickerVisible(true)}>
          <View style={styles.datePickerContainer}>
            <Text>{date || 'Выберите дату'}</Text>
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
              <Text style={styles.modalHeader}>Выберите дату приема</Text>
              <DatePicker
                mode="calendar"
                selectedDate={date}
                onDateChange={handleDateChangeAnalyze} 
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

        <Text style={styles.text}>Показатель</Text>

        <FlatList
          data={[...analyzes, { isPlusButton: true }]} // Добавляем виртуальный элемент для кнопки "+"
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            if (item.isPlusButton) {
              return (
                <TouchableOpacity style={styles.buttonAdd} onPress={addAnalyze}>
                  <Text style={{ fontSize: width * 0.045, color: '#8B8B8B' }}>+</Text>
                </TouchableOpacity>
              );
            }
            return (
              <View style={styles.flatListItem}>
                <View >
                <Text style={styles.errorText}>{(errors.analyzes[index]?.name && errors.analyzes[index].name) || '\u00A0'}</Text>
                <TextInput
                  value={item.name}
                  onChangeText={(text) => handleAnalyzesChange(index, 'name', text)}
                  placeholder="Название анализа"
                  placeholderTextColor="#BDBDBD"
                  style={styles.flatListName}
                />
                </View>
                <View >
                 <Text style={styles.errorText}>{(errors.analyzes[index]?.value && errors.analyzes[index].value) || '\u00A0'}</Text>
                <TextInput
                  value={item.value}
                  onChangeText={(text) => handleAnalyzesChange(index, 'value', text)  }
                  placeholder="Значение"
                  placeholderTextColor="#BDBDBD"
                  style={styles.flatListValue}
                />
                </View>
              </View>
            );
          }}
          contentContainerStyle={{ paddingBottom: height * 0.01 }} 
        />
        <TouchableOpacity onPress={handleAddAnalyze} style={styles.button}>
          <Text style={styles.buttonText}>Добавить</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    height: height
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
  },
  headerContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: height * 0.012,
  },
  text: {
    marginBottom: height * 0.012,
    fontSize: width * 0.045,
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
  imageContainer: {
    paddingHorizontal: width * 0.035,
    paddingVertical: height * 0.01,
    height: height*0.12,
    marginBottom: height*0.012,
    borderWidth: 1,
    borderColor: '#BDBDBD',
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: '100%',
  },
  imagePlaceholder: {
    color: '#BDBDBD',
    fontSize: width * 0.042,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.85)', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayText: {
    fontSize: width * 0.042,
    color: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },

  input: {
    fontSize: width * 0.04,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.03,
    marginBottom: height * 0.012,
  },
  flatListItem: {
    flexDirection: 'row', 
    alignItems: 'center',
    gap: width * 0.02,
  },
  flatListName: {
    width: width * 0.50,
    fontSize: width * 0.04,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.03,
    marginBottom: height * 0.012,
    
  },
  flatListValue: {
    width: width * 0.38,
    fontSize: width * 0.04,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.03,
    marginBottom: height * 0.012,
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
    marginBottom: height * 0.012,
  },

  button: {
    backgroundColor: '#2F80ED',
    padding: width * 0.03,
    alignItems: 'center',
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: width * 0.035,
    color: 'red',
    marginBottom: height * 0.012,
  },
});

export default AddAnalyzes;
