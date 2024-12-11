  import React from 'react';
import { StyleSheet, View } from 'react-native';
  import { NavigationContainer } from '@react-navigation/native';
  import { createStackNavigator } from '@react-navigation/stack';
  import Registration from './components/registration/registration';  
  import Authorization from './components/authorization/authorization';  
  import Acount from './components/acount/acount';  
  import Accounts from './components/accounts/accounts';  
  import Main from './components/main/main';
  import Add from './components/add/add';

  import CurrentMeasurement from './components/currentMeasurement/currentMeasurement';
  import CurrentAppointment from './components/currentAppointment/currentAppointment';
  import AddAppointment from './components/addAppointment/addAppointment';
  import AddAnalyzes from './components/addAnalyzes/addAnalyzes';
  import Measurements from './components/measurements/measurements';
  import Appointments from './components/appointments/appointments';
  import Notifications from './components/notifications/notifications';
  import AddNotification from './components/addNotification/addNotification';
  import { ClientDataProvider } from './ClientDataContext';
  import AddPressure from './components/addPressure/addPressure';

  const Stack = createStackNavigator();CurrentAppointment

  const App = () => {
    return (
      <ClientDataProvider style={styles.main}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Main">
          <Stack.Screen name="Authorizate" component={Authorization} options={{ headerShown: false }}/>
          <Stack.Screen name="Register" component={Registration} options={{ headerShown: false }}/>
          <Stack.Screen name="Acount" component={Acount} options={{ headerShown: false }}/>
          <Stack.Screen name="Accounts" component={Accounts} options={{ headerShown: false }}/>
          <Stack.Screen name="Main" component={Main} options={{ headerShown: false }}/>
          <Stack.Screen name="Add" component={Add} options={{ headerShown: false }}/>
          <Stack.Screen name="AddAppointment" component={AddAppointment} options={{ headerShown: false }}/>
          <Stack.Screen name="AddAnalyzes" component={AddAnalyzes} options={{ headerShown: false }}/>
          <Stack.Screen name="AddPressure" component={AddPressure} options={{ headerShown: false }}/>
          <Stack.Screen name="CurrentMeasurement" component={CurrentMeasurement} options={{ headerShown: false }}/>
          <Stack.Screen name="CurrentAppointment" component={CurrentAppointment} options={{ headerShown: false }}/>
          <Stack.Screen name="Measurements" component={Measurements} options={{ headerShown: false }}/>
          <Stack.Screen name="Appointments" component={Appointments} options={{ headerShown: false }}/>
          <Stack.Screen name="Notifications" component={Notifications} options={{ headerShown: false }}/>
          <Stack.Screen name="AddNotification" component={AddNotification} options={{ headerShown: false }}/>
        </Stack.Navigator>
      </NavigationContainer>
      </ClientDataProvider>
    );
  };
  const styles = StyleSheet.create({
    main: {
      
    },})
  export default App;
