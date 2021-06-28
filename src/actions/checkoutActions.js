import {getData, is_user_address_included, storeData} from '../util/Helper';
import {
  BranchStatusUrl,
  BusinessBranchDetailUrl,
  GetDeliveryPricesUrl,
  keyStorage,
  PostOrderUrl,
  UserDetails,
} from '../util/Pref';
import {
  SET_ADDRESS_CHECKOUT,
  INIT_CHECKOUT,
  SET_ADDRESS_CITY_CHECKOUT,
  SET_DELIVERY,
  SET_LOADING_SCREEN_CHECKOUT,
  SET_PICKUP,
  SET_DATA_ADDRESS_CHECKOUT,
  SET_DELIVERIES_CHECKOUT,
  SET_REF_LIST_CHECKOUT,
  DISPLAY_ALERT,
  SET_LOADING_ORDER_CHECKOUT,
  RESET_CART,
  RESET_CHECKOUT,
  DISMISS_ALERT,
  SET_PAYMENT_METHOD_VISA,
  SET_CASH,
  SET_VISA_INDEX_CHECKOUT,
  SET_CREDIT_CARDS,
  SET_ORDER,
} from './types';
import momenttz from 'moment-timezone';
import {navigate, pop_to_top} from '../Routing/NavigationActions';
import {handle_orders} from './ordersActions';

//**for types */
import {CART} from '../reducers/CartReducer';
import {CHECKOUT} from '../reducers/CheckoutReducer';
import {
  buildUrlForPayment,
  cancelVisaPayment,
  get_sessionIdCC,
} from '../util/Helpers/CreditCard';
import xml2js from 'xml2js';

const ERROR_NO_DELIVERY = 'אין משלוחים לעיר שהזנת';

// const INITIAL_STATE = {
//   //pickup
//   hasPickup: false,
//   pickUpSelected: false,
//   ///deliveries
//   hasDelivery: false,
//   deliverySelected: true,
//   freeDeliveryCap: 0,
//   deliveries: [],
//   displayDeliveries:[],
//   deliveryPrice:0,
//   ///address
//   address: '',
//   addressCity: '',
//   mainAddress: 'unchecked',
//   lat,lon
//   //loading
//   loadingScreen: false,
//   loadingOrder:false,
//   //payment
//   terminalNumber: '',
//   cashSelected: false,
//   visaSeleceted: false,
//   visaAvailable: false,
//   listRef:false,
// };

// need to take care of deliveries
export const init_checkout = (token, idBranch) => {
  
};

export const set_loading_screen_checkout = isLoading => {
  return {type: SET_LOADING_SCREEN_CHECKOUT, payload: isLoading};
};

export const set_visa_index_checkout = index => {
  return {type: SET_VISA_INDEX_CHECKOUT, payload: index};
};

export const set_delivery = listRef => {
  // listRef.scrollToEnd();
  return {type: SET_DELIVERY};
};

export const set_ref_list_checkout = ref => {
  return {type: SET_REF_LIST_CHECKOUT, payload: ref};
};

export const set_pickup = () => {
  return {type: SET_PICKUP};
};

export const set_payment_method_cash = () => {
  return {type: SET_CASH};
};

export const set_payment_method_visa = listRef => {
  return {type: SET_PAYMENT_METHOD_VISA};
};

