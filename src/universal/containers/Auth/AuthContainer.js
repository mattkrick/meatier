import React, { Component, PropTypes } from 'react';
import {authSchemaInsert} from '../../redux/ducks/auth';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Auth from '../../components/Auth/Auth';
import {reduxForm} from 'redux-form';
import Joi from 'joi';
import {postJSON, parseJSON} from '../../utils/utils';
import {parsedJoiErrors} from '../../utils/schema';

//use the same form to retain form values (there's really no difference between login and signup, it's just for show)
@connect(mapStateToProps)
@reduxForm({form: 'authForm', fields: ['email', 'password'], validate}) //must come after connect to get the path field
export default class AuthContainer extends Component {
  static PropTypes = {
    location: PropTypes.object,
    isAuthenticating: PropTypes.bool.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    authError: PropTypes.shape({
      _error: PropTypes.string.isRequired,
      email: PropTypes.string,
      password: PropTypes.string
    }),
    path: PropTypes.string.isRequired
  };

  render() {
    const isLogin = this.props.path.indexOf('/login') !== -1;
    return <Auth isLogin={isLogin} {...this.props}/>
  }
}

function mapStateToProps(state) {
  const {auth: {isAuthenticating, isAuthenticated, error}, routing: {path}} = state;
  return {
    isAuthenticating,
    isAuthenticated,
    authError: error,
    path
  }
}

function validate(values) {
  const results = Joi.validate(values, authSchemaInsert, {abortEarly: false});
  return parsedJoiErrors(results.error);
}

