import React from 'react';
import {ActivityIndicator} from 'react-native';
import {Portal} from 'react-native-paper';
import {Subtitle} from '@shoutem/ui';
import LottieView from 'lottie-react-native';

import {StyleSheet, View} from 'react-native';

// maybe set this in higher order component? so we will have only 1 loader?
const Loader = ({display, source}) => {
  if (!display) return null;

  return (
    <Portal>
      <View style={styles.container}>
        <View style={styles.flex4} />
        <View style={styles.containerSpinner}>
          {/* <ActivityIndicator
            size="large"
            color={!colorActivityIndicator ? '#3daccf' : colorActivityIndicator}
          /> */}
          <LottieView
            source={source}
            // source={require(source
            //   ? source
            //   : '../../res/animations/21247-order-placed.json')}
            style={styles.lottie}
            autoPlay
            loop
          />
          <Subtitle style={styles.text}>אנא המתן...</Subtitle>
        </View>
        {/* <View style={styles.flex4} /> */}
      </View>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
  },
  flex4: {flex: 0.4},
  containerSpinner: {
    flex: 0.2,
    borderRadius: 8,
    backgroundColor: 'white',
    width: '45%',
    alignItems: 'center',
  },
  spinner: {
    // margin: 8,
  },
  text: {
    fontSize: 20,
    // fontWeight: 'bold',

    color: '#3daccf',
    // color:
    // fontWeight: '200',
    // paddingTop: 10,
  },
  lottie: {height: 120, width: 150},
});

export default Loader;
