import fetch from 'isomorphic-fetch';
import {createReducer} from '../utils';
import jwtDecode from 'jwt-decode';
import { updatePath } from 'redux-simple-router';
import Joi from 'joi';

export const LOGIN_USER_REQUEST = 'LOGIN_USER_REQUEST';
export const LOGIN_USER_ERROR = 'LOGIN_USER_ERROR';
export const LOGIN_USER_SUCCESS = 'LOGIN_USER_SUCCESS';
export const SIGNUP_USER_REQUEST = 'SIGNUP_USER_REQUEST';
export const SIGNUP_USER_ERROR = 'SIGNUP_USER_ERROR';
export const SIGNUP_USER_SUCCESS = 'SIGNUP_USER_SUCCESS';
export const LOGOUT_USER = 'LOGOUT_USER';
//export const VERIFY_TOKEN_REQUEST = 'VERIFY_TOKEN_REQUEST';
//export const VERIFY_TOKEN_SUCCESS = 'VERIFY_TOKEN_SUCCESS';
//export const VERIFY_TOKEN_ERROR = 'VERIFY_TOKEN_ERROR';
export const FETCH_PROTECTED_DATA_REQUEST = 'FETCH_PROTECTED_DATA_REQUEST';
export const RECEIVE_PROTECTED_DATA = 'RECEIVE_PROTECTED_DATA';


export const authSchema = Joi.object().keys({
  email: Joi.string().email().label('Email').required().options({
    language: {
      any: {
        required: '!!Required',
        empty: '!!Required'
      },
      string: {
        email: '!!That\'s not an email!'
      }
    }
  }),
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
      return Object.assign({}, state, {
        error: null,
        isAuthenticating: true
      });
    case LOGIN_USER_SUCCESS:
      const {token, user} = action.payload;
      return Object.assign({}, state, {
        error: null,
        isAuthenticating: false,
        isAuthenticated: true,
        token,
        user
      });
    case LOGIN_USER_ERROR:
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

export function signupUserSuccess(token) {
  return {
    type: SIGNUP_USER_SUCCESS,
    payload: {
      token: token
    }
  }
}

export function signupUserError(error) {
  return {
    type: SIGNUP_USER_ERROR,
    payload: {
      status: error.response.status,
      statusText: error.response.statusText
    }
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
  return function (dispatch) {
    dispatch(loginUserRequest());
    return postJSON('/auth/login', {email, password})
      .then(parseJSON)
      .then(res => {
        const {token, user, error} = res;
        if (token) {
          const payload = {token, user};
          const redirect = redirect || '/';
          localStorage.setItem('Meatier.token', token);
          dispatch(loginUserSuccess(payload));
          dispatch(updatePath(redirect));
        } else {
          dispatch(loginUserError(error || 'Unknown server error. Try again'));
        }
      })
  }
}

export function loginToken(token) {
  return function (dispatch) {
    dispatch(loginUserRequest());
    return postJSON('/auth/login-token', {token})
      .then(res => {
        if (res.status !== 200) {
          throw new Error('Error logging in with token');
        }
        return res;
      })
      .then(parseJSON)
      .then(res => {
        const payload = {token, user: res.user};
        dispatch(loginUserSuccess(payload));
      });
    //no catch because it's not really an error if someone doesn't have a token
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
  return function (dispatch) {
    dispatch(signupUserRequest());
    return postJSON('/auth/login', {email, password})
      .then(parseJSON)
      .then(response => {
        let redirect = redirect || '/';
        dispatch(signupUserSuccess(response.token));
        dispatch(updatePath(redirect));
      })
      .catch(error => {
        dispatch(signupUserError(error));
      })
  }
}

export function parseJSON(response) {
  return response.json()
}

export function hostUrl() {
  const {host, protocol} = window.location;
  return `${protocol}//${host}`;
}

export function postJSON(route, obj) {
  return fetch(hostUrl() + route, {
    method: 'post',
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(obj)
  })
}

export const authActions = {
  loginUser,
  signupUser
};
