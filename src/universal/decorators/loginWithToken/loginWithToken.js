import React, {Component} from 'react';
import {loginToken} from '../../modules/auth/ducks/auth';

export default authTokenName => ComposedComponent => {
  return class TokenizedComp extends Component {
    componentWillMount() {
      if (__CLIENT__) {
        const authToken = localStorage.getItem(authTokenName);
        if (authToken) {
          this.props.dispatch(loginToken());
        }
      }
    }

    render() {
      return (
        <ComposedComponent {...this.props}/>
      );
    }
  };
};
