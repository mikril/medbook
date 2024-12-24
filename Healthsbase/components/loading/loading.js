import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Loading = () => {
  const navigation = useNavigation();

  const handleLogout = () => {
    navigation.navigate('Authorizate');
    localStorage.clear();
  };

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007BFF" style={styles.spinner} />
      <Text style={styles.text}>Загружается...</Text>
      <TouchableOpacity
        onPress={handleLogout}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Выйти</Text>
      </TouchableOpacity>
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  spinner: {
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    color: '#6c757d',
    fontWeight: '500',
  },
  button: {
    position: 'absolute', // Закрепляем кнопку
    bottom: height * 0.03, // Отступ от нижнего края
    width: width * 0.8, // Ширина кнопки относительно экрана
    backgroundColor: '#FFF', // Белый фон кнопки
    paddingVertical: height * 0.015, // Отступы сверху и снизу
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
    color: '#FF4136', // Красный текст
    fontSize: 16, // Размер текста
    fontWeight: 'bold', // Жирный текст
  },
});

export default Loading;
