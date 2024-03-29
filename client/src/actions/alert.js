import { uuid } from 'uuidv4';
import { SET_ALERT, REMOVE_ALERT } from './types';

export const setAlert = (msg, alertType, timeout) => (dispatch) => {
  const id = uuid();
  dispatch({
    type: SET_ALERT,
    payload: { msg, alertType, id },
  });

  setTimeout(() => {
    dispatch({ type: REMOVE_ALERT, payload: id });
  }, timeout);
};
