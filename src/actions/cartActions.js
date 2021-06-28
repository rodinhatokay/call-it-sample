import {
  goBack,
  navigate,
  nav_pop,
  nav_replace,
} from '../Routing/NavigationActions';
import {
  ADD_TO_CART,
  INCREASE_PRODUCT,
  REMOVE_FROM_CART,
  RESET_CART,
} from './types';
import {gui} from '.././util/Helper';
import {groupBy} from 'lodash';

// const INITIAL_STATE = {
//   show: false,
//   products: [],
//   counter: 0,
//   idBranch: null,
//   categoryBranch: 0,
//   gui: null,
// };

///////////////////// NOTE: TOTAL COST ONLY ADDS EXTRAS PRICE NOT QUANTITY

export const modify_product = product => {
  const [stringExtras, extrasPrice] = buildStringExtras(product.extras);
  product.extrasPrice = extrasPrice;
  product.totalPrice = product.price + extrasPrice;
  product.stringExtras = stringExtras;
};

//**called whenever added  to cart product/ modified existing product  */
export const add_to_cart = (
  cart,
  product,
  editing = null,
  editingIndex = null,
  nav = null,
) => {
  if (cart.counter === 0) {
    cart.idBranch = product.fkbranchS;
    cart.gui = gui();
    cart.counter = product.counter;
    modify_product(product);
    cart.products = [product];
    cart.show = true;
    cart.totalPrice = product.totalPrice * product.counter;
  } else {
    const index = checkIsProductAlreadyInCart(
      product,
      cart.products,
      editingIndex,
    );
    if (editing) {
      modify_product(product);
      const toAddToCounter =
        product.counter - cart.products[editingIndex].counter;
      const toAddPrice =
        product.totalPrice * product.counter -
        cart.products[editingIndex].totalPrice *
          cart.products[editingIndex].counter;
      ///
      cart.counter += toAddToCounter;
      cart.totalPrice += toAddPrice;
      if (index > -1) {
        //product like that already exist in tthe cart
        // if (index !== editingIndex) {
        cart.products[index].counter += product.counter;
        cart.products.splice(editingIndex, 1);
        // }
      } else {
        cart.products[editingIndex] = product;
      }
    } else {
      //adding new product
      if (index > -1) {
        //already exist in cart
        cart.counter += product.counter;
        modify_product(product);
        cart.products[index].counter += product.counter;
        cart.totalPrice += product.totalPrice * product.counter;
      } else {
        //product is not exist in the cart
        modify_product(product);
        cart.products = [...cart.products, product];
        cart.counter += product.counter;
        cart.totalPrice += product.totalPrice * product.counter;
      }
    }
  }
  if (nav) {
    nav === 'checkout' ? nav_replace('checkout') : goBack();
  }
  cart.products = [...cart.products];
  return {type: ADD_TO_CART, payload: cart};
};
export const increase_product = (products, product, index, priceCart) => {
  product.counter++;
  products[index] = {...product};
  // console.log('PRODUT:', products[index]);
  return {
    type: INCREASE_PRODUCT,
    payload: {
      products: [...products],
      totalPrice: (priceCart += product.totalPrice),
    },
  };
};

export const remove_from_cart = (cart, product, index, priceCart) => {
  const {products} = cart;

  if (cart.counter === 1 && cart.products[0].counter === 1) {
    nav_pop(1);
    return {type: RESET_CART};
  }
  if (product.counter > 1) {
    product.counter--;
  } else {
    products.splice(index, 1);
  }
  cart.counter--;
  priceCart -= product.totalPrice;
  //else remove the specific item
  return {
    type: REMOVE_FROM_CART,
    payload: {
      products: [...products],
      totalPrice: priceCart,
    },
  };
};


//each object in extras containes id, name ,category_name
export const buildStringExtras = extras => {
  let string = '';
  let extrasPrice = 0;
  const groupedExtras = groupBy(extras, item => item.category_name);
  for (const [key, value] of Object.entries(groupedExtras)) {
    string = string + key + ': ';
    for (let i = 0; i < value.length; i++) {
      extrasPrice += value[i].price;
      if (i === value.length - 1) {
        string = string + '' + value[i].name;
      } else {
        string = string + '' + value[i].name + ', ';
      }
    }
    string = `${string}\n`;
  }
  return [string.trim(), extrasPrice];
};

const extrasMatching = (extras1, extras2) => {
  if (extras1.length !== extras2.length) return false;
  for (let i = 0; i < extras1.length; i++) {
    if (extras1[i].id !== extras2[i].id) return false;
  }
  return true;
};

const checkIsProductAlreadyInCart = (product, products, editingIndex = -1) => {
  for (let i = 0; i < products.length; i++) {
    if (
      product.idservice === products[i].idservice &&
      extrasMatching(product.extras, products[i].extras)
    ) {
      if (editingIndex !== -1 && i === editingIndex) continue;
      return i;
    }
  }
  return -1;
};
