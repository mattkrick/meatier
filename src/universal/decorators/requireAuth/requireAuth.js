import React, { Component,PropTypes } from 'react';
import {routeActions} from 'redux-simple-router';
import socketOptions from 'universal/utils/socketOptions';
import {ensureState} from 'redux-optimistic-ui';
import {connect} from 'react-redux';

const {replace} = routeActions;
//TODO
/* Currently, we allow server-rendered requests to pass on through
* This is because we don't have an auth token to know whether or not the user is legit
* A better solution might be to send them home with a query & then the loginWithAuth would pick up that param
* and redirect them to where they wanted to be*/
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
        const {dispatch, hasAuthError} = props;
        const authToken = localStorage.getItem(socketOptions.authTokenName);
        if (hasAuthError || !authToken) {
          dispatch(replace('/'));
        }
      }
    }
  }
}
