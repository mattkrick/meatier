import React, { Component, PropTypes } from 'react';
import {authActions} from '../../redux/ducks/auth';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Signup from './Signup';


@connect(mapStateToProps, mapDispatchToProps)
export default class SignupContainer extends Component {
  static PropTypes = {
    authActions: PropTypes.object.isRequired,
    location: PropTypes.object,
    isAuthenticating: PropTypes.bool.isRequired,
    statusText: PropTypes.string
  };

  render() {
    return <Signup {...this.props}/>
  }
}

function mapStateToProps(state) {
  return {
    isAuthenticating: state.auth.isAuthenticating,
    statusText: state.auth.statusText
  }
}

function mapDispatchToProps(dispatch) {
  return {
    authActions: bindActionCreators(authActions, dispatch)
  }
};
