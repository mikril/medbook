import React, { useState } from 'react';
import { Image, TextInput, Button, Alert, TouchableOpacity, Text } from 'react-native';
import { authorizateUser } from './api'; 
import { useNavigation } from '@react-navigation/native';

const Authorization = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleButtonPress = async () => {
    // Проверка на совпадение паролей
    if (password !== confirmPassword) {
      Alert.alert('Ошибка', 'Пароли не совпадают');
      return;
    }

    const userData = {
      email,
      phone,
      password,
    };

    try {
      // Предположительно, должна быть функция авторизации, а не регистрации
      const data = await authorizateUser(userData); // Возможно, стоит заменить на correct function name
      Alert.alert('Успех', 'Авторизация успешна');
      navigation.navigate('Home'); // Переход на экран после авторизации
    } catch (error) {
      Alert.alert('Ошибка', error.message); // Отображение ошибки при проблемах с авторизацией
    }
  };

  return (
    <>
      <Image source={require('./src/young woman sitting in front of laptop and having an idea.png')} />
      <Text>Авторизация</Text>
      <TextInput
        value={phone}
        onChangeText={setPhone}
        placeholder="Электронная почта"
        keyboardType="phone"
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Пароль"
        secureTextEntry
      />
      <Button title="Продолжить" onPress={handleButtonPress} />
      
      <Text>или</Text>
      
      <TouchableOpacity onPress={() => alert('Войти через Google')}>
        <Text>Войти через Google</Text>
      </TouchableOpacity>
      
      <Text>Нет аккаунта? 
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={{ color: 'blue' }}>Зарегистрироваться</Text>
        </TouchableOpacity>
      </Text>
    </>
  );
};

export default Authorization;
