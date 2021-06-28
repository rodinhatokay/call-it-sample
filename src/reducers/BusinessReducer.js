import {
  INIT_BUSINESS,
  SET_LOADING_PRODUCTS,
  SET_PRODUCTS,
  SET_IMAGES,
  SET_EXPANDED_CATEGORIES,
  SET_INDEX_IMAGE,
  SET_IMAGE_VIEW,
  SET_REFRESHING_BUSINESS,
} from '../actions/types';

const INITIAL_STATE = {
  address: '',
  rating: 0,
  ratingCount: 0,
  phone: '',
  name: '',
  lat: 0,
  lon: 0,
  isOpen: '',
  message: '',
  products: [],
  expandedCategories: [],
  images: [],

  openingHourToday: '',
  businessHours: '',
  idBranch: null,
  idBusiness: null,
  imageUrl: null,
  category: -1,
  loading_produts: true,
  loading_images: true,
  images_view: [], // image_view
  showImages_view: false, // image_view
  indexImage_Show: 0,
  refreshing: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case INIT_BUSINESS:
      return {...state, ...action.payload};
    case SET_PRODUCTS:
      return {
        ...state,
        products: action.payload.products,
        expandedCategories: action.payload.expandedCategories,
        loading_products: false,
      };
    case SET_IMAGES:
      return {
        ...state,
        images: action.payload.images,
        images_view: action.payload.images_view,
        loading_images: false,
      };
    case SET_LOADING_PRODUCTS:
      return {
        ...state,
        loading_products: action.payload,
        loading_images: action.payload,
      };
    case SET_EXPANDED_CATEGORIES:
      return {
        ...state,
        expandedCategories: action.payload,
      };
    case SET_INDEX_IMAGE:
      return {
        ...state,
        indexImage_Show: action.payload,
        showImages_view: true,
      };
    case SET_IMAGE_VIEW:
      return {
        ...state,
        showImages_view: action.payload,
      };
    case SET_REFRESHING_BUSINESS:
      return {...state, refreshing: action.payload};
    default:
      return state;
  }
};
