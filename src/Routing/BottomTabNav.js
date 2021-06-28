import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeRouting from './HomeRouting';
import FavoritesScreen from '../screens/FavoritesScreen';
import {
  Platform,
  StyleSheet,
} from 'react-native';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';



import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import OrdersScreen from '../screens/OrdersTab/OrdersScreen';
import OrderScreen from '../screens/OrdersTab/OrderScreen';
import ProfileScreen from '../screens/ProfileTab/ProfileScreen';
import EditingProfileScreen from '../screens/ProfileTab/EditingProfileScreen';
import CreditCardScreen from '../screens/ProfileTab/CreditCardScreen';
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
// const Stack = createStackNavigator();

const screenOptions = {
  headerShown: false,
  stackAnimation: 'slide_from_left', // setting this to for android
  direction: 'rtl', // setting this to for ios
};

const ProfileTab = () => {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name={'profileScreen'} component={ProfileScreen} />
      <Stack.Screen
        name={'editingProfileScreen'}
        component={EditingProfileScreen}
      />
      <Stack.Screen name={'creditCardsScreen'} component={CreditCardScreen} />
    </Stack.Navigator>
  );
};

const OrdersTab = () => {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name={'ordersScreen'} component={OrdersScreen} />
      <Stack.Screen name={'orderScreen'} component={OrderScreen} />
    </Stack.Navigator>
  );
};

const tabBarOptions = {
  //style: {height: 52},

  labelStyle: {paddingBottom: 2, fontSize: 18},
  activeTintColor: '#3daccf',
  inactiveTintColor: 'black',
  keyboardHidesTabBar: true,
};

if (Platform.OS === 'android') {
  tabBarOptions.style = {height: 52};
}

const homeTabOptions = {
  title: 'בית',
  // screenOptions: {},
  tabBarIcon: ({focused}) => {
    return (
      <Icon
        name={focused ? 'home' : 'home-outline'}
        color={focused ? '#3daccf' : 'black'}
        style={styles.padding}
        size={28}></Icon>
    );
  },
};
const orderTabOptions = {
  title: 'הזמנות',
  tabBarIcon: ({focused}) => {
    return (
      <Icon
        name={focused ? 'clipboard-text' : 'clipboard-text-outline'}
        color={focused ? '#3daccf' : 'black'}
        style={styles.padding}
        size={28}></Icon>
    );
  },
};
const favoriteTabOptions = {
  title: 'מועדפים',
  tabBarIcon: ({focused}) => {
    return (
      <Icon
        name={focused ? 'star' : 'star-outline'}
        color={focused ? '#3daccf' : 'black'}
        style={styles.padding}
        size={28}></Icon>
    );
  },
};
const profileTabOptions = {
  title: 'פרופיל',
  tabBarIcon: ({focused}) => {
    return (
      <Icon
        name={focused ? 'account' : 'account-outline'}
        style={styles.padding}
        color={focused ? '#3daccf' : 'black'}
        size={28}></Icon>
    );
  },
};

const BottomTabNav = () => (
  <Tab.Navigator tabBarOptions={tabBarOptions}>
    <Tab.Screen
      // screenOptions={{}}
      // screenOptions={screenOptionss}

      name="homeTab"
      options={homeTabOptions}
      component={HomeRouting}
    />
    <Tab.Screen
      name="ordersTab"
      options={orderTabOptions}
      component={OrdersTab}
    />
    <Tab.Screen
      name="FavroitesTab"
      options={favoriteTabOptions}
      component={FavoritesScreen}
    />
    <Tab.Screen
      name="ProfileTab"
      options={profileTabOptions}
      component={ProfileTab}
    />
  </Tab.Navigator>
);

const styles = StyleSheet.create({
  padding: {paddingTop: 0},
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    width: 200,
    height: 200,
    backgroundColor: '#631d94',
  },
});

export default BottomTabNav;
