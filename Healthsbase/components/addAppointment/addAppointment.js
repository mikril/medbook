import React, { useState } from 'react';
import { Text,TextInput, View, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import { handleSubmit } from './api'; // Если потребуется интеграция с сервером

const { width, height } = Dimensions.get('window');

const AddAppointment = () => {
  const [imageUri, setImageUri] = useState(null); 
  const [doctorType, setDoctorType] = useState('');
  const [dateAppointment, setDateAppointment] = useState('');
  const [clinic, setClinic] = useState('');
  const [doctorFio, setDoctorFio] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [comment, setComment] = useState('');
  const [dateNextAppointment, setDateNextAppointment] = useState('');

  const navigation = useNavigation();

  // Функция для выбора изображения из галереи
  const handleImagePick = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.assets && response.assets[0]) {
        const selectedImage = response.assets[0];
        
        setImageUri(selectedImage.uri); // Сохраняем URI изображения
        
        // Передаем функции для обновления состояния
        handleSubmit(selectedImage, setDoctorType, setDateAppointment, setClinic, setDoctorFio, setDiagnosis, setComment, setDateNextAppointment); 
      }
    });
  };

  return (
    <View style={styles.container}>
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

      <TextInput
        value={doctorType}
        onChangeText={setDoctorType}
        placeholder="Врач"
        placeholderTextColor="#BDBDBD"
        style={styles.input}
        
      />
      <TextInput
        value={dateAppointment}
        onChangeText={setDateAppointment}
        placeholder="Дата приема"
        placeholderTextColor="#BDBDBD"
        style={styles.input}
        
      />
      <TextInput
        value={clinic}
        onChangeText={setClinic}
        placeholder="Клинка"
        placeholderTextColor="#BDBDBD"

        style={styles.input}
        
      />
      <TextInput
        value={doctorFio}
        onChangeText={setDoctorFio}
        placeholder="ФИО врача"
        placeholderTextColor="#BDBDBD"

        style={styles.input}
        
      />

      <TextInput
        value={diagnosis}
        onChangeText={setDiagnosis}
        placeholder="Диагноз"
        placeholderTextColor="#BDBDBD"

        style={styles.diagnosis}
        multiline
      />
      <TextInput
        value={comment}
        onChangeText={setComment}
        placeholder="Назначение врача"
        placeholderTextColor="#BDBDBD"

        style={styles.appointment}
        multiline
      />
      <TextInput
        value={dateNextAppointment}
        onChangeText={setDateNextAppointment}
        placeholder="Дата следующего приема"
        placeholderTextColor="#BDBDBD"

        style={styles.input}
        
      />
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText} >Добавить</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: width * 0.05,  // Отступы относительно ширины экрана
    backgroundColor: '#FBFBFB',
    overflow:"scroll",
  },
  header: {
    fontSize: width * 0.085,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: width * 0.03,
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
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    color: '#BDBDBD',
    fontSize: width * 0.042,
  },
  headerContainer: {
    flexDirection: 'row', // Размещение элементов в строку
    justifyContent: 'space-between', // Заголовок слева, кнопка справа
    alignItems: 'center', // Выравнивание по центру вертикали

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
  },
  diagnosis: {
    fontSize: width * 0.042,
    borderColor: '#BDBDBD',
    color: '#333',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: width * 0.035,
    paddingVertical: height * 0.01,
    marginBottom: width * 0.03,
    textAlignVertical: 'top', // Важно для многострочного текста
    minHeight: height*0.13,
  },
  appointment: {
    fontSize: width * 0.042,
    borderColor: '#BDBDBD',
    color: '#333',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: width * 0.035,
    paddingVertical: height * 0.01,
    marginBottom: width * 0.03,
    textAlignVertical: 'top', // Важно для многострочного текста
    minHeight: height*0.18,
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
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.85)', // Полупрозрачный белый фон
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayText: {
    fontSize: width * 0.042,
    color: '#333',
  },
});

export default AddAppointment;