import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  Alert,
  Image,
  View,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { registerUser } from './api'; 
import { useClientData } from '../../ClientDataContext';

const Registration = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const { state, dispatch } = useClientData();
  const [errors, setErrors] = useState({});
  const validateFields = () => {
    const newErrors = {};

    if (!email.includes('@')) {
      newErrors.email = 'Введите корректный email';
    }
    if (!phone.match(/^\+?\d{10,15}$/)) {
      newErrors.phone = 'Введите корректный номер телефона';
    }
    if (password.length < 6) {
      newErrors.password = 'Пароль должен содержать не менее 6 символов';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }

    setErrors(newErrors);

    // Возвращаем true, если нет ошибок
    return Object.keys(newErrors).length === 0;
  };

  const handleButtonPress = async () => {
    if (!validateFields()) {
      return;
    }

    const userData = {
      email,
      phone,
      password,
    };
    try {
      const data = await registerUser(userData, dispatch);
      Alert.alert('Успех', 'Регистрация успешна');
      navigation.navigate('Main');
    } catch (error) {
      Alert.alert('Ошибка', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Image
          source={require('./src/young man sitting with a laptop and waving his hand.png')}
          style={styles.image}
        />
        <Text style={styles.title}>Регистрация</Text>

        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        <TextInput
          style={[styles.input, errors.email && styles.errorInput]}
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          keyboardType="email-address"
        />

        {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
        <TextInput
          style={[styles.input, errors.phone && styles.errorInput]}
          value={phone}
          onChangeText={setPhone}
          placeholder="Телефон"
          keyboardType="phone-pad"
        />

        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
        <TextInput
          style={[styles.input, errors.password && styles.errorInput]}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholder="Пароль"
        />

        {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
        <TextInput
          style={[styles.input, errors.confirmPassword && styles.errorInput]}
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Повторите пароль"
        />

        <TouchableOpacity style={styles.button} onPress={handleButtonPress}>
          <Text style={styles.buttonText}>Зарегистрироваться</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const { width, height } = Dimensions.get('window');
const isSmallScreen = height < 600;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: height * 0.017,
  },
  image: {
    width: width * 0.65,
    height: height * 0.25,
    resizeMode: 'contain',
    marginBottom: height * 0.02,
  },
  title: {
    fontSize: isSmallScreen ? width * 0.06 : width * 0.09,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginBottom: height * 0.02,
  },
  input: {
    width: '100%',
    height: height * 0.06,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: width * 0.03,
    marginBottom: height * 0.02,
    fontSize: width * 0.04,
  },
  errorInput: {
    borderColor: '#FF4D4D',
  },
  errorText: {
    alignSelf: 'flex-start',
    color: '#FF4D4D',
    marginBottom: height * 0.01,
    fontSize: width * 0.035,
  },
  button: {
    width: '100%',
    height: height * 0.07,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: height * 0.02,
  },
  buttonText: {
    color: '#fff',
    fontSize: isSmallScreen ? width * 0.045 : width * 0.05,
    fontWeight: 'bold',
  },
});

export default Registration;
