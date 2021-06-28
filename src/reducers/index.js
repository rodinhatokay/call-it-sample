import {combineReducers} from 'redux';
import AuthReducer from './AuthReducer';
import User from './UserReducer';
import Home from './HomeReducer';
import Business from './BusinessReducer';
import AlertReducer from './AlertReducer';
import CartReducer from './CartReducer';
import CheckoutReducer from './CheckoutReducer';
import OrdersReducer from './OrdersReducer';
import OrderReducer from './OrderReducer';

export default combineReducers({
  auth: AuthReducer,
  user: User,
  home: Home,
  business: Business,
  alert: AlertReducer,
  cart: CartReducer,
  checkout: CheckoutReducer,
  orders: OrdersReducer,
  order: OrderReducer,
});
