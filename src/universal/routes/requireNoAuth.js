import socketOptions from '../utils/socketOptions';
import {ensureState} from 'redux-optimistic-ui';

export const requireNoAuth = store => (nextState, replaceState, cb) => {
  if (!__CLIENT__) return cb();
  const redirect = '/';
  const isAuthenticated = ensureState(store.getState()).getIn(['auth', 'isAuthenticated']);
  //const authToken = localStorage.getItem(socketOptions.authTokenName);
  if (isAuthenticated) {
    replaceState(null, redirect);
  }
  cb()
}
