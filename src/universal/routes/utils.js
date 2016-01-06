import {loginToken} from '../redux/ducks/auth';
import socketOptions from '../utils/socketOptions';

export const requireNoAuth = store => (nextState, replaceState, cb) => {
  if (!__CLIENT__) return cb();
  const redirect = '/';
  const isAuthenticated = store.getState().getIn(['auth', 'isAuthenticated']);
  const authToken = localStorage.getItem(socketOptions.authTokenName);
  if (isAuthenticated || authToken) {
    replaceState(null, redirect);
  }
  cb()
}

let calledHook = 0;

export const requireAuth = store => async (nextState, replaceState, cb) => {
  //and the hackiest solution award goes to...
  // http://stackoverflow.com/questions/34620435/react-router-auto-login-in-the-onenter-hook
  if (!(++calledHook % 2)) return cb();

  const next = nextState.location.pathname;
  if (!__CLIENT__) {
    replaceState(null, '/login', {next});
    return cb();
  }
  let isAuthenticated = store.getState().getIn(['auth', 'isAuthenticated']);
  if (isAuthenticated) {
    return cb()
  }
  const authToken = localStorage.getItem(socketOptions.authTokenName);
  if (!authToken) {
    replaceState(null, '/login', {next});
    return cb();
  }
  let isAuthenticating = store.getState().getIn(['auth', 'isAuthenticating']);
  await store.dispatch(loginToken(authToken));
  isAuthenticated = store.getState().getIn(['auth', 'isAuthenticated']);
  if (!isAuthenticated) {
    replaceState(null, '/login', {next});
  }
  cb()
}
