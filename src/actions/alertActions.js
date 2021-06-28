import {DISMISS_ALERT, DISPLAY_ALERT} from './types';

/**content =  {
    header: 'מצטרים!',
    text: 'השעה שנבחרה לא זמינה יותר, אנא נסו שעה אחרת',
    btns: [
      {text: 'אישור', onPress: this.dismissAlert, color: '#3daccf'},
    ],
  }
  */
/**
 *
 * @param {*} content
 * @param {*} onDismiss
 * @returns
 */
export const display_alert = (content, dismissable = true) => {
  const {header, text, buttons} = content;
  // if (onDismiss) {
  return {
    type: DISPLAY_ALERT,
    payload: {dismissable, header, text, buttons, visible: true},
  };
  // }
  // return (dispatch) => {
  //   dispatch({
  //     type: DISPLAY_ALERT,
  //     payload: {
  //       header,
  //       dismissable,
  //       text,
  //       buttons: btns,
  //       onDismiss: dispatch({type: DISMISS_ALERT}),
  //     },
  //   });
  // };
};

export const dismiss_alert = () => ({type: DISMISS_ALERT});
