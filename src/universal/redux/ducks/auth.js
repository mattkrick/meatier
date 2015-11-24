import fetch from 'isomorphic-fetch';
import jwtDecode from 'jwt-decode';
import { updatePath } from 'redux-simple-router';
import Joi from 'joi';
import {postJSON, parseJSON, hostUrl} from '../../utils/utils';

export const LOGIN_USER_REQUEST = 'LOGIN_USER_REQUEST';
export const LOGIN_USER_ERROR = 'LOGIN_USER_ERROR';
export const LOGIN_USER_SUCCESS = 'LOGIN_USER_SUCCESS';
export const SIGNUP_USER_REQUEST = 'SIGNUP_USER_REQUEST';
export const SIGNUP_USER_ERROR = 'SIGNUP_USER_ERROR';
export const SIGNUP_USER_SUCCESS = 'SIGNUP_USER_SUCCESS';
export const LOGOUT_USER = 'LOGOUT_USER';

export const authSchemaEmail = Joi.string().email().label('Email').required().options({
  language: {
    any: {
      required: '!!Required',
      empty: '!!Required'
    },
    string: {
      email: '!!That\'s not an email!'
    }
  }
});

export const authSchema = Joi.object().keys({
  email: authSchemaEmail,
  password: Joi.string().min(6).label('Password').required().options({
    language: {
      any: {
        required: '!!Required',
        empty: '!!Required'
      },
      string: {
        min: '{{!key}} should be at least {{limit}} chars long'
      }
    }
  })
});

const initialState = {
  error: null,
  isAuthenticated: false,
  isAuthenticating: false,
  token: null,
  user: {}
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOGIN_USER_REQUEST:
    case SIGNUP_USER_REQUEST:
      return Object.assign({}, state, {
        error: null,
        isAuthenticating: true
      });
    case LOGIN_USER_SUCCESS:
    case SIGNUP_USER_SUCCESS:
      const {token, user} = action.payload;
      return Object.assign({}, state, {
        error: null,
        isAuthenticating: false,
        isAuthenticated: true,
        token,
        user
      });
    case LOGIN_USER_ERROR:
    case SIGNUP_USER_ERROR:
      return Object.assign({}, state, {
        error: action.error,
        isAuthenticating: false,
        isAuthenticated: false,
        token: null,
        user: {}
      });
    case LOGOUT_USER:
      return Object.assign({}, state, {
        error: null,
        isAuthenticating: false,
        isAuthenticated: false,
        token: null,
        user: {}
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

export function loginUserRequest() {
  return {
    type: LOGIN_USER_REQUEST
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

export function signupUserRequest() {
  return {
    type: SIGNUP_USER_REQUEST
  }
}

export function logout() {
  return {
    type: LOGOUT_USER
  }
}

export function loginUser(email, password, redirect) {
  return async function (dispatch) {
    dispatch(loginUserRequest());
    let res = await postJSON('/auth/login', {email, password});
    let parsedRes = await parseJSON(res);
    const {token, user, error} = parsedRes;
    if (token) {
      const payload = {token, user};
      redirect = redirect || '/';
      localStorage.setItem('Meatier.token', token);
      dispatch(loginUserSuccess(payload));
      dispatch(updatePath(redirect));
    } else {
      dispatch(loginUserError(error || 'Unknown server error. Try again'));
    }
  }
}

export function loginToken(token) {
  return async function (dispatch) {
    dispatch(loginUserRequest());
    let res = await postJSON('/auth/login-token', {token});
    if (res.status !== 200) {
      return dispatch(loginUserError('Error logging in with token'));
    }
    let parsedRes = await parseJSON(res);
    const payload = {token, user: parsedRes.user};
    dispatch(loginUserSuccess(payload));
  }
}

export function logoutAndRedirect() {
  localStorage.clear();
  return function (dispatch) {
    dispatch(logout());
    dispatch(updatePath('/'));
  }
}

export function signupUser(email, password, redirect) {
  return async function (dispatch) {
    dispatch(signupUserRequest());
    let res = await postJSON('/auth/signup', {email, password});
    let parsedRes = await parseJSON(res);
    const {token, user, error} = parsedRes;
    if (token) {
      const payload = {token, user};
      const redirect = redirect || '/';
      localStorage.setItem('Meatier.token', token);
      dispatch(signupUserSuccess(payload));
      dispatch(updatePath(redirect));
    } else {
      dispatch(signupUserError(error || 'Unknown server error. Try again'));
    }
  }
}

export const authActions = {
  loginUser,
  signupUser
};
