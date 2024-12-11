  import React, { useState } from 'react';
import { TouchableOpacity,FlatList, Image ,Modal , Text, View,Button, StyleSheet, Dimensions, TextInput, Platform } from 'react-native';
import { TimePickerModal } from 'react-native-paper-dates';
import DatePicker from 'react-native-modern-datepicker';
const { width, height } = Dimensions.get('window');
const AddMedecine = () => {
  const [name, setName] = useState('');
  const [doze, setDoze] = useState('');
  const [isEveryDay, setIsEveryDay] = useState(false);
  const [times, setTimes] = useState([]);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [isModalStartVisible, setIsModalStartVisible] = useState(false);
  const [isModalEndVisible, setIsModalEndVisible] = useState(false);
  const [n, setN] = useState(0);

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
  return (
    <View>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Название"
        style={styles.input}
      />
      <TextInput
        value={doze}
        onChangeText={setDoze}
        placeholder="Дозировка"
        style={styles.input}
      />
       <Text style={styles.text}>Часы приёма лекарств</Text>
      <FlatList
      contentContainerStyle={styles.listMeasurements}
        data={times}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Text style={styles.addTime}>{item}</Text>
      )}
      />

      <TouchableOpacity onPress={openPicker} style={styles.addTime}>Добавить время</TouchableOpacity>
      

      <TimePickerModal
        visible={visible}
        onDismiss={closePicker}
        onConfirm={onConfirm}
        hours={12} // начальные часы
        minutes={0} // начальные минуты
        label="Выберите время"
        animationType="fade"
      />


      <Text style={styles.text}>Период приёма лекарств</Text>
      <View style={styles.dateBlock}>
      <TouchableOpacity style={styles.buttonDate} onPress={() => setIsModalVisible(true)}>
        <View style={styles.datePickerContainer}>
          <Text>{selectedStartDate || 'Выберите дату'}</Text>
          <Image source={require('./src/Vector.svg')} style={styles.image} />
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
      <TouchableOpacity style={styles.buttonDate} onPress={() => setIsModalVisible(true)}>
        <View style={styles.datePickerContainer}>
          <Text>{selectedEndDate || 'Выберите дату'}</Text>
          <Image source={require('./src/Vector.svg')} style={styles.image} />
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
            ><Text style={styles.closeButtonText}>Закрыть</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

            </View>
      {/* Checkbox for "Every Day" */}
     
      <Text style={styles.text}>Принимать лекарство раз в 
        <TextInput
        value={n}
        onChangeText={setN}
        placeholder="n"
        style={styles.inputDays}

      /> дней</Text>
    </View>
  );
};

const styles = StyleSheet.create({
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
  timeButton: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
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
    borderRadius: 8,
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
    padding: "4px",
    marginTop: "8px",
    marginBottom: "16px"
  },
  listMeasurements: {
    display: "flex",
    flexDirection: "row",
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
    color: '#333',
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: width * 0.03,
    textAlignVertical: 'top', // Важно для многострочного текста
    width: 50,
    marginHorizontal: "6px",
    textAlign: "center",  
  }
});

export default AddMedecine;
