import React from 'react';
import {View, StyleSheet} from 'react-native';
import LottieView from 'lottie-react-native';

const LoadingAnimation = () => {
  return (
    <View style={styles.container}>
      <LottieView
        source={require('../../res/animations/20066-globev3.json')}
        style={styles.animation}
        autoPlay={true}
        loop={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    // borderWidth: 1,
    // marginTop: 145,
  },
  // heading: {marginVertical: 20},
  animation: {
    width: 300,
    height: 300,
  },
});

export default LoadingAnimation;
