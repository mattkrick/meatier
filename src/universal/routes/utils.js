import {loginToken} from '../redux/ducks/auth';
import socketOptions from '../utils/socketOptions';

export const requireNoAuth = store => (nextState, replaceState, cb) => {
  if (!__CLIENT__) return cb();
  const redirect = '/';
  const {isAuthenticated} = store.getState().auth;
  const authToken = localStorage.getItem(socketOptions.authTokenName);
  if (isAuthenticated || authToken) {
    replaceState(null, redirect);
  }
  cb()
}

export const requireAuth = store => async (nextState, replaceState, cb) => {
  const next = nextState.location.pathname;
  if (!__CLIENT__) {
    replaceState(null, '/login', {next});
    return cb();
  }
  let {isAuthenticated} = store.getState().auth;
  if (isAuthenticated) {
    return cb()
  }
  const authToken = localStorage.getItem(socketOptions.authTokenName);
  if (!authToken) {
    replaceState(null, '/login', {next});
    return cb();
  }
  await store.dispatch(loginToken(authToken));
  ({isAuthenticated} = store.getState().auth);
  if (!isAuthenticated) {
    replaceState(null, '/login', {next});
  }
  cb()
}
