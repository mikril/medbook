import React from 'react';
import { Text, View, StyleSheet, Image, Dimensions } from 'react-native';

const Notification = ({ type = 'Посещение врача', title = 'Заголовок уведомления', description = 'Описание уведомления' }) => {
  const renderIcon = () => {
    switch (type) {
      case 'Посещение врача':
        return <Image source={require('../src/bell.svg')} style={styles.iconBell} />;
      case 'Прием лекарств':
        return <Image source={require('../src/pill.svg')} style={styles.iconPill} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.notificationContainer}>
      <View style={styles.iconContainer}>{renderIcon()}</View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  );
};
const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  notificationContainer: {
    width: '48%', // Каждое уведомление занимает 48% ширины (чтобы поместилось 2 на строку)
    flexDirection: 'row', // Иконка и текст в одной строке
    alignItems: 'center', // Выравнивание по центру вертикали
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: width*0.02,
    marginBottom: height*0.015,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    marginRight: width*0.02, // Отступ между иконкой и текстом
  },
  iconBell: {
    width: width*0.06,
    height: height*0.04,
    resizeMode: 'contain',
  },
  iconPill: {
    width: width*0.08,
    height: height*0.05,
    resizeMode: 'contain',
  },
  textContainer: {
    flex: 1, // Текст занимает оставшееся место
    flexDirection: 'column', // Текстовые элементы в столбик
  },
  title: {
    fontSize: width*0.035,
    fontWeight: 'bold',
    color: '#333',
  },
  description: {
    fontSize: width*0.030,
    color: '#666',
    marginTop: height*0.005,
  },
});

export default Notification;
