import React, {useState} from 'react';
import Orders from './Orders';
import {useWindowDimensions, StyleSheet} from 'react-native';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {Subtitle} from '@shoutem/ui';

const HistoryOrder = () => {
  return <Orders type={'history'} />;
};

const ActiveOrders = () => {
  return <Orders type={'active'} />;
};

const renderLabel = ({route, focused}) => {
  return (
    <Subtitle style={[styles.label, {opacity: focused ? 1 : 0.5}]}>
      {route.title}
    </Subtitle>
  );
};

const renderTabBar = (props) => {
  // console.log('props', props);
  return (
    <TabBar
      {...props}
      style={styles.tab}
      // getLabelText={({route}) => route.title}
      renderLabel={renderLabel}
      // labelStyle={{color: 'black'}}
      indicatorStyle={styles.indicator}
    />
  );
};

const Tabs = () => {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'activeOrders', title: 'הזמנות פעילות'},
    {key: 'historyOrders', title: 'היסטורית הזמנות'},
  ]);

  const renderScene = SceneMap({
    activeOrders: ActiveOrders,
    historyOrders: HistoryOrder,
  });

  return (
    <TabView
      navigationState={{index, routes}}
      lazy
      // renderLazyPlaceholder={}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{width: layout.width}}
      renderTabBar={renderTabBar}
    />
  );
};

const styles = StyleSheet.create({
  tab: {
    marginTop: 5,
    elevation: 0,
    shadowOpacity: 0,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
    // color: 'black',

    // height: TabBarHeight,
  },
  indicator: {backgroundColor: '#3daccf'},
  label: {fontSize: 18, color: '#222'},
});

export default Tabs;
