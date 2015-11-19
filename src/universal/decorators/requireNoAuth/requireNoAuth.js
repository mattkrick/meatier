import React, { Component,PropTypes } from 'react';
import { updatePath } from 'redux-simple-router';


export default function requireNoAuth(ComposedComponent) {
  return class NoAuthComp extends Component {
    componentWillMount() {
      this.checkAuth();
    }

    componentWillReceiveProps (nextProps) {
      //MUST have the nextProps param in there
      this.checkAuth();
    }

    render() {
      return (
        <ComposedComponent {...this.props}/>
      )
    }

    checkAuth() {
      const {isAuthenticated, dispatch} = this.props;
      if (isAuthenticated) {
        dispatch(updatePath('/'))
      }
    }
  }
}
