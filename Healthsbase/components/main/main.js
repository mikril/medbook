import React, { useState } from 'react';
import { Text, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import Notification from './components/main/notification/notification';  

const Main = () => {
  const navigation = useNavigation();

  return (
    <>
      <Text></Text>
      <Notification></Notification>
      <Notification></Notification>
    </>
  );
};

export default Main;
