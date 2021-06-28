// import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';
import {PermissionsAndroid} from 'react-native';
import {AutoCompleteCities, TOSURL, VisaCardImage} from './Pref';

export const storeData = async (key, value) => {
  const jsonValue = JSON.stringify(value);
  // console.log('STORING:', value);
  await EncryptedStorage.setItem(key, jsonValue);
};

export const getData = async key => {
  try {
    const jsonValue = await EncryptedStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    return null;
  }
};

export const requestPremissons = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
};

export const tosRequest = async token => {
  const body = JSON.stringify({
    version: 'ver1',
  });
  const resp = await fetch(TOSURL, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },

    body: body,
  });
  // console.log('REESP', resp);
  const result = await resp.json();
  console.log('RESULTTTY', result);
  return result;
};

export const withoutnumberReg =
  /^[a-zA-Z\u05D0-\u05EA\u0621-\u064A'‘’`,.*\s]*$/;
export const withnumberAddReg =
  /^[ a-zA-Z0-9\u05D0-\u05EA\u0621-\u064A\u0660-\u0669'‘’`,.\s]*$/;

/**
 *
 * @param {text to auto complete} text
 * @param {para => that gets array and set data}
 * @param {*} token
 */
export const autoCompleteCities = (text, setCities, token) => {
  if (text === '') return [];
  fetch(AutoCompleteCities, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      input: text,
    }),
  })
    .then(response => {
      return response.json();
    })
    .then(cities => {
      setCities(cities);
    })
    .catch(error => {
      throw error;
    });
};

/**
 *
 * @param {string}  city
 * if city exists it return the city else null
 */
export const isCityExist = async (city, token) => {
  const response = await fetch(AutoCompleteCities, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      input: city,
    }),
  });
  const cities = await response.json();
  if (Array.isArray(cities)) {
    for (let i = 0; i < cities.length; i++) {
      if (cities[i].name === city) {
        return cities[i];
      }
    }
    return null;
  }
};

export const gui = () => {
  var chars = '0123456789abcdef'.split('');
  var uuid = [],
    rnd = Math.random,
    r;
  uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
  uuid[14] = '4';
  for (var i = 0; i < 36; i++) {
    if (!uuid[i]) {
      r = 0 | (rnd() * 16);
      uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r & 0xf];
    }
  }
  return uuid.join('');
};

export const is_user_address_included = addresses => {
  for (let i = 0; i < addresses.length; i++) {
    if (addresses[i].mainAddress) {
      return [addresses[i], i];
    }
  }
  return null;
};

export const networkHelperTokenPost = (
  url,
  jsonData,
  method,
  token,
  callback = responseJson => {},
  errorCallback = error => {},
) => {
  // console.log('CALLED: ', url);
  // console.log('METOD:', method);
  fetch(url, {
    method: method,
    headers: {
      Authorization: 'Bearer ' + token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },

    body: jsonData,
  })
    .then(response => {
      return response.json();
    })
    .then(responseJson => {
      callback(responseJson);
    })
    .catch(error => {
      // console.log('HEY', error);
      errorCallback(error);
    });
};

export const networkHelperToken = (
  url,
  method,
  token,
  callback = responseJson => {},
  errorCallback = error => {},
) => {
  fetch(url, {
    method: method,
    headers: {
      Authorization: 'Bearer ' + token,
    },
  })
    .then(response => {
      return response.json();
    })
    .then(responseJson => {
      callback(responseJson);
    })
    .catch(error => {
      errorCallback(error);
    });
};

export const cc_image_link = cardnumber => {
  let creditCardImage = `${VisaCardImage}card.png`;
  if (cardnumber !== undefined && cardnumber !== '' && cardnumber.length > 0) {
    if (cardnumber.length === 8 || cardnumber.length === 9) {
      creditCardImage = `${VisaCardImage}isracart.png`;
    } else {
      const sp = cardnumber.substr(0, 2);
      if (sp === '30' || sp === '36' || sp === '38') {
        creditCardImage = `${VisaCardImage}DINERS.png`;
      } else if (sp === '37' || sp === '34') {
        creditCardImage = `${VisaCardImage}AMEX.png`;
      } else if (
        sp === '51' ||
        sp === '52' ||
        sp === '53' ||
        sp === '54' ||
        sp === '55'
      ) {
        creditCardImage = `${VisaCardImage}MASTERCARD.png`;
      } else {
        const sp = cardnumber.substr(0, 1);
        if (sp === '4') {
          creditCardImage = `${VisaCardImage}VISA.png`;
        }
      }
    }
  }
  return creditCardImage;
};

export const checkImageURL = async url => {
  try {
    const res = await fetch(url);
    if (res.status === 200) {
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
};
