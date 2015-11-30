import React, { Component,PropTypes } from 'react';
import {loginToken} from '../../redux/ducks/auth';

export default authTokenName => ComposedComponent => {
  return class TokenizedComp extends Component {
    componentWillMount() {
      let token = localStorage.getItem(authTokenName);
      if (token) {
        this.props.dispatch(loginToken(token));
      }
    }

    render() {
      return (
        <ComposedComponent {...this.props}/>
      )
    }
  }
}