// {"idcities": 2173, "lat": 32.7216, "lon": 35.4400558, "mainAddress": true, "name": "כפר כמא, כפר כמא"}
export const set_main_address_checkout = (addresses, deliveries) => {
  const [mainAddress, index] = is_user_address_included(addresses);
  if (mainAddress) {
    const [address, city] = mainAddress.name.split(', ');
    const filterd = deliveries.filter(item => item.cityName === city);
    let isDeliveredToMainAddress = false;
    if (filterd.length === 1) {
      isDeliveredToMainAddress = true;
    }
    return {
      type: SET_DATA_ADDRESS_CHECKOUT,
      payload: {
        address,
        addressCity: city,
        mainAddress: 'checked',
        lat: isDeliveredToMainAddress ? filterd[0].delivery.lat : 0,
        lon: isDeliveredToMainAddress ? filterd[0].delivery.lon : 0,
        minimumDelivery: isDeliveredToMainAddress
          ? filterd[0].delivery.minimumDelivery
          : -100,
        deliveryPrice: isDeliveredToMainAddress ? filterd[0].delivery.price : 0,
        errorAddress: isDeliveredToMainAddress
          ? ''
          : ERROR_NO_DELIVERY + ' - ' + city,
      },
    };
  }
  return {type: 'null'};
};

export const set_address_text_checkout = text => {
  return {type: SET_ADDRESS_CHECKOUT, payload: text};
};

//   {
//     "cityName":"כפר כמא",
//     "delivery":{
//        "branchfk":10,
//        "branchfkNavigation":null,
//        "deliveryRegisteritem":null,
//        "iddeliveryPrice":71,
//        "lat":32.7216,
//        "lon":35.4400558,
//        "minimumDelivery":-100,
//        "price":10
//     }
//  }
export const set_address_city_text_checkout = (city, deliveries) => {
  // maybe scroll to end?
  const deliveriesModified = deliveries.filter(delivery =>
    delivery.cityName.includes(city),
  );

  const displayDeliveries = deliveriesModified.slice(0, 5);
  let errorText =
    city !== '' && displayDeliveries.length === 0
      ? ERROR_NO_DELIVERY + ' - ' + city
      : '';
  // console.log('displayDeliveries', displayDeliveries);
  return dispatch => {
    if (
      displayDeliveries.length === 1 &&
      displayDeliveries[0].cityName.trim() === city.trim()
    ) {
      //auto select this one.
      dispatch({
        type: SET_ADDRESS_CITY_CHECKOUT,
        payload: {
          displayDeliveries: [],
          addressCity: city,
          errorAddress: errorText,
          lat: displayDeliveries[0].delivery.lat,
          lon: displayDeliveries[0].delivery.lon,
          minimumDelivery: displayDeliveries[0].delivery.minimumDelivery,
          deliveryPrice: displayDeliveries[0].delivery.price,
          mainAddress: 'unchecked',
        },
      });
    } else {
      dispatch({
        type: SET_ADDRESS_CITY_CHECKOUT,
        payload: {
          displayDeliveries: city === '' ? [] : displayDeliveries,
          addressCity: city,
          errorAddress: errorText,
          lat: 0,
          lon: 0,
          minimumDelivery: -100,
          deliveryPrice: 0,
          mainAddress: 'unchecked',
        },
      });
    }
  };
};

export const select_delivery = item => {
  // console.log(item.cityName, typeof item.cityName);
  return {
    type: SET_ADDRESS_CITY_CHECKOUT,
    payload: {
      displayDeliveries: [],
      addressCity: item.cityName,
      errorAddress: '',
      lat: item.delivery.lat,
      lon: item.delivery.lon,
      minimumDelivery: item.delivery.minimumDelivery,
      deliveryPrice: item.delivery.price,
    },
  };
};

const has_delivery = async (dispatch, token, idBranch) => {
  // [
  //   {
  //     cityName: 'כפר כמא',
  //     delivery: {
  //       branchfk: 10,
  //       branchfkNavigation: null,
  //       deliveryRegisteritem: null,
  //       iddeliveryPrice: 71,
  //       lat: 32.7216,
  //       lon: 35.4400558,
  //       minimumDelivery: -100,
  //       price: 10,
  //     },
  //   },
  // ];
  const header = {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token,
    },
  };
  const resp = await fetch(GetDeliveryPricesUrl + idBranch, header);
  const result = await resp.json();
  // console.log('RESULT', result);
  if (Array.isArray(result) && result.length > 0) {
    dispatch({type: SET_DELIVERIES_CHECKOUT, payload: result});
    return true;
  }
  return false;
};

