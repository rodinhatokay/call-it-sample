import {
  SET_OPACITY_HOME,
  SET_ADDRESS_OPTIONS_HOME,
  SET_SELECTED_ADDRES,
  UPDATE_FIELD_HOME,
  INIT_ADDRESS_OPTION_HOME,
  SET_HOME_LOADING,
  SET_BUSSNIESS,
  SET_ERRORLOADING_HOME,
} from './types';
import Geolocation from 'react-native-geolocation-service';
import {
  keyStorage,
  SearchBrachesUrl,
  UserDetails,
  AutoCompleteCities,
} from '../util/Pref';
import {getData, storeData} from '../util/Helper';
import {translate_gpsCode_to_text} from '../util/GPS_Helper';
import {groupBy} from 'lodash';

export const set_opacity_home = opacity => {
  return {type: SET_OPACITY_HOME, payload: opacity};
};

/**
 * sets loading  in gps
 *
 * @param {{}} gps
 * @param {[]} listAddresses
 *
 */
export const set_gps_settings = (gps, listAddresses) => {
  // console.log('LIST ADDRESSES: ', listAddresses[0]);
  listAddresses[0] = gps;
  const newList = [...listAddresses];
  return {type: SET_ADDRESS_OPTIONS_HOME, payload: newList};
};

export const set_address_options_home = listAdresses => {
  // need to save on the phone the new listAdressess too
  save_addresses_storage(listAdresses);
  return {type: SET_ADDRESS_OPTIONS_HOME, payload: listAdresses};
};

/**
 * sets into store the listaddresses and if main included too..
 * @param {[]} listAddresses
 * @param {boolean} mainAdderss
 */
export const init_address_options_home = (listAddresses, mainAddress) => {
  // console.log('called');
  return {
    type: INIT_ADDRESS_OPTION_HOME,
    payload: {addresses: listAddresses, mainAddressIncluded: mainAddress},
  };
};

export const set_selected_address = index => {
  return {type: SET_SELECTED_ADDRES, payload: index};
};

/**
 *
 * @param {number} selected
 * @param {[]} listAddresses
 * @returns {() =>}
 */
export const set_bussienss_home = (token, selected, listAddresses) => {
  const {lat, lon} = listAddresses[selected];
  // console.log('LAT LON,', lat, lon);
  return dispatch => {
    dispatch({type: SET_HOME_LOADING, payload: true});
    dispatch({type: SET_SELECTED_ADDRES, payload: selected});
    fetch_data(token, lat, lon)
      .then(result => {
        set_businesses(dispatch, result);
      })
      .catch(error => dispatch({type: SET_ERRORLOADING_HOME, payload: true}));
  };
};

