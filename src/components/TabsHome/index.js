import React from 'react';
import {Dimensions} from 'react-native';
import {connect} from 'react-redux';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
// import Food from './Food';
// import Booking from './Booking';
import InnerTab from './Tab';
import LoadingScreen from '../common/LoadingScreen';
import Tabs from './Tabs';

const Tab = createMaterialTopTabNavigator();

const initialLayout = {height: 0, width: Dimensions.get('window').width};

const Food = () => {
  // return null;
  return <Tabs category={'food'} />;
};
const Booking = () => {
  // return null;
  return <Tabs category={'booking'} />;
};

const tabBarOptions = {
  showLabel: true,
  labelStyle: {fontFamily: 'Rubik-Regular'},
  indicatorStyle: {
    backgroundColor: '#3daccf',
  },
};

const MainTabs = ({tech}) => {
  const Tech = () => <InnerTab category={'tech'} businesses={tech} />;
  return (
    <Tab.Navigator
      swipeEnabled={false}
      lazy={true}
      backBehavior={'none'}
      lazyPreloadDistance={1}
      lazyPlaceholder={LoadingScreen}
      initialLayout={initialLayout}
      tabBarOptions={tabBarOptions}>
      <Tab.Screen
        name={'food'}
        options={{
          tabBarLabel: 'אוכל',
          // tabBarIcon: ({color}) => <Icon name="food" color={color} size={25} />,
        }}
        component={Food}
      />
      <Tab.Screen
        name={'booking'}
        options={{
          tabBarLabel: 'תורים',
          // tabBarIcon: ({color}) => (
          //   <Icon name="calendar-clock" color={color} size={25} />
          // ),
        }}
        component={Booking}
      />
      <Tab.Screen
        name={'tech'}
        options={{
          tabBarLabel: 'טכנאים',
        }}
        component={Tech}
      />
    </Tab.Navigator>
  );
};

const mapStateToProps = state => {
  const {opacity, tech} = state.home;
  // return {tech};
  return {opacity, tech};
};

export default connect(mapStateToProps)(MainTabs);
