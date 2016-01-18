import socketOptions from '../utils/socketOptions';
import {ensureState} from 'redux-optimistic-ui';

export const requireNoAuth = store => (nextState, replace, cb) => {
  if (__CLIENT__) {
    const redirect = '/';
    const isAuthenticated = ensureState(store.getState()).getIn(['auth', 'isAuthenticated']);
    const authToken = localStorage.getItem(socketOptions.authTokenName);
    if (isAuthenticated || authToken) {
      replace({pathname: redirect});
    }
  }
  cb()
}
