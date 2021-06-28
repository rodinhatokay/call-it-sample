import React from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';

const LoadingScreen = ({notCenter}) => {
  if (notCenter)
    return (
      <View style={styles.main}>
        <ActivityIndicator
          style={styles.loader}
          color={'#adadad'}
          size={'large'}
        />
      </View>
    );
  return (
    <View style={styles.mainCenter}>
      <ActivityIndicator
        style={styles.loaderCenter}
        color={'#adadad'}
        size={'large'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainCenter: {flex: 1, justifyContent: 'center'},
  main: {flex: 1},

  loaderCenter: {justifyContent: 'center', alignItems: 'center'},
  loader: {alignItems: 'center'},
});
export default LoadingScreen;
