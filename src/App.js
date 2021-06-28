import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {View, StatusBar, Platform, UIManager, I18nManager} from 'react-native';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import ReduxThunk from 'redux-thunk';
import reducers from './reducers';
import Router from './Routing/Router';
import {DefaultTheme, Colors} from 'react-native-paper';
import {Provider as PaperProvider} from 'react-native-paper';
import codePush from 'react-native-code-push';
import {codePushKey, keyStorage} from './util/Pref';
import {enableScreens} from 'react-native-screens';
enableScreens();

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const fontConfig = {
  default: {
    regular: {
      fontFamily: 'Rubik-Regular',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'Rubik-Regular',
      fontWeight: 'normal',
    },
    light: {
      fontFamily: 'Rubik-Regular',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'Rubik-Regular',
      fontWeight: 'normal',
    },
    bold: {
      fontFamily: 'Rubik-Regular',
      fontWeight: 'normal',
    },
  },
};

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#3daccf',
    accent: '#292929',
    backgroundColor: 'white',
    surface: Colors.white,
    // placeholder: '#3daccf',
    // backdrop: '#3daccf',
  },
  fonts: fontConfig,
};

// console.log('DEF: ', DefaultTheme);
// console.log('rgba(0, 0, 0, 0.54)', rgba(0, 0, 0, 0.54));
class App extends Component {
  componentDidMount() {
    // storeData(keyStorage, null);
  }

  render() {
    const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));
    return (
      <View style={{flex: 1}}>
        <StatusBar barStyle={'dark-content'} backgroundColor={'white'} />
        <Provider store={store}>
          <PaperProvider theme={theme}>
            <Router></Router>
            {/* <AddressBottomSheet /> */}
          </PaperProvider>
        </Provider>
      </View>
    );
  }
}

const options = {
  updateDialog: {
    title: 'קיים עדכון חדש',
    appendReleaseDescription: true,
    descriptionPrefix:
      'יש להתקין את העדכון על מנת להמשיך להנות מהאפליקציה במלואה',
    mandatoryContinueButtonLabel: 'עדכון',
    mandatoryUpdateMessage:
      'יש להתקין את העדכון על מנת להמשיך להנות מהאפליקציה במלואה',
    optionalInstallButtonLabel: 'עדכון',
  },
  installMode: codePush.InstallMode.IMMEDIATE,
  checkFrequency: codePush.CheckFrequency.ON_APP_START,
  deploymentKey: codePushKey,
};

export default codePush(options)(App);

// export default App;
