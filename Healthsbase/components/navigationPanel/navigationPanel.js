import React from 'react';
import { Text,Image, View, StyleSheet, Dimensions,TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native';
const { width } = Dimensions.get('window'); // Получаем размеры экрана
const NavigationPanel = ({ activeTab = 'Main' }) => {
  const navigation = useNavigation();

  // Функция для определения стиля кнопки
  const getButtonStyle = (tabName) => 
    tabName === activeTab ?  "#FFFFFF" : "#BDBDBD";

  return (
    
    <View style={styles.container}>
      
      <TouchableOpacity
      
        onPress={() => navigation.navigate('Main')}
      >
       <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.2652 5.10536 20.5196 5.29289 20.7071C5.48043 20.8946 5.73478 21 6 21H9M19 10L21 12M19 10V20C19 20.2652 18.8946 20.5196 18.7071 20.7071C18.5196 20.8946 18.2652 21 18 21H15M9 21C9.26522 21 9.51957 20.8946 9.70711 20.7071C9.89464 20.5196 10 20.2652 10 20V16C10 15.7348 10.1054 15.4804 10.2929 15.2929C10.4804 15.1054 10.7348 15 11 15H13C13.2652 15 13.5196 15.1054 13.7071 15.2929C13.8946 15.4804 14 15.7348 14 16V20C14 20.2652 14.1054 20.5196 14.2929 20.7071C14.4804 20.8946 14.7348 21 15 21M9 21H15" stroke={getButtonStyle('Main')} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
      </TouchableOpacity>
      <TouchableOpacity
        
        onPress={() => navigation.navigate('Appointments')}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M22 10V15C22 20 20 22 15 22H9C4 22 2 20 2 15V9C2 4 4 2 9 2H14M22 10H18C15 10 14 9 14 6V2M22 10L14 2M7 13H13M7 17H11" stroke={getButtonStyle('Appointments')} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('Add')}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 9V12M12 12V15M12 12H15M12 12H9M21 12C21 13.1819 20.7672 14.3522 20.3149 15.4442C19.8626 16.5361 19.1997 17.5282 18.364 18.364C17.5282 19.1997 16.5361 19.8626 15.4442 20.3149C14.3522 20.7672 13.1819 21 12 21C10.8181 21 9.64778 20.7672 8.55585 20.3149C7.46392 19.8626 6.47177 19.1997 5.63604 18.364C4.80031 17.5282 4.13738 16.5361 3.68508 15.4442C3.23279 14.3522 3 13.1819 3 12C3 9.61305 3.94821 7.32387 5.63604 5.63604C7.32387 3.94821 9.61305 3 12 3C14.3869 3 16.6761 3.94821 18.364 5.63604C20.0518 7.32387 21 9.61305 21 12Z" stroke={getButtonStyle('Add')} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('Measurements')}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11 3.05499C9.31546 3.24325 7.71833 3.90331 6.39241 4.95923C5.06649 6.01514 4.06566 7.42399 3.50511 9.02361C2.94456 10.6232 2.84708 12.3486 3.22388 14.0012C3.60068 15.6538 4.43644 17.1664 5.63499 18.365C6.83354 19.5635 8.34615 20.3993 9.99874 20.7761C11.6513 21.1529 13.3767 21.0554 14.9763 20.4949C16.576 19.9343 17.9848 18.9335 19.0407 17.6076C20.0966 16.2816 20.7567 14.6845 20.945 13H11V3.05499Z" stroke={getButtonStyle('Measurements')} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M20.488 9.00002H15V3.51202C16.2654 3.96095 17.4147 4.68656 18.3641 5.63596C19.3135 6.58537 20.0391 7.73464 20.488 9.00002Z" stroke={getButtonStyle('Measurements')} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('Notifications')}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke={getButtonStyle('Notifications')} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke={getButtonStyle('Notifications')} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({

  container: {
    marginHorizontal: width * 0.05,  // Отступы относительно ширины экрана
    
    display: "flex",
    flexDirection: "row",
    backgroundColor: '#2F80ED',
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 30,
    justifyContent: "space-between", 
    position: "fixed",
    width: width * 0.9,
    bottom: 10,
  }
});

export default NavigationPanel;
