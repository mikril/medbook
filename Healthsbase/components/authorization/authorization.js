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

// Вычисляем ширину и высоту экрана
const { width, height } = Dimensions.get('window');

const Authorization = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  
  const handleButtonPress = async () => {
    navigation.navigate('Main');
    try {
      const userData = { phone, password };
      const data = await authorizateUser(userData);
      Alert.alert('Успех', 'Авторизация успешна');
      navigation.navigate('Main');
    } catch (error) {
      Alert.alert('Ошибка', error.message);
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
      <TextInput
        value={phone}
        onChangeText={setPhone}
        placeholder="Введите телефон"
        keyboardType="phone-pad"
        style={styles.input}
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Введите пароль"
        secureTextEntry
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={handleButtonPress}>
        <Text style={styles.buttonText}>Продолжить</Text>
      </TouchableOpacity>
      
      <Text style={styles.orText}>или</Text>

      <TouchableOpacity style={styles.googleButton} onPress={() => alert('Войти через Google')}>
        <Image
          source={require('./src/logoGoogle.png')} // Добавьте путь к вашему логотипу 
          style={styles.googleLogo}
        />
        <Text style={styles.googleButtonText}>Войти через Google</Text>
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
  input: {
    width: '100%',
    fontSize: width * 0.04,
    height: height * 0.06,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: width * 0.03,
    marginBottom: height * 0.024,
    backgroundColor: '#f9f9f9',
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
  orText: {
    fontSize: width * 0.04, 
    color: '#000',
    textAlign: 'center',
    marginBottom: height * 0.024,
  },
  googleButton: {
    width: '100%',
    height: height * 0.06,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 8,
    backgroundColor: '#ffffff',
    marginBottom: height * 0.024,
  },
  googleButtonText: {
    color: '#000',
    fontSize: width * 0.045,
    marginLeft: width * 0.01,
  },
  googleLogo: {
    width: width * 0.1,
    height: width * 0.1,
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
