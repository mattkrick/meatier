import React, { Component, PropTypes } from 'react';
import {authActions, authSchema} from '../../redux/ducks/auth';
import { connect } from 'react-redux';
import Login from './../Login/Login';
import {reduxForm} from 'redux-form';
import Joi from 'joi';


@reduxForm({form: 'loginForm', fields: ['email', 'password'], validate})
export default class AuthContainer extends Component {

  render() {
    return <Auth {...this.props}/>
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
