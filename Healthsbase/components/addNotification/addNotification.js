import React, { useState } from 'react';
import { TouchableOpacity, Text, View, Image, Dimensions, StyleSheet } from 'react-native';
import AddAppointment from './addAppointment/addAppointment';
import AddMedecine from './addMedecine/addMedecine';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const AddNotification = () => {
  const [isMedicineSelected, setIsMedicineSelected] = useState(true); // Track which button is selected

  const navigation = useNavigation();

  const handleMedicinePress = () => {
    setIsMedicineSelected(true); // Show AddMedecine when Лекарство is pressed
  };

  const handleAppointmentPress = () => {
    setIsMedicineSelected(false); // Show AddAppointment when Прием is pressed
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Напоминание</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Add')}>
            <Image source={require('./src/HomeOutline.svg')} style={styles.imageMenuAccount} />
        </TouchableOpacity>
      </View>
      <View  style={styles.toggle}>
      <TouchableOpacity onPress={handleMedicinePress} style={styles.selectedButton}>
        <Text style={styles.textButtonSelected}>Лекарство</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleAppointmentPress} style={styles.unselectedButton}>
        <Text style={styles.textButton}>Прием</Text>
      </TouchableOpacity>
      </View>
      {isMedicineSelected ? (
        <AddMedecine />
      ) : (
        <AddAppointment />
      )}

  <TouchableOpacity style={styles.button}>
      <Text style={styles.buttonText} >Сохранить</Text>
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
    position: 'relative'
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
button: {
  backgroundColor: '#2F80ED',
  padding: width * 0.03,
  alignItems: 'center',
  borderRadius: 12,
  position: "fixed",
  bottom: "10px",
  width: width * 0.9
},
buttonText: {
  color: '#fff',
  fontWeight: 'bold',
},

  unselectedButton: {
    backgroundColor: "#FFFFFF",
    color: "#FFFFFF",
    borderColor: "#BDBDBD",
    borderWidth: 1  ,
    borderRadius: 30,
    paddingVertical: "4px",
    alignContent: "center",
    width: width*0.42,
  },
  selectedButton: {
    backgroundColor: "#2F80ED",
    color: "#BDBDBD",
    borderRadius: 30,
    width: width*0.42,
    paddingVertical: "4px",
    alignContent: "center",
  },
  toggle: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: "10px"
  },
  textButtonSelected: {
    textAlign: "center",
    
    fontSize: width * 0.04,
    color: "#FFFFFF"
  },
  textButton: {
    textAlign: "center",
    
    fontSize: width * 0.04,
    color: "#BDBDBD"
  }
});

export default AddNotification;
