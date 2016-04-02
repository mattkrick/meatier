import React, {PropTypes, Component} from 'react';
import {push} from 'react-router-redux';
import socketOptions from 'universal/utils/socketOptions';

let key;
export default ComposedComponent => {
  return class RequiredAuth extends Component {
    static propTypes = {
      isAuthenticated: PropTypes.bool,
      dispatch: PropTypes.func,
      hasAuthError: PropTypes.bool,
      location: PropTypes.shape({
        query: PropTypes.shape({
          e: PropTypes.string,
          next: PropTypes.string
        })
      })
    }

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
