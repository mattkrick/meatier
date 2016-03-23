import React, {Component} from 'react';
import {push} from 'react-router-redux';
import socketOptions from 'universal/utils/socketOptions';

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
      const {isAuthenticated} = this.props;
      if (isAuthenticated) {
        return <ComposedComponent {...this.props}/>;
      }
      return <div>Logging in...</div>;
    }

    checkForAuth(props) {
      if (__CLIENT__) {
        const {dispatch, hasAuthError, location} = props;
        const newKey = location && location.key || 'none';
        if (newKey === key) {
          return;
        }
        key = newKey;
        const authToken = localStorage.getItem(socketOptions.authTokenName);
        if (hasAuthError || !authToken) {
          dispatch(push('/login?next=%2Fkanban'));
        }
      }
    }
  };
};
