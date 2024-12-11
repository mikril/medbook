import React, { useState } from 'react';
import { Text, TextInput, View, StyleSheet, TouchableOpacity, Image, Dimensions, FlatList } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import { handleSubmit } from './api'; // Импортируем функцию handleSubmit

const { width, height } = Dimensions.get('window');

const AddAnalyzes = () => {
  const [imageUri, setImageUri] = useState(null);
  const [date, setDate] = useState('');
  const [analyzes, setAnalyzes] = useState([]);

  const navigation = useNavigation();

  // Функция для выбора изображения из галереи
  const handleImagePick = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.assets && response.assets[0]) {
        const selectedImage = response.assets[0];
        setImageUri(selectedImage.uri); // Сохраняем URI изображения
        
        // Передаем изображение в handleSubmit
        handleSubmit(selectedImage, setDate, setAnalyzes);
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
      { name: '', value: '' }, // Добавляем новый анализ с пустыми полями
    ]);
  };

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
        <TextInput
          value={date}
          onChangeText={setDate}
          placeholder="Дата"
          placeholderTextColor="#BDBDBD"
          style={styles.input}
        />
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
                <TextInput
                  value={item.name}
                  onChangeText={(text) => handleAnalyzesChange(index, 'name', text)}
                  placeholder="Название анализа"
                  placeholderTextColor="#BDBDBD"
                  style={styles.flatListName}
                />
                <TextInput
                  value={item.value}
                  onChangeText={(text) => handleAnalyzesChange(index, 'value', text)}
                  placeholder="Значение"
                  placeholderTextColor="#BDBDBD"
                  style={styles.flatListValue}
                />
              </View>
            );
          }}
          contentContainerStyle={{ paddingBottom: height * 0.01 }} // Отступ для кнопки "Добавить" внизу
        />
        <TouchableOpacity style={styles.button}>
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
    gap: width * 0.03,
  },
  flatListName: {
    width: width * 0.7,
    fontSize: width * 0.04,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.03,
    marginBottom: height * 0.012,
  },
  flatListValue: {
    width: width * 0.3,
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
});

export default AddAnalyzes;
