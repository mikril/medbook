import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const Measurement = ({ item }) => {
  const lastDescription = item.descriptions[item.descriptions.length - 1];
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.measurementCard}
      onPress={() => navigation.navigate('CurrentMeasurement', { title: item.title })}
    >
      <View style={styles.textContainer}>
        <Text style={styles.title}>
          {item.title} {lastDescription.text}
        </Text>
        <Text style={styles.subtitle}>
          Последнее измерение: {lastDescription.date}
        </Text>
      </View>
      <Text style={styles.arrow}>{'>'}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  measurementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: width * 0.03,
    marginBottom: width * 0.03,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'visible',
  },
  textContainer: {
    flex: 1,

  },
  title: {
    fontSize: width * 0.045,
    fontWeight: 'bold', // Жирный текст для заголовка
    color: '#000',
    marginBottom: width * 0.02,
  },
  subtitle: {
    fontSize: width * 0.03,
    color: '#999',
  },
  arrow: {
    fontSize: width * 0.05,
    color: '#C4C4C4',
  },
});

export default Measurement;
