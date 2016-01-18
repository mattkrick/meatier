import React, { Component,PropTypes } from 'react';
import {routeActions} from 'redux-simple-router';
import socketOptions from 'universal/utils/socketOptions';
import {ensureState} from 'redux-optimistic-ui';
import {connect} from 'react-redux';

const {replace, push} = routeActions;

// workaround for https://github.com/rackt/redux-simple-router/issues/212
let key;
export default ComposedComponent => {
  return class RequiredAuth extends Component {

    componentWillMount() {
      this.checkForAuth(this.props);
    }

    componentWillReceiveProps(nextProps) {
      this.checkForAuth(nextProps);
    }

    render() {
      let {isAuthenticated} = this.props
      if (isAuthenticated) {
        return <ComposedComponent {...this.props}/>
      }
      return <div>Logging in...</div>
    }

    checkForAuth(props) {
      if (__CLIENT__) {
        const {dispatch, hasAuthError, location} = props;
        let newKey = location && location.key || 'none';
        if (newKey === key) {
          return
        }
        key = newKey;
        const authToken = localStorage.getItem(socketOptions.authTokenName);
        if (hasAuthError || !authToken) {
          dispatch(push('/login?next=%2Fkanban'));
        }
      }
    }
  }
}
