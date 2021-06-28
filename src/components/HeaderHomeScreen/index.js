import React from 'react';
import {TouchableOpacity, View, StyleSheet, Animated} from 'react-native';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Subtitle, Title} from '@shoutem/ui';
import {set_opacity_home} from '../../actions';
import {navigate} from '../../Routing/NavigationActions';

const HeaderHomeScreen = ({...props}) => {
  const onPressAdress = () => {
    props.set_opacity_home(0.2);
    props.sheetRef.current.snapTo(0);
  };
  const onPressShearch = () => navigate('SearchHomeScreen');
  return (
    <>
      <View style={styles.container}>
        <View style={styles.row}>
          <Title>כתובת</Title>
          <View style={styles.address} />
          <TouchableOpacity
            style={styles.addressPressable}
            onPress={onPressAdress}>
            <Title style={styles.addressText}>
              {props.addresses[props.selectedAddress].name}
            </Title>
            <Icon name="chevron-down" color={'#3daccf'} size={23}></Icon>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={onPressShearch} style={styles.icon}>
          <Icon name={'magnify'} size={30}></Icon>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: 15,
    marginVertical: 15,

    justifyContent: 'space-between',
  },
  row: {flexDirection: 'row', flex: 1},
  address: {
    width: 1,
    backgroundColor: 'black',
    marginHorizontal: 3.5,
    marginVertical: 5,
    marginBottom: 8,
  },
  addressPressable: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  addressText: {color: '#3daccf'},
  icon: {flex: 0.3},
});
const mapStateToProps = state => {
  const {sheetRef, addresses, selectedAddress} = state.home;
  return {sheetRef, addresses, selectedAddress};
};

export default connect(mapStateToProps, {set_opacity_home})(HeaderHomeScreen);
