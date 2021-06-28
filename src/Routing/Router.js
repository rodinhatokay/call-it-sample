import React, {useEffect} from 'react';
import RNBootSplash from 'react-native-bootsplash';
import {connect} from 'react-redux';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import RegisterOrLogin from './RegisterOrLogin';
import {navigationRef, isReadyRef, navigate} from './NavigationActions';
import {
  View,
  StyleSheet,
  I18nManager,
  SafeAreaView,
  Platform,
} from 'react-native';
import {getData, requestPremissons, storeData} from '../util/Helper';
import {
  setSignedIn,
  userFormUpdate_signUp,
  init_address_options_home,
  set_credit_cards,
  set_token_save_token,
  setToken,
} from '../actions';
import {
  keyStorage,
  LASTTOKEN,
  RefreshToken,
  UpdateTokenFCM,
  UserDetails,
} from '../util/Pref';
import BottomTabNav from './BottomTabNav';
import Image_Viewer from '../components/common/Image_Viewer';
import Alert from '../components/common/Alert';
// import AddressBottomSheet from '../components/HeaderHomeScreen/AddressBottomSheet';
import messaging from '@react-native-firebase/messaging';
import {
  getHeaderForFetch,
  postHeaderForFetch,
} from '../util/Helpers/fetchHelpers';
import momenttz from 'moment-timezone';
import ReactNativeRestart from 'react-native-restart';
import {Subtitle} from '@shoutem/ui';
import BarConnection from '../components/BarConnection';
import {requestAuthorization} from 'react-native-geolocation-service';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'white',
    background: 'white',
  },
};

const Router = ({signedIn, userFormUpdate_signUp, setSignedIn, ...props}) => {
  useEffect(() => {
    if (Platform.OS === 'ios')
      PushNotificationIOS.setApplicationIconBadgeNumber(0);
    const init = async () => {
      const data = await getData(keyStorage);
      // console.log('STORED DATA:', data);
      if (data !== null) {
        if (data.creditCards) {
          props.set_credit_cards(data.creditCards);
        }
        if (data.addresses) {
          props.init_address_options_home(data.addresses, data.mainAddress);
        }
        if (data.token) {
          userFormUpdate_signUp({prop: 'tos', value: data.tos});
          setSignedIn(data.token);
          handle_timer_refresh_token(
            data.token,
            data.dateToRefreshToken,
            props.setToken,
          );
        }
        if (data.favoriteIds) {
          userFormUpdate_signUp({prop: 'favoriteIds', value: data.favoriteIds});
        }
      }

      
    };
    init().finally(async () => {
      const isRtl = I18nManager.isRTL;
      if (isRtl === false) {
        I18nManager.allowRTL(true);
        I18nManager.forceRTL(true);
        setTimeout(() => {
          ReactNativeRestart.Restart();
        }, 100);
      } else {
        await RNBootSplash.hide({fade: true});
        if (Platform.OS == 'ios') {
          PushNotificationIOS.requestPermissions();
          return;
        }
        requestPremissons();
      }
      // const result = await requestPremissons();
      // userFormUpdate_signUp({prop: 'gpsGranted', value: result});
      // if(IOS ) use  requestAuthorization(authorizationLevel) (iOS only) for gps
      // requestAuthorization();
      // console.log('Bootsplash has been hidden successfully');
    });

    

    return () => {
      isReadyRef.current = false;
    };
  }, []);

  const onNavReady = () => {
    isReadyRef.current = true;
  };

  return (
    <SafeAreaView style={styles.main}>
      <Image_Viewer />
      <Alert />
      <BarConnection />
      <NavigationContainer
        theme={MyTheme}
        ref={navigationRef}
        onReady={onNavReady}>
        {signedIn ? (
          <BottomTabNav></BottomTabNav>
        ) : (
          <RegisterOrLogin></RegisterOrLogin>
        )}
      </NavigationContainer>
      {/* <AddressBottomSheet /> */}
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  main: {flex: 1},
});

const mapStateToProps = state => {
  const {signedIn, token} = state.auth;
  return {signedIn, token};
};

export default connect(mapStateToProps, {
  userFormUpdate_signUp,
  setSignedIn,
  init_address_options_home,
  set_credit_cards,
  set_token_save_token,
  setToken,
})(Router);
