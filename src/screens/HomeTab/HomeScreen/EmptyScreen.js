import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {Heading} from '@shoutem/ui';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const EmptyScreen = ({header, imageSrc, iconName, withoutMargin}) => {
  if (iconName) {
    return (
      <View style={withoutMargin ? styles.container : styles.containerM}>
        <Heading style={styles.heading}>
          {header == undefined ? 'לא נמצאו עסקים ליידך' : header}
        </Heading>
        <Icon size={200} name={iconName} />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Heading style={styles.heading}>
        {header == undefined ? 'לא נמצאו עסקים ליידך' : header}
      </Heading>
      <Image
        style={styles.image}
        source={
          imageSrc ? imageSrc : require('../../../res/images/robot.png')
        }></Image>
    </View>
  );
};

const styles = StyleSheet.create({
  containerM: {
    alignItems: 'center',
    flex: 1,
    marginTop: 145,
  },
  container: {
    alignItems: 'center',
    flex: 1,
    // marginTop: 145,
  },
  heading: {marginVertical: 20},
  image: {
    width: 200,
    height: 200,
  },
});

export default EmptyScreen;
