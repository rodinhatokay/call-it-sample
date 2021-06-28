import React from 'react';
import {StyleSheet} from 'react-native';
import {Subtitle} from '@shoutem/ui';

const Status = ({text}) => {
  if (text === 'closed') return <Subtitle style={styles.red}>סגור</Subtitle>;
  if (text === 'open') return <Subtitle style={styles.green}>פתוח</Subtitle>;
  return <Subtitle style={styles.brown}>עמוס</Subtitle>;
};

const styles = StyleSheet.create({
  red: {color: '#B00020', textAlign: 'left'},
  green: {color: 'green', textAlign: 'left'},
  brown: {color: 'orange', textAlign: 'left'},
});

export default Status;
