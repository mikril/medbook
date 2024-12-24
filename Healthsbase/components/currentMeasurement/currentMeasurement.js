import React, { useState, useEffect } from 'react';
import {TouchableOpacity,Text, View, FlatList, StyleSheet, Dimensions, Image } from 'react-native';
import { useClientData } from '../../ClientDataContext';
import { useNavigation } from '@react-navigation/native';
import NavigationPanel from '../navigationPanel/navigationPanel';
import PressureChartOnly from './pressureChartOnly/pressureChartOnly';
import { deleteMeasurement } from './api';

const { width, height } = Dimensions.get('window');
const CurrentMeasurement = ({ route }) => {
  const [data, setData] = useState([]);
  const [paddingVertical, setPaddingVertical] = useState(0);
  const { title} = route.params;
  const { state, dispatch } = useClientData();
  const clientData = state.clientData;

  const navigation = useNavigation();

  // Получение данных по `title` из массива `allMeasurements`
  useEffect(() => {
    const filteredData = clientData.allMeasurements.find(item => item.title === title);
    
    if (filteredData) {
      setData(filteredData.descriptions);
      setPaddingVertical(height * 0.071 * data.length);
    }
  }, [title,state.clientData,data]);

  const handleDeleteAnalyze = async (id) => {
    try {
      console.log(data);
      const deleteAnalyze = await deleteMeasurement(id);
      console.log("Анализ удалён:", deleteAnalyze);
      
      const updatedData = data.filter(item => item.id !== id); // Удаляем элемент из массива
      setData(updatedData); // Устанавливаем новое состояние
      clientData.allMeasurements=updatedData;
    } 
    catch (error) {
      console.error("Ошибка при удалении анализа:", error);
    }
  };

  const handleClose = async () => {
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
    await navigation.navigate('Measurements');
  };
  
  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>{title}</Text>
          <TouchableOpacity onPress={handleClose}>
            <Image source={require('./src/HomeOutline.svg')} style={styles.imageMenuAccount} />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.text}>График последних показателей</Text>
        
        <View>
          {<PressureChartOnly data={data}/>}
        </View>
        
        <Text style={styles.text}>История</Text>
        <View style={{ height: paddingVertical }}>
          <FlatList
            data={data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <View style={styles.flatListItem}>
                <Text style={styles.flatListText}>{item.text}</Text>
                <Text style={styles.flatListDate}>{item.date}</Text>
        
                <TouchableOpacity onPress={() =>handleDeleteAnalyze(item.id)} style={styles.deleteButton}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 6.30055H3M8.5 6.29985L8.72 4.98985C8.88 4.03985 9 3.32985 10.69 3.32985H13.31C15 3.32985 15.13 4.07985 15.28 4.99985L15.5 6.29985M18.8504 9.14063L18.2004 19.2106C18.0904 20.7806 18.0004 22.0006 15.2104 22.0006H8.79039C6.00039 22.0006 5.91039 20.7806 5.80039 19.2106L5.15039 9.14063M10.33 16.5H13.66M9.5 12.5H14.5" stroke="#1F2023" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg></TouchableOpacity>

              </View>
            )}
        />
        </View>
        <TouchableOpacity style={styles.buttonAdd} onPress={() => navigation.navigate('AddAnalyzes')}><Text>+</Text></TouchableOpacity>
      </View>
      <View style={styles.menu}>
        <NavigationPanel activeTab="Measurements"/>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  page: {
    height: height
  },
  menu: {
    backgroundColor: '#FBFBFB',
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
  imageMenuAccount: {
    width: width * 0.06,
    height: width * 0.06,
    resizeMode: 'contain',
  },

  flatListItem: {
    flexDirection: 'row', 
    alignItems: 'center',
    gap: width * 0.03,
  },
  flatListText: {
    flex: 3,
    fontSize: width * 0.04,
    color: '#000',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.03,
    marginBottom: height * 0.012,
  },
  flatListDate: {
    flex: 1,
    fontSize: width * 0.04,
    color: '#000',
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
  },
  deleteButton: {
    justifyContent: 'center', 
    alignItems: 'center', 
    fontWeight: 'bold',
    fontSize: width * 0.04,
    color: '#ccc',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: width * 0.03,
    marginBottom: height * 0.012,
  },
})
export default CurrentMeasurement;
