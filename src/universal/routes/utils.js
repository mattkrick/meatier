import {loginToken} from 'universal/redux/ducks/auth';
import socketOptions from 'universal/utils/socketOptions';

export const requireNoAuth = async (nextState, replaceState, cb) => {
  const redirect = '/';
  const {isAuthenticated} = store.getState().auth;
  const authToken = localStorage.getItem(socketOptions.authTokenName);
  if (isAuthenticated || authToken) {
    replaceState(null, redirect);
  }
  cb()
}

export const requireAuth = async (nextState, replaceState, cb) => {
  const redirect = `/login?next=${nextState.location.pathname}`;
  let {isAuthenticated} = store.getState().auth;
  if (isAuthenticated) {
    return cb()
  }
  const authToken = localStorage.getItem(socketOptions.authTokenName);
  if (!authToken) {
    replaceState(null, redirect);
    return cb();
  }
  await store.dispatch(loginToken(authToken));
  ({isAuthenticated} = store.getState().auth);
  if (!isAuthenticated) {
    replaceState(null, redirect);
  }
  cb()
}