export const init_home = (addresses, token, mainAdderssIncluded = false) => {
  return dispatch => {
    dispatch({type: SET_HOME_LOADING, payload: true});
    set_gps_error(dispatch, addresses);
    Geolocation.getCurrentPosition(
      position => {
        on_gps_success(
          dispatch,
          token,
          position,
          addresses,
          mainAdderssIncluded,
        );
      },
      error => {
        // See error code charts below.
        on_gps_fail(dispatch, error, token, addresses, mainAdderssIncluded);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };
};

const on_gps_success = (
  dispatch,
  token,
  position,
  addresses,
  mainAdderssIncluded = false,
) => {
  // console.log('postion', position);

  const {coords} = position;
  const {latitude, longitude} = coords;
  const newAddresses = update_addresses_gps_coords(
    addresses,
    latitude,
    longitude,
  );
  // console.log('REACHED');
  if (mainAdderssIncluded) {
    console.log('+ main address is included');
    dispatch({type: SET_ADDRESS_OPTIONS_HOME, payload: newAddresses});
  } else {
    dispatch({type: SET_ADDRESS_OPTIONS_HOME, payload: newAddresses});
    console.log('- main address is not included');
    init_main_address(dispatch, token, newAddresses, false);
  }
  fetch_data(token, latitude, longitude)
    .then(result => {
      set_businesses(dispatch, result, 0);
    }) // auto select first index
    .catch(error => dispatch({type: SET_ERRORLOADING_HOME, payload: true}));
  // set Lat lon on listAddresses
  // fetch data for that loc
  // after fetch need to set new listAddresses, data, selected Address
  // set data + layout somehow..
};

const update_addresses_gps_coords = (addresses, lat, lon) => {
  addresses[0].lat = lat;
  addresses[0].lon = lon;
  return [...addresses];
};

const set_gps_error = (distpach, addresses, errrorGpsCode = null) => {
  if (errrorGpsCode) {
    const errorText = translate_gpsCode_to_text(errrorGpsCode);
    // console.log('ERROR:', errorText);
    addresses[0].errorText = errorText;
    distpach({type: SET_ADDRESS_OPTIONS_HOME, payload: [...addresses]});
  }
  addresses[0].errorText = '';
  distpach({type: SET_ADDRESS_OPTIONS_HOME, payload: [...addresses]});
};

const on_gps_fail = (
  dispatch,
  errorGps,
  token,
  addresses,
  mainAdderssIncluded,
) => {
  // errorGps contains code and message
  // on gps fail set reason of fail gps in list
  // set owners address
  // console.log('reached here');
  set_gps_error(dispatch, addresses, errorGps.code);
  if (!mainAdderssIncluded) {
    init_main_address(dispatch, token, addresses, true);
    // need to fetch main adderss then set
    // after setting data
    // after fetch need to set new listAddresses, data, selected Address
  } else {
    // just fetch by lat lon of main adderss
    const [mainAdderss, selectingIndex] = is_user_address_included(addresses);
    const {lat, lon} = mainAdderss;
    fetch_data(token, lat, lon)
      .then(result => {
        set_businesses(dispatch, result, selectingIndex);
      })
      .catch(error => dispatch({type: SET_ERRORLOADING_HOME, payload: true}));
  }
};

const init_main_address = async (
  dispatch,
  token,
  addresses,
  without_gps = false,
) => {
  try {
    const response = await fetch(UserDetails, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });
    const result = await response.json();
    const {address} = result;
    const [restAddress, cityName] = address.split('@');
    // });
    // const city = await fetch('') need to call autocomplete cities.. then auto select..

    const city = await fetch_city(cityName, token);
    if (!city) {
      // display error message
      console.error('COULDNT GET CITY');
    } else {
      const {lat, lon, idcities} = city;
      const mainAddress = {
        name: restAddress + ', ' + city.name,
        lat: lat,
        lon: lon,
        idcities: idcities,
      };
      let [_, selectingIndex] = add_to_addresses(
        dispatch,
        mainAddress,
        addresses,
        true,
      );

      if (without_gps) {
        fetch_data(token, lat, lon)
          .then(result => {
            set_businesses(dispatch, result, selectingIndex);
          }) // auto select city here, just disptach set_selected_address
          .catch(error =>
            dispatch({type: SET_ERRORLOADING_HOME, payload: true}),
          );
      }
    }
  } catch (error) {
    console.error('ERROR in init main address:', error);
  }
};

/**
 *  addes to reducer home addresses new address return address
 * @param {() =>} dispatch
 * @param {string} address
 * @param {[]} addresses
 * @param {boolean} isMainAddress
 * @returns {object} address
 */
const add_to_addresses = (
  dispatch,
  address,
  addresses,
  isMainAddress = false,
) => {
  if (isMainAddress) {
    address.mainAddress = true;
    dispatch({
      type: UPDATE_FIELD_HOME,
      payload: {prop: 'mainAddressIncluded', value: true},
    });
  }
  const newAddresses = [...addresses, address];
  dispatch({type: SET_ADDRESS_OPTIONS_HOME, payload: newAddresses});
  save_addresses_storage(newAddresses, isMainAddress);
  return [address, newAddresses.length - 1];
};

const save_addresses_storage = async (
  listAddresses,
  isMainAdderssContaines = null,
) => {
  // get the storage data
  // then save with it the new list addresses
  let data = await getData(keyStorage);
  data.addresses = listAddresses;
  if (isMainAdderssContaines !== null)
    data.mainAddress = isMainAdderssContaines;
  await storeData(keyStorage, data);
};

const fetch_city = async (cityName, token) => {
  if (!cityName) return null;
  const response = await fetch(AutoCompleteCities, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      input: cityName,
    }),
  });
  const result = await response.json();
  if (Array.isArray(result)) {
    for (let i = 0; i < result.length; i++) {
      if (result[i].name === cityName) {
        console.log('fetch city returning with', result[i]);
        return result[i];
      }
    }
  }

  return null;
};

/**
 *given array of addresses check if it contains main address
 * returns address or null
 * @param {array} addresses
 */
