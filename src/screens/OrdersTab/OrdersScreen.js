import React, {useEffect, useRef} from 'react';
import {AppState, SafeAreaView, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import Bar from '../../components/common/Bar';
import Tabs from '../../components/ordersScreen/Tabs';
import {get_orders} from '../../actions';
import messaging from '@react-native-firebase/messaging';

// {
//   "notification":{
//      "android":{
//         "sound":"default"
//      },
//      "body":"ההזמנה שלך נשלחה לבית העסק",
//      "title":"ההזמנה שלך נשלחה בהצלחה"
//   },
//   "sentTime":1618516915809,
//   "data":{
//      "key2":"value2",
//      "key1":"value1"
//   },
//   "from":"256454720168",
//   "messageId":"0:1618516915824320%d6cb14a7d6cb14a7",
//   "ttl":2419200,
//   "collapseKey":"com.easyget"
// }

const OrdersScreen = props => {
  const appState = useRef(AppState.currentState);
  useEffect(() => {
    props.get_orders(props.token);
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      // console.log('refreshing');
      props.get_orders(props.token);
    });

    AppState.addEventListener('change', _handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', _handleAppStateChange);
      unsubscribe();
    };
    // return unsubscribe;
  }, []);

  const _handleAppStateChange = nextAppState => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      console.log('App has come to the foreground getting Orders');
      props.get_orders(props.token);
    }

    appState.current = nextAppState;
    console.log('AppState', appState.current);
  };
  return (
    <SafeAreaView style={styles.main}>
      <Bar hideBackArrow={true} header={'הזמנות'} />
      <Tabs />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  main: {flex: 1},
});

const mapStateToProps = state => {
  const {token} = state.auth;
  return {token};
};

export default connect(mapStateToProps, {get_orders})(OrdersScreen);
