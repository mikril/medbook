import React from 'react';
import { Text, Image, View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const User = ({ avatar, name, id }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.userCard}>
      <Image source={avatar} style={styles.profileImage} />
      <Text style={styles.userName}>{name}</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate('Acount', { userId: id })}
      >
        <Image source={require('../src/edit.svg')} style={styles.imageMenu} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  userCard: {
    transform: "rotate(0.35deg)",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: width * 0.03,
    marginBottom: width * 0.04,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileImage: {
    width: width * 0.11,
    height: width * 0.11,
    borderRadius: width * 0.075,
  },
  userName: {
    flex: 1,
    marginLeft: width * 0.05,
    fontSize: width*0.04,
    color: '#000',
  },
  imageMenu: {
 
    width: width * 0.065,
    height: width*0.065,

  },

});

export default User;
