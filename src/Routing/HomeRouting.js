import React from 'react';
import HomeScreen from '../screens/HomeTab/HomeScreen';
import SearchHomeScreen from '../screens/HomeTab/SearchHomeScreen';
import BizScreen from '../screens/HomeTab/BizScreen';
import AddAddressScreen from '../screens/HomeTab/HomeScreen/AddAddressScreen';
import ReviewScreen from '../screens/HomeTab/ReviewsScreen';
import ProductExtras from '../screens/HomeTab/ProductExtras';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';
// import {createStackNavigator} from '@reac'
import Checkout from '../screens/HomeTab/Checkout';
import BookingScreen from '../screens/HomeTab/Booking/BookingScreen';
import ListServicesScreen from '../screens/HomeTab/Booking/ListServicesScreen';
import BookingCheckout from '../screens/HomeTab/Booking/BookingCheckoutScreen';
import ServiceTech from '../screens/HomeTab/Tech/ServiceTech';
import AddCreditCardsScreen from '../screens/ProfileTab/AddCreditCardsScreen';
import {createStackNavigator} from '@react-navigation/stack';
const Stack = createNativeStackNavigator();
// const Stack = createStackNavigator();

const screenOptions = {
  headerShown: false,
  stackAnimation: 'slide_from_left', // setting this to for android
  direction: 'rtl', // setting this to for ios
};

export default () => {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        // options={{
        //   // animationEnabled: false,
        //   // stackAnimation: 'none',

        // }}
      />
      <Stack.Screen name={'addAddressScreen'} component={AddAddressScreen} />
      <Stack.Screen name={'SearchHomeScreen'} component={SearchHomeScreen} />
      <Stack.Screen name={'ReviewScreen'} component={ReviewScreen} />
      <Stack.Screen name={'BizScreen'} component={BizScreen} />
      {/** regular business */}
      <Stack.Screen name={'productScreen'} component={ProductExtras} />
      <Stack.Screen name={'checkout'} component={Checkout} />
      <Stack.Screen
        name={'addCreditCardScreen'}
        component={AddCreditCardsScreen}
      />
      {/** regular business */}
      {/** booking */}
      <Stack.Screen name={'BookingScreen'} component={BookingScreen} />
      <Stack.Screen name={'BookingCheckout'} component={BookingCheckout} />
      {/** booking */}
      <Stack.Screen name={'BizTechSerivce'} component={ServiceTech} />
      <Stack.Screen name="ListServices" component={ListServicesScreen} />
    </Stack.Navigator>
  );
};
