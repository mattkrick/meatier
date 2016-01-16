import React, { Component,PropTypes } from 'react';
import {pushPath, replacePath} from 'redux-simple-router';
import socketOptions from 'universal/utils/socketOptions';
import {ensureState} from 'redux-optimistic-ui';
import {connect} from 'react-redux';

export default ComposedComponent => {
  return class RequiredAuth extends Component {

    componentWillMount() {
      const {dispatch, hasAuthError} = this.props;
      if (!__CLIENT__) {
        dispatch(replacePath('/login?next=%2Fkanban'));
      }
      const authToken = localStorage.getItem(socketOptions.authTokenName);
      if (hasAuthError || !authToken) {
        dispatch(replacePath('/login?next=%2Fkanban'));
      }
    }

    componentWillReceiveProps (nextProps) {
      const {dispatch, hasAuthError} = nextProps;
      if (hasAuthError) {
        //redux-simple-router goes into an infinite loop if path is anything but root
        // will file an issue if it persists in v2
        dispatch(replacePath('/'));
      }
    }

    render() {
      let {isAuthenticated} = this.props
      if (isAuthenticated) {
        return <ComposedComponent {...this.props}/>
      }
      return <div>Logging in...</div>
    }
  }
}
