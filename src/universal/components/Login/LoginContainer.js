import React, { Component, PropTypes } from 'react';
import {authActions, authSchema} from '../../redux/ducks/auth';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { updatePath } from 'redux-simple-router';
import Login from './Login';
import {reduxForm} from 'redux-form';
import Joi from 'joi';
import requireNoAuth from '../../decorators/requireNoAuth/requireNoAuth';

@reduxForm({form: 'loginForm', fields: ['email', 'password'], validate})
@connect(mapStateToProps, mapDispatchToProps)
@requireNoAuth //must come after connect so we have isAuthenticated
export default class LoginContainer extends Component {
  static PropTypes = {
    authActions: PropTypes.object.isRequired,
    location: PropTypes.object,
    isAuthenticating: PropTypes.bool.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    error: PropTypes.string
  };

  render() {
    return <Login {...this.props}/>
  }
}

function mapStateToProps(state) {
  const {auth: {isAuthenticating, isAuthenticated, error}, routing: {path}} = state;
  return {
    isAuthenticating,
    isAuthenticated,
    error,
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
  const results = Joi.validate(values,authSchema,{abortEarly: false});
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
