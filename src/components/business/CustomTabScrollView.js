import React from 'react';
import {Dimensions, StyleSheet, Animated, View, StatusBar} from 'react-native';

const SafeStatusBar = Platform.select({
  ios: 44,
  android: StatusBar.currentHeight,
});

const windowHeight = Dimensions.get('window').height;
const TabBarHeight = 48;
const HeaderHeight = 280;

const CustomTabScrollView = ({children, ...props}) => {
  return (
    <Animated.ScrollView
      contentContainerStyle={styles.scrollView}
      scrollToOverflowEnabled={true}
      showsVerticalScrollIndicator={false}
      {...props}
      ref={props.customRef}
      scrollEventThrottle={20}>
      <View style={styles.container}>{children}</View>
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    paddingTop: HeaderHeight + TabBarHeight + 36,
  },
  container: {
    minHeight: windowHeight + SafeStatusBar - HeaderHeight + 110,
    // borderWidth: 3,
  },
});

export default CustomTabScrollView;
