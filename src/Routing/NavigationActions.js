import * as React from 'react';
import {StackActions} from '@react-navigation/native';

export const isReadyRef = React.createRef();

export const navigationRef = React.createRef();

export function navigate(name, params) {
  if (isReadyRef.current && navigationRef.current) {
    // Perform navigation if the app has mounted
    navigationRef.current.navigate(name, params);
  }
}

export function goBack() {
  if (isReadyRef && navigationRef.current) {
    navigationRef.current.goBack();
  }
}

export function nav_pop(amount = 1) {
  if (isReadyRef.current && navigationRef.current) {
    const popAction = StackActions.pop(amount);
    navigationRef.current.dispatch(popAction);
  }
}

export function nav_replace(name) {
  if (isReadyRef.current && navigationRef.current) {
    const replaceAction = StackActions.replace(name);
    navigationRef.current.dispatch(replaceAction);
  }
}

export function pop_to_top() {
  if (isReadyRef.current && navigationRef.current) {
    const popToTopAction = StackActions.popToTop();
    // console.log('called pop to top');
    navigationRef.current.dispatch(popToTopAction);
  }
}
