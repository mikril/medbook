import React, { useState } from 'react';
import { Text, View, StyleSheet, FlatList, Button, Dimensions, Image, TouchableOpacity } from 'react-native';
import { useClientData } from '../../ClientDataContext';
import { useNavigation } from '@react-navigation/native';
import User from './user/user';

const Accounts = () => {
  const { state } = useClientData();
  const [clientData] = useState(state.clientData);

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Пользователи</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Main')}>
          <Image source={require('./src/HomeOutline.svg')} style={styles.imageMenuAccount}/>
        </TouchableOpacity>
      </View>
      <FlatList
        data={clientData.users}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <User avatar={item.avatar} name={item.name} id={item.id} />
        )}
        contentContainerStyle={styles.userList}
      />

    <View style={styles.footer}>
    <TouchableOpacity

    style={styles.button} // Меняем цвет фона
  >
    <Text style={styles.buttonText}>Добавить пользователя</Text> {/* Меняем цвет текста */}
  </TouchableOpacity>
  <TouchableOpacity
 
    style={styles.button } // Меняем цвет фона
  >
    <Text style={styles.buttonText}>Выйти</Text> {/* Меняем цвет текста */}
  </TouchableOpacity>
  <TouchableOpacity
    style={styles.button} // Меняем цвет фона
  >
    <Text style={[styles.buttonText, { color: '#FF4136' }]}>Удалить аккаунт</Text> {/* Меняем цвет текста */}
  </TouchableOpacity>
      </View>
    </View>
  );
};

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBFBFB',
    padding: width * 0.05,
  },
  header: {
    fontSize: width * 0.088,
    fontWeight: 'bold',
    color: '#000',
  },
  headerContainer: {
    flexDirection: 'row', // Размещение элементов в строку
    justifyContent: 'space-between', // Заголовок слева, кнопка справа
    alignItems: 'center', // Выравнивание по центру вертикали
    marginBottom: height * 0.012,
  },
  title: {
    fontSize: width * 0.088,
    fontWeight: 'bold',
    color: '#000',
  },
  userList: {
    paddingBottom: width * 0.05,
  },
  footer: {
    gap: height*0.02, // Отступы между кнопками
  },
  button: {
    backgroundColor: '#FFF', // Синий фон кнопки
    paddingVertical: height*0.013, // Отступы сверху и снизу
    borderRadius: 12, // Скругленные углы
    alignItems: 'center', // Выравнивание текста по центру
    justifyContent: 'center', // Горизонтальное и вертикальное выравнивание
    shadowColor: '#000', // Тень кнопки
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2, // Для тени на Android
  },
  buttonText: {
    color: '#000', // Белый текст
    fontSize: 16, // Размер текста
    fontWeight: 'bold', // Жирный текст
  },
});

export default Accounts;
