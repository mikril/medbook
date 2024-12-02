import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Registration from './components/registration/registration';  
import Authorization from './components/authorization/authorization';  
import Acount from './components/acount/acount';  



const Stack = createStackNavigator();

const App = () => {
  return (
    
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Authorizate">
        <Stack.Screen name="Authorizate" component={Authorization} options={{ headerShown: false }}/>
        <Stack.Screen name="Register" component={Registration} options={{ headerShown: false }}/>
        <Stack.Screen name="Acount" component={Acount} options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
    
  );
};

export default App;
