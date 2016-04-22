import {fromJS, Map as iMap} from 'immutable';
import {push, replace} from 'react-router-redux';
import {ensureState} from 'redux-optimistic-ui';
import fetch from 'isomorphic-fetch';

import {parseJSON, hostUrl, fetchGraphQL} from '../../../utils/fetching';
import socketOptions from '../../../utils/socketOptions';
import validateSecretToken from '../../../utils/validateSecretToken';

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

const initialState = iMap({
  error: iMap(),
  isAuthenticated: false,
  isAuthenticating: false,
  authToken: null,
  user: iMap({
    id: null,
    email: null,
    strategies: iMap()
  })
});

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOGIN_USER_REQUEST:
    case SIGNUP_USER_REQUEST:
      return state.merge({
        error: iMap(),
        isAuthenticating: true
      });
    case LOGIN_USER_SUCCESS:
    case SIGNUP_USER_SUCCESS:
      return state.merge({
        error: iMap(),
        isAuthenticating: false,
        isAuthenticated: true,
        authToken: action.payload.authToken,
        user: fromJS(action.payload.user)
      });
    case LOGIN_USER_ERROR:
    case SIGNUP_USER_ERROR:
      return state.merge({
        error: fromJS(action.error) || iMap(),
        isAuthenticating: false,
        isAuthenticated: false,
        authToken: null,
        user: iMap()
      });
    case LOGOUT_USER:
      return initialState;
    case VERIFY_EMAIL_ERROR:
      return state.merge({
        error: fromJS(action.error) || iMap()
      });
    case VERIFY_EMAIL_SUCCESS:
      return state.merge({
        error: iMap(),
        isAuthenticating: false,
        isAuthenticated: true,
        authToken: action.payload.authToken,
        user: fromJS(action.payload.user)
      });
    default:
      return state;
  }
}

export function loginUserSuccess(payload) {
  return {
    type: LOGIN_USER_SUCCESS,
    payload
  };
}

export function loginUserError(error) {
  return {
    type: LOGIN_USER_ERROR,
    error
  };
}

export function signupUserSuccess(payload) {
  return {
    type: SIGNUP_USER_SUCCESS,
    payload
  };
}

export function signupUserError(error) {
  return {
    type: SIGNUP_USER_ERROR,
    error
  };
}

const user = `
{
  id,
  email,
  strategies {
    local {
      isVerified
    }
  }
}`;

const userWithAuthToken = `
{
  user ${user},
  authToken
}`;

export const loginUser = (dispatch, variables, redirect) => {
  dispatch({type: LOGIN_USER_REQUEST});
  return new Promise(async (resolve, reject) => {
    const query = `
    query($email: Email!, $password: Password!){
       payload: login(email: $email, password: $password)
       ${userWithAuthToken}
    }`;
    const {error, data} = await fetchGraphQL({query, variables});
    if (error) {
      localStorage.removeItem(authTokenName);
      dispatch(loginUserError(error));
      reject(error);
    } else {
      const {payload} = data;
      localStorage.setItem(authTokenName, payload.authToken);
      dispatch(loginUserSuccess(payload));
      dispatch(push(redirect));
      resolve();
    }
  });
};

export function loginToken() {
  return async (dispatch, getState) => {
    dispatch({type: LOGIN_USER_REQUEST});
    const query = `
    query {
       payload: loginAuthToken
       ${user}
    }`;
    const {error, data} = await fetchGraphQL({query});
    if (error) {
      dispatch(loginUserError(error));
    } else {
      const {payload} = data;
      dispatch(loginUserSuccess({user: payload}));
      const routingState = ensureState(getState()).get('routing');
      const next = routingState && routingState.location && routingState.location.query && routingState.location.query.next;
      if (next) {
        dispatch(replace(next));
      }
    }
  };
}

export function signupUser(dispatch, variables, redirect) {
  dispatch({type: SIGNUP_USER_REQUEST});
  return new Promise(async function (resolve, reject) {
    const query = `
    mutation($email: Email!, $password: Password!){
       payload: createUser(email: $email, password: $password)
       ${userWithAuthToken}
    }`;
    const {error, data} = await fetchGraphQL({query, variables});
    if (error) {
      localStorage.removeItem(authTokenName);
      dispatch(signupUserError(error));
      reject(error);
    } else {
      const {payload} = data;
      localStorage.setItem(authTokenName, payload.authToken);
      dispatch(signupUserSuccess(payload));
      dispatch(push(redirect));
      resolve();
    }
  });
}
export function emailPasswordReset(variables, dispatch) {
  return new Promise(async function (resolve, reject) {
    const query = `
    mutation($email: Email!){
       payload: emailPasswordReset(email: $email)
    }`;
    const {error} = await fetchGraphQL({query, variables});
    if (error) {
      reject(error);
    } else {
      dispatch(replace('/login/reset-email-sent'));
      resolve();
    }
  });
}

export function resetPassword({resetToken, password}, dispatch) {
  return new Promise(async function (resolve, reject) {
    const resetTokenObj = validateSecretToken(resetToken);
    if (resetTokenObj._error) {
      return reject(resetTokenObj._error);
    }
    const query = `
    mutation($password: Password!){
       payload: resetPassword(password: $password)
       ${userWithAuthToken}
    }`;
    const {error, data} = await fetchGraphQL({query, variables: {password}, resetToken});
    if (error) {
      reject(error);
    } else {
      const {payload} = data;
      localStorage.setItem(authTokenName, payload.authToken);
      dispatch(signupUserSuccess(payload));
      dispatch(replace('/login/reset-password-success'));
      resolve();
    }
  });
}

export function verifyEmail(verifiedEmailToken) {
  return async function (dispatch) {
    const query = `
    mutation {
       payload: verifyEmail
       ${userWithAuthToken}
    }`;
    const {error, data} = await fetchGraphQL({query, verifiedEmailToken});
    if (error) {
      return dispatch({type: VERIFY_EMAIL_ERROR, error});
    }
    const {payload} = data;
    return dispatch({type: VERIFY_EMAIL_SUCCESS, payload});
  };
}

export function oauthLogin(providerEndpoint, redirect) {
  redirect = redirect || '/';
  return async function (dispatch) {
    dispatch({type: LOGIN_USER_REQUEST});
    const res = await fetch(hostUrl() + providerEndpoint, {
      method: 'get',
      mode: 'no-cors',
      credentials: 'include'
    });
    const parsedRes = await parseJSON(res);
    const {error, data} = parsedRes;
    if (error) {
      localStorage.removeItem(authTokenName);
      dispatch({type: LOGIN_USER_ERROR, error});
    } else {
      const {payload} = data;
      if (payload.authToken) {
        localStorage.setItem(authTokenName, payload.authToken);
        dispatch({type: LOGIN_USER_SUCCESS, payload});
        dispatch(replace(redirect));
      }
    }
  };
}

export function logoutAndRedirect() {
  localStorage.removeItem(authTokenName);
  return function (dispatch) {
    dispatch({type: LOGOUT_USER});
    dispatch(replace('/'));
  };
}
