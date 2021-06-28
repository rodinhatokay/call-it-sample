import {Subtitle} from '@shoutem/ui';
import React from 'react';
import {View, Animated, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from 'react-redux';
import {BASEURL} from '../../util/Pref';

const HeaderBusiness = ({y, panHandlers, ...props}) => {
  return (
    <Animated.View
      {...panHandlers}
      style={{...styles.header, transform: [{translateY: y}]}}>
      <FastImage
        source={{uri: `${BASEURL}${props.imageUrl}`}}
        style={styles.image}
        resizeMode={FastImage.resizeMode.contain}
      />
      <View style={styles.infoContainer}>
        <View style={styles.textContainer}>
          <Icon style={styles.icon} name="clock-outline" size={30}></Icon>
          <Subtitle style={{color: props.isOpenColor, ...styles.text}}>
            {props.isOpen}
          </Subtitle>
          <View style={styles.seprator} />
          <Subtitle style={styles.time}>{props.openingHourToday}</Subtitle>
          <Subtitle></Subtitle>
        </View>
        <View style={styles.msgContainer}>
          <Icon style={styles.icon} name="information-outline" size={30}></Icon>
          <Subtitle style={styles.textInfo}>{props.message}</Subtitle>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  
});

const mapStateToProps = state => {
  const {openingHourToday, message, imageUrl} = state.business;
  const [isOpen, isOpenColor] = bizHoursInfo(state.business.isOpen);
  return {openingHourToday, message, isOpen, isOpenColor, imageUrl};
};

const bizHoursInfo = isOpen => {
  if (isOpen === 'open') return ['פתוח', 'green'];
  if (isOpen === 'busy') {
    const brown = 'orange';
    return ['עמוס', brown];
  }
  return ['סגור', '#B00020'];
};

export default connect(mapStateToProps)(HeaderBusiness);
