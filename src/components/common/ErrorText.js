import React from 'react';
import {StyleSheet} from 'react-native';
import {Subtitle} from '@shoutem/ui';

const ErrorText = ({text}) => {
  if (text === '') return null;
  return <Subtitle style={styles.text}>{text}</Subtitle>;
};
const styles = StyleSheet.create({
  text: {
    color: '#B00020',
    fontSize: 13,
    paddingHorizontal: 12,
  },
});

export default ErrorText;
