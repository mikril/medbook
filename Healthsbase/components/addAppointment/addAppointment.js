import React, { useState } from 'react';
import { Text, TextInput, Modal, View, StyleSheet, TouchableOpacity, Image, Dimensions, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useClientData } from '../../ClientDataContext';
import { launchImageLibrary } from 'react-native-image-picker';
import { handleSubmit, addAppointment } from './api';
import DatePicker from 'react-native-modern-datepicker';



const { width, height } = Dimensions.get('window');

const AddAppointment = () => {
  const { state, dispatch } = useClientData();
  const clientData = state.clientData;
  const [imageUri, setImageUri] = useState(null);
  const [doctorType, setDoctorType] = useState('');
  const [clinic, setClinic] = useState('');
  const [doctorFio, setDoctorFio] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [comment, setComment] = useState('');
  
  const [dateNextAppointment, setDateNextAppointment] = useState('');
  const [errors, setErrors] = useState({});

  const [dateAppointment, setDateAppointment] = useState(''); // Храним дату приема
  const [isModalVisible, setIsModalVisible] = useState(false); // Состояние для модального окна
  const [isAppointmentModalVisible, setIsAppointmentModalVisible] = useState(false);
  const [isNextAppointmentModalVisible, setIsNextAppointmentModalVisible] = useState(false);


  const handleDateChangeAppointment = (date) => {
    setDateAppointment(date); // Обновляем дату приема
    setIsAppointmentModalVisible(false);  // Закрываем модальное окно
  };
  
  const handleDateChangeNextAppointment = (date) => {
    setDateNextAppointment(date); // Обновляем дату следующего приема
    setIsNextAppointmentModalVisible(false);  // Закрываем модальное окно
  };
  
  const navigation = useNavigation();

  const handleImagePick = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.assets && response.assets[0]) {
        const selectedImage = response.assets[0];
        setImageUri(selectedImage.uri);

        handleSubmit(selectedImage, setDoctorType, setDateAppointment, setClinic, setDoctorFio, setDiagnosis, setComment, setDateNextAppointment); 
      }
    });
  };

  const validateFields = () => {
    const newErrors = {};
    if (!doctorType.trim()) newErrors.doctorType = 'Укажите тип врача';
    if (!dateAppointment.trim()) newErrors.dateAppointment = 'Укажите дату приёма';
    if (!clinic.trim()) newErrors.clinic = 'Укажите клинику';
    if (!doctorFio.trim()) newErrors.doctorFio = 'Укажите ФИО врача';
    if (!diagnosis.trim()) newErrors.diagnosis = 'Укажите диагноз';
    if (!comment.trim()) newErrors.comment = 'Укажите назначение врача';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddAppointment = async () => {
    if (!validateFields()) return;

    const appointmentData = {
      specialization_doctor: doctorType,
      date_appointment: dateAppointment.replace(/\//g, '-').replace('.', '-'),
      name_clinic: clinic,
      doctor_name: doctorFio,
      diagnosis: diagnosis,
      doctor_prescription: comment || "",
      date_next_appointment: dateNextAppointment || null,
      photo_appointment: imageUri || "",
    };

    try {
      const newAppointment = await addAppointment(clientData.id, appointmentData);
      console.log("Новый приём врача добавлен:", newAppointment);
      await dispatch({
        type: "SET_CLIENT_DATA",
        payload: { appointments: [newAppointment] },
      });
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
      navigation.navigate('Main');
    } catch (error) {
      console.error("Ошибка при добавлении приёма врача:", error);
      Alert.alert("Ошибка", "Не удалось добавить приём врача");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Прием врача</Text>
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
        {errors.doctorType && <Text style={styles.errorText}>{errors.doctorType}</Text>}
        <TextInput
          value={doctorType}
          onChangeText={setDoctorType}
          placeholder="Врач"
          placeholderTextColor="#BDBDBD"
          style={[styles.input, errors.doctorType && styles.errorInput]}
        />
        
        {errors.dateAppointment && (<Text style={styles.errorText}>{errors.dateAppointment}</Text>)}
        <TouchableOpacity style={styles.buttonDate} onPress={() => setIsAppointmentModalVisible(true)}>
          <View style={styles.datePickerContainer}>
            <Text>{dateAppointment || 'Выберите дату'}</Text>
            <svg width="14" height="16" viewBox="0 0 14 16" style={styles.image}fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.66667 1.33337V4.00004M4.33333 1.33337V4.00004M1 6.66671H13M2.33333 2.66671H11.6667C12.403 2.66671 13 3.26366 13 4.00004V13.3334C13 14.0698 12.403 14.6667 11.6667 14.6667H2.33333C1.59695 14.6667 1 14.0698 1 13.3334V4.00004C1 3.26366 1.59695 2.66671 2.33333 2.66671Z" stroke="#333333" stroke-opacity="0.36" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </View>
        </TouchableOpacity>

        {/* Модальное окно для выбора даты */}
        <Modal
          visible={isAppointmentModalVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setIsAppointmentModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeader}>Выберите дату приема</Text>
              <DatePicker
                mode="calendar"
                selectedDate={dateAppointment}
                onDateChange={handleDateChangeAppointment} // Обработчик для dateAppointment
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
                onPress={() => setIsAppointmentModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Закрыть</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {errors.clinic && <Text style={styles.errorText}>{errors.clinic}</Text>}
        <TextInput
          value={clinic}
          onChangeText={setClinic}
          placeholder="Клиника"
          placeholderTextColor="#BDBDBD"
          style={[styles.input, errors.clinic && styles.errorInput]}
        />

        {errors.doctorFio && <Text style={styles.errorText}>{errors.doctorFio}</Text>}
        <TextInput
          value={doctorFio}
          onChangeText={setDoctorFio}
          placeholder="ФИО врача"
          placeholderTextColor="#BDBDBD"
          style={[styles.input, errors.doctorFio && styles.errorInput]}
        />

        {errors.diagnosis && <Text style={styles.errorText}>{errors.diagnosis}</Text>}
        <TextInput
          value={diagnosis}
          onChangeText={setDiagnosis}
          placeholder="Диагноз"
          placeholderTextColor="#BDBDBD"
          style={[styles.diagnosis, errors.diagnosis && styles.errorInput]}
          multiline
        />

        
        {errors.comment && <Text style={styles.errorText}>{errors.comment}</Text>}
        <TextInput
          value={comment}
          onChangeText={setComment}
          placeholder="Назначение врача"
          placeholderTextColor="#BDBDBD"
          style={[styles.appointment, errors.diagnosis && styles.errorInput]}
          multiline
        />
        
        {errors.dateNextAppointment && <Text style={styles.errorText}>{errors.dateNextAppointment}</Text>}
        <TouchableOpacity style={styles.buttonDate} onPress={() => setIsNextAppointmentModalVisible(true)}>
          <View style={styles.datePickerContainer}>
            <Text>{dateNextAppointment || 'Выберите дату'}</Text>
            <svg width="14" height="16" viewBox="0 0 14 16" style={styles.image} fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.66667 1.33337V4.00004M4.33333 1.33337V4.00004M1 6.66671H13M2.33333 2.66671H11.6667C12.403 2.66671 13 3.26366 13 4.00004V13.3334C13 14.0698 12.403 14.6667 11.6667 14.6667H2.33333C1.59695 14.6667 1 14.0698 1 13.3334V4.00004C1 3.26366 1.59695 2.66671 2.33333 2.66671Z" stroke="#333333" stroke-opacity="0.36" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </View>
        </TouchableOpacity>

        {/* Модальное окно для выбора даты */}
        <Modal
          visible={isNextAppointmentModalVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setIsNextAppointmentModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeader}>Выберите дату следующего приема</Text>
              <DatePicker
                mode="calendar"
                selectedDate={dateNextAppointment}
                onDateChange={handleDateChangeNextAppointment}
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
                onPress={() => setIsNextAppointmentModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Закрыть</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>


        <TouchableOpacity onPress={handleAddAppointment} style={styles.button}>
          <Text style={styles.buttonText}>Добавить</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FBFBFB',
    height: height,
  },
  scrollContent: {
    padding: width * 0.05,
    
    overflow: "scroll",
  },
  headerContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: height * 0.012,
  },
  header: {
    fontSize: width * 0.085,
    fontWeight: 'bold',
    color: '#000',
  },
  overlayText: {
    fontSize: width * 0.042,
    color: '#333',
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
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Полупрозрачный белый фон
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholder: {
    color: '#BDBDBD',
    fontSize: width * 0.042,
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
  input: {
    borderColor: '#BDBDBD',
    fontSize: width * 0.042,
    color: '#333',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: width * 0.035,
    paddingVertical: height * 0.017,
    marginBottom: width * 0.03,
  },
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: width * 0.035,
    marginBottom: width * 0.02,
  },
  diagnosis: {
    fontSize: width * 0.042,
    borderColor: '#BDBDBD',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: width * 0.035,
    paddingVertical: height * 0.01,
    marginBottom: width * 0.03,
    minHeight: height * 0.13,
  },
  appointment: {
    fontSize: width * 0.042,
    borderColor: '#BDBDBD',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: width * 0.035,
    paddingVertical: height * 0.01,
    marginBottom: width * 0.03,
    minHeight: height * 0.18,
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
});

export default AddAppointment;
