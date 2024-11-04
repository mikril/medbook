import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, SafeAreaView,Button,TextInput,Image,Alert } from 'react-native';

export default function App() {
  handleButtonmPress = () => Alert.alert("Регистрация прошла", "Красава",[
      {text:'Да'},
      {text:'Да'}
  ]);
  
  return (
    <SafeAreaView style={styles.container}>
      <Image/>
      <Text>Регистрация</Text>
      <TextInput style={styles.input} value='Email'></TextInput>
      <TextInput style={styles.input} value='Телефон'></TextInput>
      <TextInput style={styles.input} value='Пароль'></TextInput>
      <TextInput style={styles.input} value='Повторите пароль'></TextInput>
      <Button title ='Зарегестрироваться' onPress={handleButtonmPress}/>
    </SafeAreaView>
  );
}

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
