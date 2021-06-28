import {Subtitle} from '@shoutem/ui';
import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {goBack} from '../../Routing/NavigationActions';

const Bar = ({header, leftComponent, hideBackArrow}) => {
  if (leftComponent) {
    return (
      <View style={styles.containerWithleftComponent}>
        <View style={styles.rightComponent}>
          {!hideBackArrow ? (
            <TouchableOpacity onPress={goBack}>
              <Icon name="arrow-right" style={styles.icon} size={35} />
            </TouchableOpacity>
          ) : null}
          <Subtitle style={styles.name}>{header}</Subtitle>
        </View>
        <View>{leftComponent}</View>
      </View>
    );
  }
  return (
    <View
      style={
        !hideBackArrow ? styles.container : styles.containerWithoutBackArrow
      }>
      {!hideBackArrow ? (
        <TouchableOpacity onPress={goBack}>
          <Icon name="arrow-right" style={styles.icon} size={35} />
        </TouchableOpacity>
      ) : null}
      <Subtitle style={styles.name}>{header}</Subtitle>
    </View>
  );
};
const styles = StyleSheet.create({
  
});
export default Bar;
