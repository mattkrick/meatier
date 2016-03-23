import React, {Component} from 'react';
import {verifyEmail} from '../..//ducks/auth';
import {connect} from 'react-redux';
import VerifyEmail from '../..//components/VerifyEmail/VerifyEmail';
import {ensureState} from 'redux-optimistic-ui';

@connect(mapStateToProps)
export default class VerifyEmailContainer extends Component {
  constructor(props) {
    super(props);
    this.verifyHandler(props);
  }
  componentWillReceiveProps(nextProps) {
    this.verifyHandler(nextProps);
  }
  render() {
    const {error, isVerified} = this.props;
    return <VerifyEmail error={error} isVerified={isVerified}/>;
  }

  verifyHandler(props) {
    /* A race between logging in & verifying exists
     It's possible that the logging in process can pull the user doc when isVerified is false
     Then, the verifyEmail can change that to be true in the DB and in the local state
     Then, log in success can turn it back to false in the local state
     Since we can guarantee we'll start authenticating before verifying, we can delay the verification*/
    const {dispatch, params: {verifiedEmailToken}, isAuthenticating, authError, isVerified} = props;
    if (!isVerified && !isAuthenticating && !authError.size) {
      dispatch(verifyEmail(verifiedEmailToken));
      // if they don't have a JWT, we don't log them in
      // edge case since that means they logged out before they verified
    }
  }
}

function mapStateToProps(state) {
  const auth = ensureState(state).get('auth');
  return {
    authError: auth.get('error').toJS(),
    isAuthenticating: auth.get('isAuthenticating'),
    isVerified: auth.getIn(['user', 'strategies', 'local', 'isVerified'])
  };
}
