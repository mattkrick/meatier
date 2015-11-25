import React, { Component, PropTypes } from 'react';
import {loginUser, signupUser, authSchema} from '../../redux/ducks/auth';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { updatePath } from 'redux-simple-router';
import Auth from '../../components/Auth/Auth';
import {reduxForm} from 'redux-form';
import Joi from 'joi';
import requireNoAuth from '../../decorators/requireNoAuth/requireNoAuth';
import {postJSON, parseJSON} from '../../utils/utils';

//use the same form to retain form values (there's really no difference between login and signup, it's just for show)
@connect(mapStateToProps)
@reduxForm({form: 'authForm', fields: ['email', 'password'], validate}) //must come after connect to get the path field
@requireNoAuth //must come after connect so we get isAuthenticated
export default class AuthContainer extends Component {
  static PropTypes = {
    location: PropTypes.object,
    isAuthenticating: PropTypes.bool.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    tokenError: PropTypes.string,
    path: PropTypes.string.isRequired
  };

  render() {
    const {path} = this.props;
    let authType, authFunc;
    if (path.indexOf('/login') !== -1) {
      authType = 'Login';
      authFunc = loginUser
    } else {
      authType = 'Sign up';
      authFunc = signupUser
    }
    return <Auth authType={authType} authFunc={authFunc} {...this.props}/>
  }
}

function mapStateToProps(state) {
  const {auth: {isAuthenticating, isAuthenticated, error}, routing: {path}} = state;
  return {
    isAuthenticating,
    isAuthenticated,
    tokenError: error,
    path
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

