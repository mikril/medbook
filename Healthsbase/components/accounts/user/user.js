import React from 'react';
import { Text, Image, View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useClientData } from '../../../ClientDataContext';
const { width } = Dimensions.get('window');

const User = ({ avatar, name, id }) => {
  const { state, dispatch } = useClientData();
  const clientData = state.clientData;
  const navigation = useNavigation();
  const handleCardClick = async() => {
    localStorage.setItem('clientData', JSON.stringify({
      id: id,  // ID пользователя
      id_account: clientData.id_account
    }));
    await dispatch({
      type: "SET_CLIENT_DATA",
      payload: {
        id:  "asd",  // Оставляем только id
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
    await navigation.navigate('Main');
    console.log("Selected user ID:", id); // Logging the selected user ID
  };
  return (
    <View style={styles.userCard}>
      <TouchableOpacity onPress={handleCardClick} style={styles.cardTouchable}>
        <Image source={avatar} style={styles.profileImage} />
        <Text style={styles.userName}>{name}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('Acount', { userId: id })}
      >
        <Image source={require('../src/edit.svg')} style={styles.imageMenu} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  userCard: {
    transform: "rotate(0.35deg)",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: width * 0.03,
    marginBottom: width * 0.04,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileImage: {
    width: width * 0.11,
    height: width * 0.11,
    borderRadius: width * 0.075,
  },
  userName: {
    flex: 1,
    marginLeft: width * 0.05,
    fontSize: width*0.04,
    color: '#000',
  },
  imageMenu: {
 
    width: width * 0.065,
    height: width*0.065,

  },
  cardTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
});

export default User;
