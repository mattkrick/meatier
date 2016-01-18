import React, { Component,PropTypes } from 'react';
import {loginToken} from '../../modules/Auth2/ducks/auth';

export default authTokenName => ComposedComponent => {
  return class TokenizedComp extends Component {
    componentWillMount() {
      if (__CLIENT__) {
        let authToken = localStorage.getItem(authTokenName);
        if (authToken) {
          this.props.dispatch(loginToken());
        }
      }
      //TODO: goto url next query param upon success (needs redux-simple-router@2)
    }

    render() {
      return (
        <ComposedComponent {...this.props}/>
      )
    }
  }
}
