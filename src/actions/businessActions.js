import {groupBy} from 'lodash';
import {getToday, parsetime} from '../util/Helpers/Dates';
import {getHeaderForFetch} from '../util/Helpers/fetchHelpers';
import {
  BASEURL,
  BranchAllServiceUrl,
  BusinessBranchDetailUrl,
  BusinessBranchUrl,
} from '../util/Pref';
import {
  INIT_BUSINESS,
  SET_EXPANDED_CATEGORIES,
  SET_IMAGES,
  SET_IMAGE_VIEW,
  SET_INDEX_IMAGE,
  SET_LOADING_PRODUCTS,
  SET_PRODUCTS,
  SET_REFRESHING_BUSINESS,
} from './types';

export const init_business = business => {
  const {
    isOpen,
    imageurl,
    address,
    idbranch,
    category,
    message,
    fkbusiness,
    lat,
    phone,
    rating,
    ratingcount,
    lon,
    name,
  } = business;
  const openingHourToday = parsetime(business.businessHours, false, getToday());
  const businessHours = parsetime(business.businessHours, true);
  const newBusiness = {
    name,
    address,
    isOpen,
    idBranch: idbranch,
    imageUrl: imageurl,
    idBusiness: fkbusiness,
    category,
    message,
    lat,
    phone,
    rating,
    ratingCount: ratingcount,
    lon,
    products: [],
    images: [],
    images_view: [],
    showImage_view: false,

    businessHours,
    openingHourToday,
  };
  return dispatch => {
    dispatch({type: INIT_BUSINESS, payload: newBusiness});
  };
};

export const setProducts = (token, idBranch) => {
  return dispatch => {
    setProductsAndImages(dispatch, token, idBranch);
  };
};

export const set_refreshing_business = payload => {
  return {type: SET_REFRESHING_BUSINESS, payload: payload};
};

export const refresh_business = (token, idBranch) => {
  // console.log('wat');
  return async dispatch => {
    // console.log('working');
    try {
      dispatch({type: SET_LOADING_PRODUCTS, payload: true});
      dispatch({type: SET_REFRESHING_BUSINESS, payload: true});
      const businessData = await get_branch_data(token, idBranch);

      dispatch({type: INIT_BUSINESS, payload: businessData});
      setProductsAndImages(dispatch, token, idBranch);
    } catch (e) {
      console.log('error', e);
      dispatch({type: SET_LOADING_PRODUCTS, payload: false});
      dispatch({type: SET_REFRESHING_BUSINESS, payload: false});
    }
    // console.log('dispatched');
  };
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
  // console.log('RESULKT', result);

  const {branch} = result;
  const {fkbusiness} = branch;

  const openingHourToday = parsetime(branch.businessHours, false, getToday());
  const businessHours = parsetime(branch.businessHours, true);
  const data = {
    name: branch.name,
    address: branch.address,
    isOpen: branch.isOpen,
    idBranch: branch.idbranch,
    imageUrl: result.imageUrl,
    idBusiness: branch.fkbusiness,
    // category: branch.category,
    message: branch.message,
    lat: branch.lat,
    phone: branch.phone,
    rating: branch.rating,
    ratingCount: branch.ratingcount,
    lon: branch.lon,
    // products: [],
    // images: [],
    // images_view: [],
    showImage_view: false,
    refreshing: false,
    businessHours,
    openingHourToday,
  };
  return await _fill_data_category_imageurl(fkbusiness, token, data);
};

const _fill_data_category_imageurl = async (
  fkbusiness,
  token,
  branchDetails,
) => {
  const header = {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token,
    },
  };
  const response = await fetch(BusinessBranchUrl + fkbusiness, header);
  const result = await response.json();
  return {
    ...branchDetails,
    category: result.business.category,
    // imageurl: branchDetails.imageUrl,
    description: result.business.description,
  };
};

const setProductsAndImages = async (dispatch, token, idBranch) => {
  dispatch({type: SET_LOADING_PRODUCTS, payload: true});
  const products = await fetch_Products(token, idBranch);
  // console.log('Hey:', products);
  if (products !== []) {
    const expandedCategories = Array(products.length).fill(true);
    dispatch({type: SET_PRODUCTS, payload: {products, expandedCategories}});
    // console.log('PRODUTS:', products);
    // console.log('EXPANDED CAT:', expandedCategories);
    set_images(dispatch, products);
  }
};

const fetch_Products = async (token, idBranch) => {
  try {
    const response = await fetch(
      BranchAllServiceUrl + idBranch,
      getHeaderForFetch(token),
    );
    const result = await response.json();
    // console.log('RESULT:', result);
    if (result) {
      const groupedCategortes = groupBy(result, data => {
        if (data.category !== '') return data.category;
      });
      const products = Object.keys(groupedCategortes).map(key => ({
        cat: key,
        data: groupedCategortes[key],
      }));
      return products;
    }
    return [];
  } catch (e) {
    console.log('ERROR IN FETCHING PRODTUCS:', e);
    return [];
  }
};

/**
 *
 * @param {Function} dispatch
 * @param {[{cat:string,data:[]}]} products
 * @returns {[]} images
 */
const set_images = async (dispatch, products) => {
  const images = [];
  const images_view = [];
  for (let i = 0; i < products.length; i++) {
    for (let j = 0; j < products[i].data.length; j++) {
      const product = products[i].data[j];
      const uri = `${BASEURL}${product.imageUrl}`;
      if (uri) {
        if (images.find(item => item.uri === uri)) continue; // checks if image already in set included
        const isPic = await checkImageURL(uri);
        if (isPic) {
          images.push({uri: uri});
          images_view.push({url: uri});
        }
      }
    }
  }
  dispatch({type: SET_IMAGES, payload: {images, images_view}});
};

const checkImageURL = async url => {
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

export const handlePressAccordion = (index, expandedCategories) => {
  const newExpandedCats = [...expandedCategories];
  newExpandedCats[index] = !expandedCategories[index];
  return {type: SET_EXPANDED_CATEGORIES, payload: newExpandedCats};
};

export const handleImage_view = isShow => {
  return {type: SET_IMAGE_VIEW, payload: isShow};
};

export const set_image_view_index = index => {
  return {type: SET_INDEX_IMAGE, payload: index};
};
