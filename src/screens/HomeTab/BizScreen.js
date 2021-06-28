import React from 'react';
import {View, SafeAreaView, StyleSheet} from 'react-native';
import Bar from '../../components/business/Bar';
import CustomTabView from '../../components/business/CustomTabView';
import Cart from '../../components/Cart';

const BizScreen = (props) => {
  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.main}>
        <CustomTabView />
      </View>
      <Bar />
      <Cart />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  main: {flex: 1},
});

export default BizScreen;
