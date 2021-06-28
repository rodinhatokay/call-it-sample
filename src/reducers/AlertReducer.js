import {DISMISS_ALERT, DISPLAY_ALERT} from '../actions/types';

const INITIAL_STATE = {
  dismissable: true,
  header: '',
  text: '',
  visible: false,
  buttons: [],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case DISPLAY_ALERT:
      return {...state, ...action.payload};
    case DISMISS_ALERT:
      return {...state, visible: false};
    default:
      return state;
  }
};
