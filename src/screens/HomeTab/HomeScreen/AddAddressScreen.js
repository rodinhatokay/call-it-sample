import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {TextInput, Button} from 'react-native-paper';
import ErrorText from '../../../components/common/ErrorText';
import {
  autoCompleteCities,
  isCityExist,
  withnumberAddReg,
  withoutnumberReg,
} from '../../../util/Helper';
import {Heading, NavigationBar, Title} from '@shoutem/ui';
import {goBack} from '../../../Routing/NavigationActions';
import {set_address_options_home} from '../../../actions';

const HeaderList = ({...props}) => {
  return (
    <>
      <TextInput
        label={'כתובת'}
        style={styles.inputStyle}
        value={props.address}
        onChangeText={props.onAddressChange}
        numberOfLines={1}
        multiline={true}
        error={props.addressError}
        underlineColor={'transparent'}
        underlineColorAndroid={'transparent'}
        autoCorrect={false}
        blurOnSubmit={true}
      />
      <ErrorText text={props.addressError} />
      <TextInput
        label={'עיר'}
        style={styles.inputStyle}
        value={props.city}
        onChangeText={props.onCityChange}
        error={props.cityError}
        numberOfLines={1}
        multiline={true}
        underlineColor={'transparent'}
        underlineColorAndroid={'transparent'}
        autoCorrect={false}
        blurOnSubmit={true}
      />
      <ErrorText text={props.cityError} />
    </>
  );
};

const AddAddressScreen = ({...props}) => {
  const [errorText, setErrorText] = useState('');
  const [address, setAddress] = useState('');
  const [addressError, setAddressError] = useState('');
  const [city, setCity] = useState('');
  const [cityError, setCityError] = useState('');
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);

  const onPressAddAddress = () => {
    setLoading(true);
    isCityExist(city, props.token)
      .then(city => {
        // inseret city === {"idcities": 1362, "lat": 32.1195869, "lon": 35.2499123, "name": "כפר תפוח"}
        // console.log('CITY:', city);
        // return;
        if (city === null) {
          setErrorText('עיר לא קיימת');
          setLoading(false);
          return;
        }
        // add city to addresses and save on phone
        const {addresses} = props;
        city.name = address + ', ' + city.name;
        const newAddresses = [...addresses, city];
        props.set_address_options_home(newAddresses);
        setLoading(false);
        goBack();
        return;
      })
      .catch(error => {
        console.log('ERROR:', error);
        setLoading(false);
        setErrorText('הייתה שגיאה אנה נסו שוב מאוחר יותר');
      });
  };

  const renderRowSug = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setCity(item.name);
          setCities([]);
        }}>
        <View style={styles.itemContainer}>
          <Title style={styles.itemText}>{item.name}</Title>
        </View>
        {cities.length === index + 1 ? <View style={styles.line} /> : null}
      </TouchableOpacity>
    );
  };

  const onAddressChange = text => {
    if (text.match(withnumberAddReg)) {
      setAddress(text);
      setAddressError('');
    } else {
      setAddressError(
        'שגיאה: כתובת יכולה להכיל רק אותיות, מספרים וסימני פיסוק',
      );
      setAddress(text);
    }
  };
  const checkCities = cities => {
    if (!Array.isArray(cities)) setCities([]);
    if (cities.length > 5) {
      setCities(cities.slice(0, 5));
      return;
    }
    setCities(cities);
  };

  const onCityChange = text => {
    if (text === '') setCities([]);
    setErrorText('');
    if (text.match(withoutnumberReg)) {
      setCity(text);
      try {
        autoCompleteCities(text, checkCities, props.token);
      } catch (error) {
        console.log('ERROR', error);
      }
    } else {
      setCityError('שגיאה: עיר לא יכולה להכיל מספרים ');
    }
  };

  const headerListComponent = () => {
    return (
      <HeaderList
        onCityChange={onCityChange}
        onAddressChange={onAddressChange}
        address={address}
        addressError={addressError}
        city={city}
        cityError={cityError}
      />
    );
  };

  const listFooterComponent = () => {
    if (Platform.OS === 'ios') return <View style={{height: 1001}} />;
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <NavigationBar
        styleName="inline no-border"
        hasHistory
        leftComponent={IconGoBack()}
        centerComponent={HeadingScreen()}
      />
      {errorText !== '' ? (
        <Title style={styles.errorText}>{errorText}</Title>
      ) : null}
      <FlatList
        keyboardShouldPersistTaps={'handled'}
        removeClippedSubviews={false}
        style={styles.contianerList}
        //contentContainerStyle={styles.contianerList}
        data={cities}
        keyExtractor={(_, index) => index.toString()}
        //        ListFooterComponentStyle={listFooterComponent()}//
        renderItem={renderRowSug}
        ListHeaderComponent={headerListComponent()}
        ListFooterComponent={footerList(onPressAddAddress, loading)}
      />
    </SafeAreaView>
  );
};

const footerList = (onPressAddAddress, loading) => {
  return (
    <View style={styles.container}>
      <Button
        style={styles.mainBtn}
        labelStyle={styles.btnLabel}
        disabled={loading}
        loading={loading}
        color={'white'}
        mode="outlined"
        onPress={onPressAddAddress}>
        הוסף כתובת
      </Button>
      {Platform.OS === 'ios' ? <View style={{height: 300}} /> : null}
    </View>
  );
};

const IconGoBack = () => {
  return (
    <TouchableOpacity onPress={goBack}>
      <Icon name="arrow-right" style={styles.icon} size={35} />
    </TouchableOpacity>
  );
};

const HeadingScreen = () => {
  return <Heading>הזן כתובת</Heading>;
};

const styles = StyleSheet.create({
  container: {flex: 1},
  icon: {
    marginStart: 15,
  },
  inputStyle: {
    height: 52,
    borderRadius: 2,
    borderColor: 'lightgrey',
    borderWidth: 1,
    backgroundColor: 'white',
    color: 'black',
    fontFamily: 'regular-rubik',
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 15,
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    borderColor: 'lightgrey',
    borderWidth: 1,
    borderBottomWidth: 0,
    padding: 10,
    paddingVertical: 15,
  },
  itemText: {
    fontSize: 15,
  },
  line: {height: 1, backgroundColor: 'lightgrey'},
  mainBtn: {
    marginTop: 20,
    backgroundColor: '#3daccf',
    height: 46,
    marginHorizontal: 24,
    justifyContent: 'center',
  },
  btnLabel: {fontSize: 18},
  errorText: {color: '#B00020', alignSelf: 'center', fontWeight: 'bold'},
  contianerList: {marginHorizontal: 35},
});

const mapStateToProps = state => {
  const {token} = state.auth;
  const {addresses} = state.home;
  return {token, addresses};
};

export default connect(mapStateToProps, {set_address_options_home})(
  AddAddressScreen,
);
