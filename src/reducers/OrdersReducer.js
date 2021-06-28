import {
  GET_ORDERS,
  SET_LOADING_ORDERS,
  SET_LOADING_ACTIVE_ORDERS,
  SET_LOADING_HISTORY_ORDERS,
  SET_ORDERS_ACTIVE,
  SET_ORDERS_HISTORY,
} from '../actions/types';

const INITAL_STATE = {
  activeOrders: [],
  historyOrders: [],
  loadingActiveOrders: false,
  loadingHistoryOrders: false,
};

export default (state = INITAL_STATE, action) => {
  switch (action.type) {
    case SET_LOADING_ORDERS:
      return {
        ...state,
        loadingActiveOrders: action.payload,
        loadingHistoryOrders: action.payload,
      };
    case GET_ORDERS:
      return {
        ...state,
        loadingActiveOrders: false,
        loadingHistoryOrders: false,
        historyOrders: action.payload.historyOrders,
        activeOrders: action.payload.activeOrders,
      };
    case SET_LOADING_ACTIVE_ORDERS:
      return {
        ...state,
        loadingActiveOrders: action.payload,
      };
    case SET_LOADING_HISTORY_ORDERS:
      return {...state, loadingHistoryOrders: action.payload};
    case SET_ORDERS_ACTIVE:
      return {
        ...state,
        loadingActiveOrders: false,
        activeOrders: action.payload,
      };
    case SET_ORDERS_HISTORY:
      return {
        ...state,
        loadingHistoryOrders: false,
        historyOrders: action.payload,
      };
    default:
      return state;
  }
};
