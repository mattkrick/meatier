import React, { Component,PropTypes } from 'react';
import {loginToken} from '../../redux/ducks/auth';

export default authTokenName => ComposedComponent => {
  return class TokenizedComp extends Component {
    componentWillMount() {
      let authToken = localStorage.getItem(authTokenName);
      if (authToken) {
        this.props.dispatch(loginToken(authToken));
      }
    }

    render() {
      return (
        <ComposedComponent {...this.props}/>
      )
    }
  }
}