const get_branch_data = async (token, idBranch) => {
  const header = {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token,
    },
  };
  const resp = await fetch(BusinessBranchDetailUrl + idBranch, header);
  const result = await resp.json();
  // console.log('RESULT', result);
  const {freeDelivery, haspickup, terminalNumber} = result.branch;
  return {freeDelivery, haspickup, terminalNumber};
};

const getTextErrorAddressAlert = address => {
  if (address === '') {
    return 'נא להזין כתובת';
  }
  return 'נא להזין עיר תקינה';
};

// const checkMinDelivery = checkout => {
//   console.log('CHeckoiut', checkout);
//   return false;
// };

/**
 * functions that verifies you can post order if not displays alert with info and returns false
 * @param {*} dispatch
 * @param {CART} cart
 * @param {CHECKOUT} checkout
 * @param {[]} creditCards
 * @returns {boolean} - returns true if can procced to post else false
 */
const isPostingOrderGood = (dispatch, cart, checkout, creditCards) => {
  if (!isDeliveryOk(dispatch, cart, checkout)) return false;
  if (!isCreditCardOk(dispatch, cart, checkout, creditCards)) return false;
  return true;
};

/**
 *
 * @param {*} dispatch
 * @param {CART} cart
 * @param {CHECKOUT} checkout
 * @param {[]} creditCards
 */
const isCreditCardOk = (dispatch, cart, checkout, creditCards) => {
  if (!checkout.visaSelected) return true;
  if (creditCards.length === 0) {
    set_alert_with_accept_btn(
      dispatch,
      'יש להוסיף קודם כרטיס אשראי על מנת להזמין דרך כרטיס אשראי',
    );
    return false;
  } else {
    console.log('index', checkout.visaIndex);
    const index = checkout.visaIndex;
    if (index > checkout.length || index < 0) {
      set_alert_with_accept_btn(
        dispatch,
        'נא לבחור כרטיס אשראי שבאמצעותו לשלם',
      );
      return false;
    }
  }
  return true;
};

const isDeliveryOk = (dispatch, cart, checkout) => {
  if (!checkout.deliverySelected) return true;
  if (
    checkout.errorAddress !== '' ||
    checkout.address === '' ||
    checkout.lat === 0 ||
    checkout.lon === 0
  ) {
    const text = getTextErrorAddressAlert(checkout.address);
    set_alert_with_accept_btn(dispatch, text);
    return false;
  }
  if (!checkMinDelivery(dispatch, cart.totalPrice, checkout.minimumDelivery)) {
    return false;
  }
  return true;
};

const set_alert_with_accept_btn = (dispatch, text) => {
  const buttons = [{text: 'אישור', color: '#3daccf'}];
  dispatch({
    type: DISPLAY_ALERT,
    payload: {
      dismissable: true,
      header: '',
      text,
      buttons,
      visible: true,
    },
  });
};

const checkMinDelivery = (dispatch, cartTotalPrice, minimumDelivery) => {
  if (cartTotalPrice < minimumDelivery) {
    set_alert_with_accept_btn(
      dispatch,
      `בית העסק מאפשר משלוחים לעיר שבחרת רק בקנייה מעל-${minimumDelivery} ש''ח`,
    );
    return false;
  }
  return true;
};

/**
 *
 * @param {CHECKOUT} checkout
 * @param {CART} cart
 * @param {boolean} asAgorot - return price as agorot if true else shekels
 * @returns {number}
 */
