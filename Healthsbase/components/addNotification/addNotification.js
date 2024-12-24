import React, { useState } from 'react';
import { TouchableOpacity, Text, View, Image, Dimensions, StyleSheet } from 'react-native';
import AddAppointment from './addAppointment/addAppointment';
import AddMedecine from './addMedecine/addMedecine';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const AddNotification = () => {
  const [isMedicineSelected, setIsMedicineSelected] = useState(true);

  const navigation = useNavigation();

  const handleMedicinePress = () => {
    setIsMedicineSelected(true);
  };

  const handleAppointmentPress = () => {
    setIsMedicineSelected(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Напоминание</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Add')}>
          <Image
            source={require('./src/HomeOutline.svg')}
            style={styles.imageMenuAccount}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.toggle}>
        <TouchableOpacity
          onPress={handleMedicinePress}
          style={[
            styles.toggleButton,
            isMedicineSelected ? styles.selectedButton : styles.unselectedButton,
          ]}
        >
          <Text
            style={[
              styles.toggleButtonText,
              isMedicineSelected ? styles.textButtonSelected : styles.textButton,
            ]}
          >
            Лекарство
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleAppointmentPress}
          style={[
            styles.toggleButton,
            !isMedicineSelected ? styles.selectedButton : styles.unselectedButton,
          ]}
        >
          <Text
            style={[
              styles.toggleButtonText,
              !isMedicineSelected ? styles.textButtonSelected : styles.textButton,
            ]}
          >
            Прием
          </Text>
        </TouchableOpacity>
      </View>
      {isMedicineSelected ? <AddMedecine /> : <AddAppointment />}

      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: width * 0.05,
    backgroundColor: '#FBFBFB',
  },
  header: {
    fontSize: width * 0.085,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: width * 0.03,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  toggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  toggleButton: {
    width: width * 0.435,
    borderRadius: 30,
    paddingVertical: height * 0.01,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#2F80ED',
  },
  unselectedButton: {
    backgroundColor: '#FBFBFB',
    borderWidth: 1,
    borderColor: '#BDBDBD',
  },
  toggleButtonText: {
    fontSize: width * 0.04,
  },
  textButtonSelected: {
    color: '#FFFFFF',
  },
  textButton: {
    color: '#BDBDBD',
  },
});

export default AddNotification;
