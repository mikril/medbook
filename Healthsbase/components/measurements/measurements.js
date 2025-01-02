import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text,TextInput, View, FlatList, StyleSheet, Dimensions } from 'react-native';
import { useClientData } from '../../ClientDataContext';
import NavigationPanel from '../navigationPanel/navigationPanel';
import Measurement from './measurement/measurement';
import { useNavigation } from '@react-navigation/native';
const { width, height } = Dimensions.get('window');

const Measurements = () => {
  const { state } = useClientData();
  const [clientData, setClientData] = useState(state.clientData);
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMeasurements, setFilteredMeasurements] = useState(clientData.allMeasurements);
  useEffect(() => {
    setClientData(state.clientData);
    console.log(clientData.allMeasurements);
  }, []);

  useEffect(() => {
      const filteredData = clientData.allMeasurements.filter(item => {
        const queryLower = searchQuery.toLowerCase();
        return (
          item.title.toLowerCase().includes(queryLower) 
        );
      });
      setFilteredMeasurements(filteredData);
    }, [searchQuery, clientData.appointments]);

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <Text style={styles.header}>Анализы</Text>
        <TextInput
                  style={styles.searchInput}
                  placeholder="Поиск"
                  value={searchQuery}
                  onChangeText={setSearchQuery}  // Обновление состояния при изменении текста
                />
        <FlatList
          data={filteredMeasurements}
          renderItem={({ item }) => <Measurement item={item} />}
          keyExtractor={(item) => item.title}
          ListFooterComponent={
            <TouchableOpacity style={styles.buttonAdd} onPress={() => navigation.navigate('AddAnalyzes')}><Text>+</Text></TouchableOpacity>
          } // Добавляем кнопку после списка
        />
      </View>
      <View style={styles.menu}>
        <NavigationPanel activeTab="Measurements" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    height: height
  },
  menu: {
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  container: {
    flex: 1,
    backgroundColor: '#FBFBFB',
    padding: width * 0.05,
    paddingBottom: 100,
  },
  header: {
    fontSize: width * 0.085,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: width * 0.03,
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
});

export default Measurements;
