import React from 'react';
import {View, StyleSheet, TouchableOpacity, Platform} from 'react-native';
import {connect} from 'react-redux';
import {Subtitle} from '@shoutem/ui';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {navigate} from '../Routing/NavigationActions';
import {CYAN} from '../util/colors';

const AndroidIcon = () => {
  return (
    <Icon
      name="cart-outline"
      style={styles.iconAndroid}
      color="black"
      size={35}
    />
  );
};

const IosIcon = () => {
  return (
    <View style={styles.containerIconIOS}>
      <Icon
        name={'cart-outline'}
        style={styles.iconIos}
        color={'black'}
        size={35}
      />
    </View>
  );
};

const IconDisplay = Platform.OS == 'ios' ? IosIcon : AndroidIcon;

const Cart = props => {
  if (!props.show) return null;
  const onPress = () => {
    navigate('checkout');
  };
  return (
    <TouchableOpacity style={styles.main} onPress={onPress}>
      {IconDisplay()}
      <View style={styles.counterContainer}>
        <Subtitle style={styles.counter}>{props.counter}</Subtitle>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  main: {
    position: 'absolute',
    bottom: 25,
    right: 25,
  },
  containerIconIOS: {
    backgroundColor: CYAN,
    borderColor: 'grey',
    borderRadius: 35,
    borderWidth: 1,
  },
  iconIos: {
    padding: 15,
  },
  iconAndroid: {
    padding: 15,
    backgroundColor: '#3daccf',
    borderWidth: 0.5,
    borderColor: 'grey',
    borderRadius: 50,
  },
  counterContainer: {
    alignItems: 'center',
    backgroundColor: 'white',
    position: 'absolute',
    left: -12,
    height: 30,
    width: 30,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'grey',
  },
  counter: {
    paddingTop: 2,
    paddingRight: 2,
  },
});

const mapStateToProps = state => {
  const {show, counter} = state.cart;
  return {show, counter};
};

export default connect(mapStateToProps)(Cart);
