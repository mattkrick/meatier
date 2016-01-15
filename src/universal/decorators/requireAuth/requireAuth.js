import React, { Component,PropTypes } from 'react';
import {pushPath, replacePath} from 'redux-simple-router';
import socketOptions from 'universal/utils/socketOptions';

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

    render() {
      let {isAuthenticated} = this.props
      console.log('isAUTH', isAuthenticated)
      if (isAuthenticated) {
        return <ComposedComponent {...this.props}/>
      }
      return <div>Logging in...</div>
    }
  }
}
