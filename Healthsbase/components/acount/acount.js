import React, { useState } from 'react';
import { Text, TextInput, Button, Alert, TouchableOpacity, Picker, DatePicker } from 'react-native';
import { acountUser } from './api'; 
import { useNavigation } from '@react-navigation/native';

const Acount = () => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [role, setRole] = useState(''); 
  const [dob, setDob] = useState('');  
  const [comment, setComment] = useState(''); 
  const navigation = useNavigation();

  const handleSave = () => {
    const userData = { 
      name, 
      gender, 
      role, 
      dob, 
      comment 
    };

    acountUser(userData)
      .then((data) => {
        Alert.alert('Данные сохранены', 'Ваши данные успешно обновлены');
      })
      .catch((error) => {
        Alert.alert('Ошибка', error.message);
      });
  };

  return (
    <>
      <Text>Редактирование</Text>

      <Text>Имя</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        keyboardType="phone"
      />

      <Text>Пол</Text>
      <Picker
        selectedValue={gender}
        onValueChange={(itemValue) => setGender(itemValue)}
      >
        <Picker.Item label="Мужской" value="male" />
        <Picker.Item label="Женский" value="female" />
      </Picker>

      <Text>Роль</Text>
      <TextInput
        value={role}
        onChangeText={setRole}
        keyboardType="phone"
      />

      <Text>Дата рождения</Text>


      <Text>Комментарий</Text>
      <TextInput
        value={comment}
        onChangeText={setComment}
        keyboardType="phone"
        multiline
        numberOfLines={4}
      />
    </>
  );
};

export default Acount;
