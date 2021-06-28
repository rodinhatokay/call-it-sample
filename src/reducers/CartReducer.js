import {
  ADD_TO_CART,
  INCREASE_PRODUCT,
  REMOVE_FROM_CART,
  RESET_CART,
} from '../actions/types';

export const CART = {
  show: false,
  products: [],
  counter: 0,
  idBranch: null,
  // categoryBranch: 0, i dont think is this is needed
  gui: null,
  totalPrice: 0,
};

export default (state = CART, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      return {...action.payload};
    case REMOVE_FROM_CART:
      return {
        ...state,
        products: action.payload.products,
        totalPrice: action.payload.totalPrice,
        // counter: action.payload.length,
      };
    case INCREASE_PRODUCT:
      const {counter} = state;
      // const newState = {
      //   ...state,
      //   products: action.payload,
      //   counter: counter + 1,
      // };

      return {
        ...state,
        products: action.payload.products,
        totalPrice: action.payload.totalPrice,
        counter: counter + 1,
      };
    // return {...newState};
    case RESET_CART:
      return {
        show: false,
        products: [],
        counter: 0,
        idBranch: null,
        gui: null,
        totalPrice: 0,
      };
    default:
      return state;
  }
};
