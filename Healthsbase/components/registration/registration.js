import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  Button,
  Alert,
  Image,
  View,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { registerUser } from './api'; 

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
    navigation.navigate('Main');
    try {
      const data = await registerUser(userData);
      Alert.alert('Успех', 'Регистрация успешна');
      navigation.navigate('Main');
    } catch (error) {
      Alert.alert('Ошибка', error.message);
    }
  };

  return (
    <View
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Image
          source={require('./src/young man sitting with a laptop and waving his hand.png')}
          style={styles.image}
        />
        <Text style={styles.title}>Регистрация</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="Телефон"
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholder="Пароль"
        />
        <TextInput
          style={styles.input}
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
    width: width * 0.65, // Картинка уменьшена до 40% от ширины экрана
    height: height * 0.25, // Пропорциональная высота
    resizeMode: 'contain',
    marginBottom: height * 0.02,
  },
  title: {
    fontSize: isSmallScreen ? width * 0.06 : width * 0.09, // Заголовок адаптируется под экран
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
    fontSize: isSmallScreen ? width * 0.045 : width * 0.05, // Шрифт текста кнопки зависит от экрана
    fontWeight: 'bold',
  },
});

export default Registration;
