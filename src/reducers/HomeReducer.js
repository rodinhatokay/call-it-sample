import React from 'react';
import {
  SET_OPACITY_HOME,
  SET_ADDRESS_OPTIONS_HOME,
  SET_SELECTED_ADDRES,
  UPDATE_FIELD_HOME,
  INIT_ADDRESS_OPTION_HOME,
  SET_HOME_LOADING,
  SET_BUSSNIESS,
  SET_ERRORLOADING_HOME,
} from '../actions/types';

const HOME = {
  sheetRef: React.createRef(null),
  opacity: 0,
  addresses: [
    {
      name: 'מיקום נוכחי',
      lat: 0,
      lon: 0,
      errorText: '',
      loading: false,
    },
  ],
  selectedAddress: 0,
  mainAddressIncluded: false,
  loading: false,
  errorLoading: false,
  food: [
    {category: 'הכל', bussinsess: [], title: 'הכל'},
    {category: 'מסעדות', bussinsess: [], title: 'מסעדות'},
  ],
  booking: [
    {category: 'הכל', bussinsess: [], title: 'הכל'},
    {category: 'רופאה שלמה', bussinsess: [], title: 'רופאה שלמה'},
    {category: 'קוסמטיקה', bussinsess: [], title: 'קוסמטיקה'},
  ],
  tech: [],
};

export default (state = HOME, action) => {
  switch (action.type) {
    //case SOMETIHNG:
    case INIT_ADDRESS_OPTION_HOME:
      // console.log('CALLED INIT ADDRESSES');
      return {...state, ...action.payload};
    case SET_HOME_LOADING:
      return {
        ...state,
        loading: action.payload,
        errorLoading: action.payload === true ? false : state.errorLoading,
      };
    case UPDATE_FIELD_HOME:
      return {...state, [action.payload.prop]: action.payload.value};
    case SET_OPACITY_HOME:
      return {...state, opacity: action.payload};
    case SET_ADDRESS_OPTIONS_HOME:
      return {...state, addresses: action.payload};
    case SET_SELECTED_ADDRES:
      return {...state, selectedAddress: action.payload};
    case SET_BUSSNIESS:
      if (action.payload.selectedAddress !== null) {
        return {...state, ...action.payload};
      }
      return {
        ...state,
        food: action.payload.food,
        booking: action.payload.booking,
        tech: action.payload.tech,
        loading: action.payload.loading,
      };
    case SET_ERRORLOADING_HOME:
      return {...state, errorLoading: action.payload, loading: false};
    default:
      return state;
  }
};
