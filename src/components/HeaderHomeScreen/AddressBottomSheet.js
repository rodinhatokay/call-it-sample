import React, {useState} from 'react';
import {View, StyleSheet, Platform} from 'react-native';
import {connect} from 'react-redux';
import BottomSheet from 'reanimated-bottom-sheet';
import {
  set_opacity_home,
  set_address_options_home,
  set_gps_settings,
  set_bussienss_home,
} from '../../actions';
import {Subtitle, Title} from '@shoutem/ui';
import AddressItem from './AddressItem';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {FlatList} from 'react-native-gesture-handler';
import {Button} from 'react-native-paper';
import {navigate} from '../../Routing/NavigationActions';
import Geolocation from 'react-native-geolocation-service';
import {
  updated_gps_error,
  updated_gps_lat_lon,
  updated_gps_loading,
} from '../../util/GPS_Helper';

Platform.OS == 'ios' ? Geolocation.requestAuthorization('whenInUse') : null;


const TouchableOpacity =
  Platform.OS === 'ios'
    ? require('react-native').TouchableOpacity
    : require('react-native-gesture-handler').TouchableOpacity;

const snapPoints = ['40%', '0%'];

const AddressBottomSheet = ({...props}) => {
  // const snapPoints = useMemo(() => ['40%'], []);
  const [selected, setSelected] = useState(0);
  const onOpeningBottomSheet = () => {
    props.set_opacity_home(0.2);
    setSelected(props.selectedAddress);
  };

  const set_loading_gps = bool => {
    props.set_gps_settings(
      updated_gps_loading(props.addresses[0], bool),
      props.addresses,
    );
  };

  const selectAddress = index => {
    if (index === 0) {
      // index  == 0 means gps
      set_loading_gps(true);
      tryGps(setSelected, index);
    } else {
      setSelected(index);
    }
  };

  const tryGps = (setSelected, index) => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        props.set_gps_settings(
          updated_gps_lat_lon(props.addresses[0], latitude, longitude),
          props.addresses,
        );
        set_loading_gps(false);
        setSelected(index);
      },
      error => {
        console.log('ERROR', error);
        props.set_gps_settings(
          updated_gps_error(props.addresses[0], error.code),
          props.addresses,
        );
        set_loading_gps(false);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const renderItem = ({item, index}) => {
    return (
      <AddressItem
        address={item}
        isChecked={selected === index ? 'checked' : 'unchecked'}
        set_selected_address={selectAddress}
        index={index}
      />
    );
  };
  const onPRessAddAddress = () => {
    navigate('addAddressScreen');
  };

  const onPressUpdate = () => {
    props.set_bussienss_home(props.token, selected, props.addresses);
    props.sheetRef.current.snapTo(1);
    // need to set loading for home page
    // need to close the bottom sheet
    // fetch according to selected..
    // update selected
  };
  const footer = () => {
    return (
      <View style={styles.containerFooter}>
        <TouchableOpacity onPress={onPRessAddAddress}>
          <View style={styles.addNewAddres}>
            <Icon name="plus" size={20} />
            <Subtitle style={styles.addAddressText}>הוסף כתובת חדשה</Subtitle>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onPressUpdate}
          style={styles.containerUpdate}>
          <Subtitle style={styles.update}>עדכן</Subtitle>
        </TouchableOpacity>
      </View>
    );
  };
  const renderContent = () => (
    <View style={styles.renderContainer}>
      <View style={styles.knob} />
      <View style={styles.list}>
        <FlatList
          data={props.addresses}
          // data={[]}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderItem}
        />
      </View>
      {footer()}
    </View>
  );
  const onClosing = () => {
    props.set_opacity_home(0);
  };

  return (
    <BottomSheet
      enabledInnerScrolling={true}
      ref={props.sheetRef}
      snapPoints={snapPoints}
      borderRadius={10}
      initialSnap={1}
      renderContent={renderContent}
      onCloseEnd={onClosing}
      onOpenStart={onOpeningBottomSheet}
    />
  );
};

const styles = StyleSheet.create({
  renderContainer: {
    backgroundColor: 'white',
    paddingTop: 16,
    height: '100%',
  },
  knob: {
    height: 7,
    width: 40,
    borderRadius: 5,
    backgroundColor: 'lightgrey',
    alignSelf: 'center',
    marginVertical: 5,
  },
  mainBtn: {
    marginTop: 20,
    backgroundColor: '#3daccf',
    height: 46,
    marginHorizontal: 24,
    justifyContent: 'center',
  },
  btnLabel: {fontSize: 18},
  list: {maxHeight: '50%'},
  addNewAddres: {
    flexDirection: 'row',
    marginHorizontal: 47,
    marginTop: 7,
    alignItems: 'center',
  },
  addAddressText: {fontWeight: 'bold', marginHorizontal: 5},
  update: {fontSize: 20, color: 'white'},
  containerFooter: {justifyContent: 'space-between', flex: 1},
  containerUpdate: {
    alignContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
    backgroundColor: '#3daccf',
    marginHorizontal: 50,
    borderRadius: 10,
    paddingVertical: 13,
  },
});

const mapStateToProps = state => {
  const {sheetRef, addresses, selectedAddress, opacity} = state.home;
  const {token} = state.auth;
  return {sheetRef, addresses, selectedAddress, token, opacity};
};

export default connect(mapStateToProps, {
  set_opacity_home,
  set_address_options_home,
  set_gps_settings,
  set_bussienss_home,
})(AddressBottomSheet);
