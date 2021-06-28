import React from 'react';
import {Dimensions, StyleSheet, View, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
// import {Heading} from '@shoutem/ui';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Tab from './Tab';
import LoadingScreen from '../common/LoadingScreen';
import EmptyScreen from '../../screens/HomeTab/HomeScreen/EmptyScreen';
// import {TouchableOpacity} from 'react-native-gesture-handler';
import {Subtitle} from '@shoutem/ui';
import {CYAN} from '../../util/colors';
import ErrorLoadingBtn from './ErrorLoadingBtn';
import LoadingAnimation from './LoadingAnimation';
// import EmptyScreenAnimation from '../common/EmptyScreenAnimation';

const MTTab = createMaterialTopTabNavigator();
const customeTabStyle = {width: 100};

const initialLayout = {height: 0, width: Dimensions.get('window').width};

//passing to this opacity prop kills the app need
const Tabs = props => {
  if (props.loading) return <LoadingAnimation />;
  if (props.errorLoading) {
    return <ErrorLoadingBtn />;
  }
  if (!props.type[0].businesses || props.type[0].businesses.length === 0) {
    return <EmptyScreen />;
  }
  const tabs = props.type.map((item, index) => {
    const CustomTab = () => (
      <Tab category={item.category} businesses={item.businesses} />
    );
    return (
      <MTTab.Screen
        key={index}
        name={item.title}
        component={CustomTab}></MTTab.Screen>
    );
  });
  const isScrollable = props.type.length > 4 ? true : false;
  return (
    <MTTab.Navigator
      lazy={true}
      backBehavior={'none'}
      // lazyPreloadDistance={1}
      lazyPlaceholder={LoadingScreen}
      sceneContainerStyle={styles.main}
      initialLayout={initialLayout}
      tabBarOptions={{
        tabStyle: isScrollable ? customeTabStyle : null,
        scrollEnabled: isScrollable,
        indicatorStyle: styles.indicatorStyle,
      }}>
      {tabs}
    </MTTab.Navigator>
  );
};

const styles = StyleSheet.create({
  main: {flex: 1},
  indicatorStyle: {
    backgroundColor: '#3daccf',
  },
});

const mapStateToProps = (state, ownProps) => {
  const {category} = ownProps;
  const {food, booking, loading, errorLoading} = state.home;

  if (category === 'food') {
    return {type: food, loading, errorLoading};
  }
  return {type: booking, loading, errorLoading};
};
export default connect(mapStateToProps)(Tabs);
