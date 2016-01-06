import jwtDecode from 'jwt-decode';
import fetch from 'isomorphic-fetch';
import {pushPath, replacePath} from 'redux-simple-router';
import {postJSON, parseJSON, getJSON, hostUrl} from '../../utils/fetching';
import socketOptions from '../../utils/socketOptions';
import validateSecretToken from '../../utils/validateSecretToken';
import Immutable from 'immutable';


const {authTokenName} = socketOptions;

export const LOGIN_USER_REQUEST = 'LOGIN_USER_REQUEST';
export const LOGIN_USER_ERROR = 'LOGIN_USER_ERROR';
export const LOGIN_USER_SUCCESS = 'LOGIN_USER_SUCCESS';
export const SIGNUP_USER_REQUEST = 'SIGNUP_USER_REQUEST';
export const SIGNUP_USER_ERROR = 'SIGNUP_USER_ERROR';
export const SIGNUP_USER_SUCCESS = 'SIGNUP_USER_SUCCESS';
export const LOGOUT_USER = 'LOGOUT_USER';
export const VERIFY_EMAIL_ERROR = 'VERIFY_EMAIL_ERROR';
export const VERIFY_EMAIL_SUCCESS = 'VERIFY_EMAIL_SUCCESS';

const initialState = Immutable.fromJS({
  error: {},
  isAuthenticated: false,
  isAuthenticating: false,
  authToken: null,
  user: {
    id: null,
    email: null,
    strategies: {}
  }
});

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOGIN_USER_REQUEST:
    case SIGNUP_USER_REQUEST:
      return state.merge({
        error: {},
        isAuthenticating: true
      });
    case LOGIN_USER_SUCCESS:
    case SIGNUP_USER_SUCCESS:
      const {authToken, user} = action.payload;
      return state.merge({
        error: {},
        isAuthenticating: false,
        isAuthenticated: true,
        authToken,
        user
      });
    case LOGIN_USER_ERROR:
    case SIGNUP_USER_ERROR:
      return state.merge({
        error: action.error,
        isAuthenticating: false,
        isAuthenticated: false,
        authToken: null,
        user: {}
      });
    case LOGOUT_USER:
      return initialState;
    case VERIFY_EMAIL_ERROR:
      return state.merge({
        error: action.error
      });
    case VERIFY_EMAIL_SUCCESS:
      return state.merge({
        user: {
          strategies: {
            local: {
              isVerified: true
            }
          }
        }
      });
    default:
      return state;
  }
}

export function loginUserSuccess(payload) {
  return {
    type: LOGIN_USER_SUCCESS,
    payload
  }
}

export function loginUserError(error) {
  return {
    type: LOGIN_USER_ERROR,
    error
  }
}

export function signupUserSuccess(payload) {
  return {
    type: SIGNUP_USER_SUCCESS,
    payload
  }
}

export function signupUserError(error) {
  return {
    type: SIGNUP_USER_ERROR,
    error
  }
}


export function loginUser(dispatch, data, redirect) {
  dispatch({type: LOGIN_USER_REQUEST});
  return new Promise(async function (resolve, reject) {
    let res = await postJSON('/auth/login', data);
    let parsedRes = await parseJSON(res);
    const {error, ...payload} = parsedRes;
    if (payload.authToken) {
      localStorage.setItem(authTokenName, payload.authToken);
      dispatch(loginUserSuccess(payload));
      dispatch(replacePath(redirect));
      resolve()
    } else {
      dispatch(loginUserError(error));
      reject(error)
    }
  });
}

export function sendResetEmail(data, dispatch) {
  return new Promise(async function (resolve, reject) {
    let res = await postJSON('/auth/send-reset-email', data);
    if (res.status == 200) {
      dispatch(pushPath('/login/reset-email-sent'));
      return resolve();
    }
    let parsedRes = await parseJSON(res);
    const {error} = parsedRes;
    if (error) {
      reject(error)
    }
  });
}

export function resetPassword(data, dispatch) {
  return new Promise(async function (resolve, reject) {
    const resetTokenObj = validateSecretToken(data.resetToken);
    if (resetTokenObj.error) {
      return reject(resetTokenObj.error);
    }
    let res = await postJSON('/auth/reset-password', data);
    let parsedRes = await parseJSON(res);
    const {error, ...payload} = parsedRes;
    if (payload.authToken) {
      localStorage.setItem(authTokenName, payload.authToken);
      dispatch(signupUserSuccess(payload));
      dispatch(replacePath('/login/reset-password-success'));
      resolve();
    } else {
      reject(error);
    }
  });
}

export function signupUser(dispatch, data, redirect) {
  dispatch({type: SIGNUP_USER_REQUEST});
  return new Promise(async function (resolve, reject) {
    let res = await postJSON('/auth/signup', data);
    let parsedRes = await parseJSON(res);
    const {error, ...payload} = parsedRes;
    if (payload.authToken) {
      localStorage.setItem(authTokenName, payload.authToken);
      dispatch(signupUserSuccess(payload));
      dispatch(replacePath(redirect));
      resolve();
    } else {
      dispatch(signupUserError(error));
      reject(error);
    }
  });
}

export function loginToken(authToken) {
  return async function (dispatch, getState) {
    const auth = getState().get('auth');
    const isAuthenticated = auth.get('isAuthenticated');
    const isAuthenticating = auth.get('isAuthenticating');
    //stop duplicate since it could come from onEnter or from AppContainer
    if (isAuthenticated || isAuthenticating) return;
    dispatch({type: LOGIN_USER_REQUEST});
    let res = await postJSON('/auth/login-token', {authToken});
    if (res.status !== 200) {
      localStorage.removeItem(authTokenName);
      return dispatch(loginUserError('Error logging in with authentication token'));
    }
    let parsedRes = await parseJSON(res);
    const payload = {authToken, user: parsedRes.user};
    dispatch(loginUserSuccess(payload));
  }
}

export function verifyEmail(verifiedEmailToken) {
  return async function (dispatch) {
    let res = await postJSON('/auth/verify-email', {verifiedEmailToken});
    if (res.status === 200) {
      return dispatch({type: VERIFY_EMAIL_SUCCESS});
    }
    let parsedRes = await parseJSON(res);
    return dispatch({
      type: VERIFY_EMAIL_ERROR,
      error: parsedRes.error
    });
  }
}

export function oauthLogin(providerEndpoint, redirect) {
  return async function (dispatch) {
    dispatch({type: LOGIN_USER_REQUEST});
    let res = await fetch(hostUrl() + providerEndpoint, {
      //fetch is currently a shitshow, this is just guess & check
      method: 'get',
      mode: 'no-cors',
      credentials: 'include',
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
      }
    })
    let parsedRes = await parseJSON(res);
    const {error, ...payload} = parsedRes;
    if (payload.authToken) {
      localStorage.setItem(authTokenName, payload.authToken);
      dispatch({type: LOGIN_USER_SUCCESS, payload});
      dispatch(replacePath(redirect));
    } else {
      dispatch({type: LOGIN_USER_ERROR, error});
    }
  }
}


export function logoutAndRedirect() {
  localStorage.removeItem(authTokenName);
  return function (dispatch) {
    dispatch({type: LOGOUT_USER});
    dispatch(replacePath('/'));
  }
}
