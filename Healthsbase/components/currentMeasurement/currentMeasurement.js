import React, { useState, useEffect } from 'react';
import {TouchableOpacity,Text, View, FlatList, StyleSheet, Dimensions, Image } from 'react-native';
import { useClientData } from '../../ClientDataContext';
import { useNavigation } from '@react-navigation/native';
import NavigationPanel from '../navigationPanel/navigationPanel';
import PressureChartOnly from './pressureChartOnly/pressureChartOnly';

const { width, height } = Dimensions.get('window');
const CurrentMeasurement = ({ route }) => {
  const [data, setData] = useState([]);
  const [paddingVertical, setPaddingVertical] = useState(0);
  const { title } = route.params;
  const { state } = useClientData();
  const [clientData, setClientData] = useState(state.clientData);

  const navigation = useNavigation();

  // Получение данных по `title` из массива `allMeasurements`
  useEffect(() => {
    setClientData(state.clientData);
    const filteredData = clientData.allMeasurements.find(item => item.title === title);
    
    if (filteredData) {
      setData(filteredData.descriptions);
      setPaddingVertical(height * 0.071 * data.length);
    }
  }, [title,state.clientData,data]);

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>{title}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Measurements')}>
            <Image source={require('./src/HomeOutline.svg')} style={styles.imageMenuAccount} />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.text}>График последних замеров</Text>
        
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
              </View>
            )}
        />
        </View>
        <TouchableOpacity style={styles.buttonAdd} onPress={() => navigation.navigate('AddAnalyzes')}>+</TouchableOpacity>
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
    color: '#ccc',
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
    color: '#ccc',
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
})
export default CurrentMeasurement;
