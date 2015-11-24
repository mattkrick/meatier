import React, { Component, PropTypes } from 'react';
import {authActions, authSchema} from '../../redux/ducks/auth';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { updatePath } from 'redux-simple-router';
import Auth from '../../components/Auth/Auth';
import {reduxForm} from 'redux-form';
import Joi from 'joi';
import requireNoAuth from '../../decorators/requireNoAuth/requireNoAuth';
import {postJSON, parseJSON} from '../../utils/utils';

//use the same form to retain form values (there's really no difference between login and signup, it's just for show)
@connect(mapStateToProps, mapDispatchToProps)
@reduxForm({form: 'authForm', fields: ['email', 'password'], validate}) //must come after connect to get the path field
@requireNoAuth //must come after connect so we get isAuthenticated
export default class AuthContainer extends Component {
  static PropTypes = {
    authActions: PropTypes.object.isRequired,
    location: PropTypes.object,
    isAuthenticating: PropTypes.bool.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    authError: PropTypes.string,
    path: PropTypes.string.isRequired
  };

  render() {
    const {authActions, path, ...props} = this.props;
    let authType, authFunc;
    if (path.indexOf('/login') !== -1) {
      authType = 'Login';
      authFunc = authActions.loginUser
    } else {
      authType = 'Sign up';
      authFunc = authActions.signupUser
    }
    return <Auth authType={authType} authFunc={authFunc} {...props}/>
  }
}

function mapStateToProps(state) {
  const {auth: {isAuthenticating, isAuthenticated, error}, routing: {path}} = state;
  return {
    isAuthenticating,
    isAuthenticated,
    authError: error, //redux-form will override "error"
    path
  }
}

function mapDispatchToProps(dispatch) {
  return {
    authActions: bindActionCreators(authActions, dispatch),
    dispatch
  }
}

function validate(values) {
  const results = Joi.validate(values, authSchema, {abortEarly: false});
  if (!results.error) return {};
  const errors = {};
  const allErrors = results.error.details;
  for (let i = 0; i < allErrors.length; i++) {
    let curError = allErrors[i];
    if (errors[curError.path]) continue;
    errors[curError.path] = curError.message;
  }
  return errors;
}

//function asyncValidate(values, dispatch, props) {
//  return new Promise((resolve, reject) => {
//    postJSON('/auth/check-email', {email: values.email})
//      .then(parseJSON)
//      .then(parsedRes => {
//        if (parsedRes.isValid) {
//          resolve()
//        } else {
//          reject({email: parsedRes.error})
//        }
//      })
//  });
//}
