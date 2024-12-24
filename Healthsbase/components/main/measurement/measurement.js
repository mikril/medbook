import React from 'react';
import { Text, View, StyleSheet, Dimensions, TouchableOpacity} from 'react-native';
const { width } = Dimensions.get('window'); // Получаем размеры экрана
import { useNavigation } from '@react-navigation/native';

const Measurement = ({ title = 'Показатель', description = 'Значение' }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity style={styles.container}
    onPress={() => navigation.navigate('CurrentMeasurement', { title: title })}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column', // Вертикальное расположение элементов
    justifyContent: 'center',
    alignItems: "center",
    paddingTop: 8,
    paddingBottom: 8,
    borderRadius: 8,
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: width * 0.035,  // Размер шрифта относительно ширины экрана
    fontWeight: 'bold',
    color: '#333',
  },
  description: {
    fontSize: width * 0.03,  // Размер шрифта для описания
    color: '#666',
  },
});

export default Measurement;