const is_user_address_included = addresses => {
  for (let i = 0; i < addresses.length; i++) {
    if (addresses[i].mainAddress) {
      return [addresses[i], i];
    }
  }
  return null;
};

const fetch_data = async (token, lat, lon) => {
  const body = JSON.stringify({
    coordinantes: {
      lon: lon,
      lat: lat,
      category: 0, //
    },
    use_radius: false,
  });
  const response = await fetch(SearchBrachesUrl + 20, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: body,
  });
  const result = await response.json();
  return result;
};

/*
*
food: [
    {category: 'הכל', bussinsess: []},
    {category: 'מסעדות', bussinsess: []},
  ],
  booking: [
    {category: 'הכל', bussinsess: []},
    {category: 'רופאה שלמה', bussinsess: []},
    {category: 'קוסמטיקה', bussinsess: []},
  ],
  tech: [],
*
*/
// category === 7 tech
// category === < 7 food
// category === > 7 booking

const set_businesses = (dispatch, rawData, autoSelectAddress = null) => {
  // const food = [{category: '-1', businesses: [], title: 'הכל'}];
  // const booking = [{category: '-1', businesses: [], title: 'הכל'}];
  // const tech = [];
  // // need to set into them
  // const categories = groupBy(rawData, item => item.category);
  // const sortedAllCategories = Object.keys(categories).map(key => ({
  //   title: categories[key][0].category_name,
  //   category: key,
  //   businesses: categories[key],
  // }));

  // for (let i = 0; i < sortedAllCategories.length; i++) {
  //   if (sortedAllCategories[i].category < 7) {
  //     food.push(sortedAllCategories[i]);
  //     for (let j = 0; j < sortedAllCategories[i].businesses.length; j++) {
  //       food[0].businesses.push(sortedAllCategories[i].businesses[j]);
  //     }
  //   } else if (sortedAllCategories[i].category > 7) {
  //     booking.push(sortedAllCategories[i]);
  //     for (let j = 0; j < sortedAllCategories[i].businesses.length; j++) {
  //       booking[0].businesses.push(sortedAllCategories[i].businesses[j]);
  //     }
  //   } else {
  //     for (let j = 0; j < sortedAllCategories[i].businesses.length; j++) {
  //       tech.push(sortedAllCategories[i].businesses[j]);
  //     }
  //   }
  // }

  const [food, booking, tech] = buildBusiness(rawData);
  // console.log('food', food);
  // console.log('cauclations done for businesses in home screen');
  dispatch({
    type: SET_BUSSNIESS,
    payload: {
      food: food,
      booking: booking,
      tech: tech,
      loading: false,
      selectedAddress: autoSelectAddress,
    },
  });
};

const buildBusiness = data => {
  const food = [{category: '-1', businesses: [], title: 'הכל'}];
  const booking = [{category: '-1', businesses: [], title: 'הכל'}];
  const tech = [];
  for (let i = 0; i < data.length; i++) {
    const business = data[i];
    if (business.category < 7) {
      //  food
      _addToCategory(food, business);
      // console.log('food', food);
    } else if (business.category > 7) {
      //  booking
      _addToCategory(booking, business);
    } else {
      if (business.isOpen === 'open') {
        tech.unshift(business);
      } else {
        tech.push(business);
      }
      // tech
    }
  }
  // console.log('food', food);
  return [food, booking, tech];
};

/**
 *
 * @param {[]} category
 * @param {{}} bussines
 */
const _addToCategory = (masterCategory, bussines) => {
  const indexCategory = getIndexCategory(masterCategory, bussines.category);
  if (indexCategory != -1) {
    // add to it
    if (bussines.isOpen === 'open' || bussines.isOpen === 'busy') {
      masterCategory[indexCategory].businesses.unshift(bussines);
      masterCategory[0].businesses.unshift(bussines);
      return;
    }
    masterCategory[indexCategory].businesses.push(bussines);
    masterCategory[0].businesses.push(bussines);
    return;
  }
  masterCategory.push({
    title: bussines.category_name,
    category: bussines.category,
    businesses: [bussines],
  });
  if (bussines.isOpen === 'open' || bussines.isOpen === 'busy') {
    masterCategory[0].businesses.unshift(bussines);
    return;
  }
  masterCategory[0].businesses.push(bussines);

  // create new one
};

const getIndexCategory = (list, category) => {
  for (let i = 0; i < list.length; i++) {
    if (list[i].category === category) {
      return i;
    }
  }
  return -1;
};
