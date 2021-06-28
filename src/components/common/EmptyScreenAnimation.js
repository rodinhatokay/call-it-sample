import React from 'react';
import {View, StyleSheet} from 'react-native';
import LottieView from 'lottie-react-native';
import {Heading} from '@shoutem/ui';

const EmptyScreenAnimation = ({header, source, autoPlay, loop}) => {
  return (
    <View style={styles.container}>
      {header ? <Heading style={styles.heading}>{header}</Heading> : null}
      <LottieView
        source={source}
        style={styles.animation}
        autoPlay={autoPlay}
        loop={loop}
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
    width: 200,
    height: 200,
  },
});

export default EmptyScreenAnimation;
