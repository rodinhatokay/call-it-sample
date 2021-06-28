import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import HeaderHomeScreen from '../../../components/HeaderHomeScreen';
import Tabs from '../../../components/TabsHome';
import {init_home, set_bussienss_home} from '../../../actions';
import AddressBottomSheet from '../../../components/HeaderHomeScreen/AddressBottomSheet';
import Cart from '../../../components/Cart';
import TosAlert from '../../../components/TosAlert';

/**
 * check TOS then set it
 *
 */

// let connection = true;

const HomeScreen = props => {
  useEffect(() => {
    props.init_home(props.addresses, props.token, props.mainAddressIncluded);
  }, []);

  const onTouchEnd = () => {
    if (props.opacity === 0.2) props.sheetRef.current.snapTo(1);
  };

  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.main}>
        <HeaderHomeScreen />
        <TosAlert />
        <Tabs />
        <Cart />
        {props.opacity === 0.2 ? (
          <View onTouchEnd={onTouchEnd} style={styles.abslotueFill} />
        ) : null}
        <AddressBottomSheet />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  abslotueFill: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundColor: `rgba(0,0,0,0.7)`,
  },
});

const mapStateToProps = state => {
  const {token} = state.auth;
  const {addresses, opacity, mainAddressIncluded, sheetRef} = state.home;
  const {loading} = state.home;
  return {
    token,
    opacity,
    addresses,
    mainAddressIncluded,
    sheetRef,
    loading,
  };
};

export default connect(mapStateToProps, {init_home, set_bussienss_home})(
  HomeScreen,
);
