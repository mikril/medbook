import React, { useState } from 'react';
import { Text, TextInput, View, StyleSheet, TouchableOpacity, Image, Dimensions, ScrollView,FlatList  } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const { width, height } = Dimensions.get('window');

const AddPressure = () => {
  // Состояние для хранения списка измерений
  const [pressures, setPressures] = useState([
    { upper: '', lower: '', pulse: '', date: '' },
  ]);

  // Функция для добавления нового набора полей
  const addPressure = () => {
    setPressures([
      ...pressures,
      { upper: '', lower: '', pulse: '', date: '' },
    ]);
  };

  // Функция для обновления конкретного поля в измерении
  const handleInputChange = (index, field, value) => {
    const updatedPressures = [...pressures];
    updatedPressures[index][field] = value;
    setPressures(updatedPressures);
  };

  const navigation = useNavigation();

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
          <View style={styles.row}>
          <TextInput
            value={item.upper}
            onChangeText={(text) => handleInputChange(index, 'upper', text)}
            placeholder="Верхнее"
            placeholderTextColor="#BDBDBD"
            style={[styles.inputSmall, styles.inputWide]}
          />
          <TextInput
            value={item.lower}
            onChangeText={(text) => handleInputChange(index, 'lower', text)}
            placeholder="Нижнее"
            placeholderTextColor="#BDBDBD"
            style={[styles.inputSmall, styles.inputWide]}
          />
          <TextInput
            value={item.pulse}
            onChangeText={(text) => handleInputChange(index, 'pulse', text)}
            placeholder="Пульс"
            placeholderTextColor="#BDBDBD"
            style={[styles.inputSmall, styles.inputNarrow]}
          />
          </View>
          <TextInput
            value={item.date}
            onChangeText={(text) => handleInputChange(index, 'date', text)}
            placeholder="Дата"
            placeholderTextColor="#BDBDBD"
            style={styles.input}
          />
        </View>
                );
              }}
              contentContainerStyle={{ paddingBottom: height * 0.06 }}
            />

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText} >Добавить</Text>
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
    textAlign: "center",
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
  button: {
    marginTop: height*0.005,
      backgroundColor: '#2F80ED',
    padding: width * 0.03,
    borderRadius: 12,
    alignItems: 'center',
    position: 'absolute',
    bottom: width * 0.05,
    left: width * 0.05,
    right: width * 0.05,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default AddPressure;
