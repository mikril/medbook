import React, { useState } from 'react';
import {StyleSheet, Text, TextInput, Button, Alert, Image } from 'react-native';
import { registerUser } from './api'; // Импортируем функцию для запроса

const Registration = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleButtonPress = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Ошибка', 'Пароли не совпадают');
      alert('Пароли не совпадают');
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
      alert('Регистрация успешна');
      navigation.navigate('Home'); 
    } catch (error) {
      Alert.alert('Ошибка', error.message);
    }
  };

  return (
    <>
      <Text>Регистрация</Text>
      <Image source={require('./src/young man sitting with a laptop and waving his hand.png')} />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  input: {
    color: '#bbb',
    borderWidth: 1,
  },
}); 
export default Registration;
