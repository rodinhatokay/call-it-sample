import React, {useEffect, useState} from 'react';
import {Platform, SafeAreaView, StyleSheet, Keyboard, View} from 'react-native';
import {connect} from 'react-redux';
import Bar from '../../components/common/Bar';
import Products from '../../components/checkout/Products';
import {set_loading_screen_checkout, init_checkout} from '../../actions';
import LoadingScreen from '../../components/common/LoadingScreen';
import Loader from '../../components/common/Loader';
import BtnPostOrder from '../../components/checkout/BtnPostOrder';
// import oadingScreen

const Checkout = ({navigation, ...props}) => {
  const [keyboardShow, setKeyboardShow] = useState(false);

  useEffect(() => {
    props.set_loading_screen_checkout(true);
    props.init_checkout(props.token, props.idBranch);
    Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', _keyboardDidHide);

    // cleanup function
    return () => {
      Keyboard.removeListener('keyboardDidShow', _keyboardDidShow);
      Keyboard.removeListener('keyboardDidHide', _keyboardDidHide);
    };
  }, []);

  const handleKeyboardIos = () => {
    if (Platform.OS === 'android' || !keyboardShow) return;
    return <View style={styles.space} />;
  };

  const _keyboardDidShow = () => setKeyboardShow(true);
  const _keyboardDidHide = () => setKeyboardShow(false);

  if (props.loadingScreen)
    return (
      <SafeAreaView style={styles.main}>
        <Bar header={`צ'ק אאוט`} />
        <LoadingScreen />
      </SafeAreaView>
    );
  return (
    <SafeAreaView style={styles.main}>
      <Bar header={`צ'ק אאוט`} />
      <Products />
      <BtnPostOrder />
      <Loader
        source={require('../../res/animations/21247-order-placed.json')}
        display={props.loadingOrder}
      />
      {handleKeyboardIos()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  main: {flex: 1},
  space: {height: 280},
});

const mapStateToProps = state => {
  const {loadingScreen, loadingOrder} = state.checkout;
  const {token} = state.auth;
  const {idBranch} = state.cart;
  return {loadingScreen, token, idBranch, loadingOrder};
};

export default connect(mapStateToProps, {
  set_loading_screen_checkout,
  init_checkout,
})(Checkout);