const getTotalCost = (checkout, cart, asAgorot = false) => {
  const delivery = !checkout.deliverySelected
    ? 0
    : checkout.freeDeliveryCap <= cart.totalPrice
    ? 0
    : checkout.deliveryPrice;
  const totalPrice = delivery + cart.totalPrice;
  if (asAgorot) {
    if (totalPrice.toString().includes('.')) {
      EXAMPLEEEE;
      return totalPrice.toString().replace('.', '');
    }
    return `${totalPrice.toString()}00`;
  }
  return totalPrice;
};

/**
 *
 * @param {CART} cart -
 * @param {CHECKOUT} checkout
 * @param {String} token
 * @returns
 */
export const post_order = (cart, checkout, creditCards, token) => {
  return async dispatch => {
    dispatch({type: SET_LOADING_ORDER_CHECKOUT, payload: true});
    if (!isPostingOrderGood(dispatch, cart, checkout, creditCards)) {
      dispatch({type: SET_LOADING_ORDER_CHECKOUT, payload: false});
      return;
    }
    try {
      const isOpen = await statusBisuness(dispatch, token, cart.idBranch);
      console.log('isOpen', isOpen);
      if (!isOpen) return;
      const user_details = await get_user_data(token);
      const orderDate = momenttz
        .tz('Asia/Jerusalem')
        .format('YYYY/MM/DD HH:mm');
      // console.log('user_details', user_details);
      let cc_info = null;
      if (checkout.visaSelected) {
        // pay via visa
        const creditCard = creditCards[checkout.visaIndex];
        const totalPrice = getTotalCost(checkout, cart, true);
        const resultVisa = await visaPayment(
          creditCard,
          totalPrice,
          orderDate,
          checkout.terminalNumber,
          checkout.ccSessionId,
        );
        if (typeof resultVisa === 'string') {
          // cancel order here
          set_alert_with_accept_btn(dispatch, resultVisa);
          dispatch({type: SET_LOADING_ORDER_CHECKOUT, payload: false});
          return;
        } else {
          cc_info = resultVisa;
          saveCCOnPhone(
            dispatch,
            resultVisa.cardId,
            creditCard,
            creditCards,
            checkout.visaIndex,
          );
        }
      }
      const body = buildBody(cart, checkout, user_details, orderDate, cc_info);
      await send_order_to_server(
        dispatch,
        token,
        body,
        checkout.visaSelected
          ? {
              terminalNumber: checkout.terminalNumber,
              cgUid: cc_info.cgUid,
              sessionId: checkout.sessionId,
            }
          : null,
      );
    } catch (e) {
      console.log('error: in posting order', e);
      set_alert_with_accept_btn(
        dispatch,
        'הייתה שגיאה בהזמנה אנא נסו שוב מאוחר יותר',
      );
      dispatch({type: SET_LOADING_ORDER_CHECKOUT, payload: false});
    }
  };
};

const visaPayment = async (
  creditCard,
  totalPrice,
  orderDate,
  terminalNumber,
  ccSessionId,
) => {
  // console.log('creditmcard', creditCard);
  try {
    const cg_url_payment = buildUrlForPayment(
      creditCard,
      terminalNumber,
      orderDate,
      totalPrice,
      ccSessionId,
    );
    const resp = await fetch(cg_url_payment, {
      method: 'POST',
    });
    const rawResultCG = await resp.text();
    const result = await xml2js.parseStringPromise(rawResultCG, {
      explicitArray: false,
    });
    const {response} = result.ashrait;
    const {message, doDeal, additionalInfo} = response;
    // console.log('response from credit guard', responrse);
    if (!additionalInfo.toString().includes('SUCCESS')) {
      // inavlid credit card Display Alert
      return 'פרטי כרטיס האשראי אינם תקינים';
    }
    const {
      cardId,
      cgUid,
      fileNumber,
      slaveTerminalNumber,
      slaveTerminalSequence,
    } = doDeal;
    const shovar = `${fileNumber}${slaveTerminalNumber}${slaveTerminalSequence}`;
    return {cardId, shovar, cgUid};
  } catch (error) {
    console.log('error in sending cg payment', error);
    return 'הייתה שגיאה אנא נסו שוב מאוחר יותר';
  }
};

