import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { updatePath } from 'redux-simple-router';

@connect(mapStateToProps)
export default class RequireAuth extends Component {
  static PropTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    isAuthenticating: PropTypes.bool.isRequiring
  };

  componentWillMount () {
    const {isAuthenticated, isAuthenticating, dispatch} = this.props;
    if (!isAuthenticated && !isAuthenticating) {
      const redirectAfterLogin = this.props.location.pathname;
      dispatch(updatePath(`/login?next=${redirectAfterLogin}`))
    }
  }

  render() {
    return (
      <div>
        {this.props.isAuthenticating ? this.loggingIn() : this.props.children}
      </div>
    )
  }

  loggingIn() {
    return (
      <div>Logging in...</div>
    )

  }
}

function mapStateToProps(state) {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    isAuthenticating: state.auth.isAuthenticating
  }
}
