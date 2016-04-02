import React, {PropTypes, Component} from 'react';
import {loginToken} from '../../modules/auth/ducks/auth';

export default authTokenName => ComposedComponent => {
  return class TokenizedComp extends Component {
    static propTypes = {
      dispatch: PropTypes.func
    }
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
