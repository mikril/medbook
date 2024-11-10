import React, { useState } from 'react';
import { Text, TextInput, Button, Alert } from 'react-native';
import { registerUser } from './api'; // Импортируем функцию для запроса

const Registration = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleButtonPress = async () => {
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
      const data = await registerUser(userData);
      Alert.alert('Успех', 'Регистрация успешна');
      navigation.navigate('Home'); 
    } catch (error) {
      Alert.alert('Ошибка', error.message);
    }
  };

  return (
    <>
      <Text>Регистрация</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
      />
      <TextInput
        value={phone}
        onChangeText={setPhone}
        placeholder="Телефон"
      />
      <TextInput
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholder="Пароль"
      />
      <TextInput
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Повторите пароль"
      />
      <Button title="Зарегистрироваться" onPress={handleButtonPress} />
    </>
  );
};

export default Registration;
