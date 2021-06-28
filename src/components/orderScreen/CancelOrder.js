import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import {Subtitle} from '@shoutem/ui';
import {CYAN, RED} from '../../util/colors';

const CancelOrder = ({status, onPress, loading, error}) => {
  if (status !== 1) return null;
  return (
    <View style={styles.main}>
      <TouchableOpacity onPress={onPress} style={styles.container}>
        <Subtitle style={styles.text}>ביטול הזמנה</Subtitle>
        {loading ? <ActivityIndicator size={'small'} color={'white'} /> : null}
      </TouchableOpacity>
      {error ? (
        <Subtitle style={styles.errorText}>הייתה שגיאה בביטול הזמנה</Subtitle>
      ) : (
        <View style={styles.space} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
 
});

export default CancelOrder;
