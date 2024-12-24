import React, { useState } from 'react';
import {
  Image,
  TextInput,
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Alert,
} from 'react-native';
import { authorizateUser } from './api';
import { useNavigation } from '@react-navigation/native';
import { Dimensions } from 'react-native';
import { useClientData } from '../../ClientDataContext';

const { width, height } = Dimensions.get('window');

const Authorization = () => {
  const { state, dispatch } = useClientData();

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const navigation = useNavigation();

  const handleButtonPress = async () => {
    setPhoneError('');  // сброс ошибок при попытке отправить
    setPasswordError('');
    setGeneralError('');

    // Проверка на пустые поля
    let valid = true;
    if (!phone) {
      setPhoneError('Телефон не может быть пустым');
      valid = false;
    }
    if (!password) {
      setPasswordError('Пароль не может быть пустым');
      valid = false;
    }

    // Если хотя бы одно поле пустое, не продолжаем обработку
    if (!valid) {
      return;
    }

    try {
      const userData = { phone, password };

      // Дожидаемся ответа от сервера
      const data = await authorizateUser(userData, dispatch);

      // Если авторизация успешна, показываем сообщение и переходим на страницу Main
      Alert.alert('Успех', 'Авторизация успешна');
      navigation.navigate('Main');
    } catch (error) {
      // Обработка ошибок авторизации
      const errorMessage = error.message || 'Что-то пошло не так';
      if (errorMessage === 'Аккаунт с таким номером телефона не найден') {
        setPhoneError('Аккаунт с таким номером телефона не найден');
      } else if (errorMessage === 'Неверный пароль') {
        setPasswordError('Пароль неверный');
      } else {
        setGeneralError(errorMessage);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('./src/young woman sitting in front of laptop and having an idea.png')}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.title}>Авторизация</Text>
      {generalError ? <Text style={styles.errorText}>{generalError}</Text> : null}

      <View style={styles.inputContainer}>
        {phoneError && <Text style={styles.errorText}>{phoneError}</Text>}
        <TextInput
          value={phone}
          onChangeText={setPhone}
          placeholder="Введите телефон"
          keyboardType="phone-pad"
          style={[styles.input, phoneError && styles.inputError]}
        />
      </View>

      <View style={styles.inputContainer}>
        {passwordError && <Text style={styles.errorText}>{passwordError}</Text>}
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Введите пароль"
          secureTextEntry
          style={[styles.input, passwordError && styles.inputError]}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleButtonPress}>
        <Text style={styles.buttonText}>Продолжить</Text>
      </TouchableOpacity>

      <Text style={styles.registerText}>
        Нет аккаунта?{' '}
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.linkText}>Зарегистрироваться</Text>
        </TouchableOpacity>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: width * 0.05,
  },
  image: {
    width: width * 0.65,
    height: height * 0.25,
    marginBottom: height * 0.024,
  },
  title: {
    fontSize: width * 0.087,
    fontWeight: 'bold',
    marginBottom: height * 0.024,
    color: '#000',
    alignSelf: 'flex-start',
  },
  inputContainer: {
    width: '100%',
    marginBottom: height * 0.024,
  },
  input: {
    width: '100%',
    fontSize: width * 0.04,
    height: height * 0.06,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: width * 0.03,
    backgroundColor: '#f9f9f9',
  },
  inputError: {
    borderColor: '#ff0000',
  },
  button: {
    width: '100%',
    height: height * 0.06,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: height * 0.024,
  },
  buttonText: {
    color: '#fff',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: width * 0.04,
    color: '#ff0000',
    textAlign: 'left',
    marginBottom: height * 0.01,
  },
  registerText: {
    fontSize: width * 0.04,
    color: '#555',
  },
  linkText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
});

export default Authorization;
