import React, {useState, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {Subtitle} from '@shoutem/ui';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import NetInfo from '@react-native-community/netinfo';

const BarConnection = () => {
  const [isConnected, setIsConnected] = useState(true);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      //console.log('state', state);
      setIsConnected(state.isConnected);
    });
    return unsubscribe;
  }, []);

  if (isConnected) return null;

  return (
    <View style={styles.main}>
      <Subtitle style={styles.text}>רשת לא זמינה</Subtitle>
      <View style={styles.space} />
      <Icon
        name="signal-cellular-1"
        size={25}
        // style={{transform: [{scaleX: -1}]}}
        color={'red'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    justifyContent: 'center',
    //paddingTop: 50,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  text: {textAlign: 'left', color: 'red', fontSize: 17},
  space: {width: 10},
});

export default BarConnection;