// const creditCard = {
//   cc_number: number.text.replace(/ /g, ''),
//   cc_cvv: cvv.text,
//   cc_expireDate: expireDate.text,
//   last4digits: number.text.slice(-4),
//   saveOnPhone: saveCC,
//   imageLink: imagelink,
// };

/**
 *
 * @param {() => } dispatch
 * @param {string} cardID
 * @param {{cc_number,cc_cvv, cc_expireDate, last4digits,saveOnPhone,imageLink }} creditCard
 * @param {[]} creditCards
 */
const saveCCOnPhone = async (
  dispatch,
  cardID,
  creditCard,
  creditCards,
  indexVisa,
) => {
  // need to implement storing on phone the credit card.
  if (!creditCard.saveOnPhone) return;
  const newCreditCards = [...creditCards];
  newCreditCards[indexVisa] = {
    last4digits: creditCard.last4digits,
    cc_expireDate: creditCard.cc_expireDate,
    cardId: cardID,
    imageLink: creditCard.imageLink,
  };
  try {
    getData(keyStorage).then(storedData => {
      storedData.creditCards = newCreditCards;
      storeData(keyStorage, storedData);
    });
  } catch (e) {
    console.log('error storing credit card', e);
  } finally {
    dispatch({type: SET_CREDIT_CARDS, payload: newCreditCards});
  }
  // storeData()
};


const api_call_posting_order = async (token, body) => {
  const bodyAsJson = JSON.stringify(body);
  // console.log('token', token);l
  let status = -1;
  try {
    const header = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },

      body: bodyAsJson,
    };
    // console.log('post', PostOrderUrl);
    const response = await fetch(PostOrderUrl, header);
    status = response.status;
    if (!response.ok) throw {error: 'resp is not ok', status: response.status};
    return await response.json();
    // return result;
  } catch (e) {
    console.log('error posting order:', e);
    throw {error: e, status: status};
  }
};

const statusBisuness = async (dispatch, token, idBranch) => {
  try {
    const header = {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    const res = await fetch(BranchStatusUrl + idBranch, header);
    const result = await res.json();
    if (result !== 'open') {
      //stop loading
      const text =
        result === 'busy'
          ? 'לא ניתן להזמין כעת מפני שהעסק עמוס אנא נסו מאחור יותר...'
          : 'לא ניתן להזמין כעת מפני שהעסק סגור נסו מאוחר יותר...';

      const buttons = [{text: 'אישור', color: '#3daccf'}];
      dispatch({type: SET_LOADING_ORDER_CHECKOUT, payload: false});
      dispatch({
        type: DISPLAY_ALERT,
        payload: {dismissable: true, header: '', text, buttons, visible: true},
      });
    }
    return result === 'open' ? true : false;
  } catch (e) {
    throw {error: e, customMsg: 'init_posting'};
  }
};

const get_user_data = async token => {
  try {
    const header = {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    const response = await fetch(UserDetails, header);
    const result = await response.json();
    return {idcustomer: result.idcustomer, phone: result.phone};
  } catch (e) {
    throw {error: e, customMsg: 'init_posting'};
  }
};

const buildExtras = extras => {
  const newExtras = [];
  for (let i = 0; i < extras.length; i++) {
    const extra = extras[i];
    newExtras.push({
      catType: extra.catType,
      id: extra.id,
      category: extra.category_name,
      name: extra.name,
      imageNum: extra.imageNum,
    });
  }
  return newExtras;
};

// const resultVisa: {
//   cardId: any;
//   shovar: string;
//   cgUid: any;
// }
const cc_info_for_body = cc_info => {
  if (cc_info) {
    return {cgUid: cc_info.cgUid, shovar: cc_info.shovar, paid: true};
  }
  return {cgUid: '', shovar: '', paid: false};
};

