import React, { Component, PropTypes } from 'react';
import {verifyEmail} from '../../redux/ducks/auth';
import { connect } from 'react-redux';
import VerifyEmail from '../../components/VerifyEmail/VerifyEmail';

@connect(mapStateToProps)
export default class VerifyEmailContainer extends Component {
  componentWillMount() {
    const {dispatch, params: {verifiedToken}} = this.props;
    console.log(verifiedToken);
    dispatch(verifyEmail(verifiedToken));
  }

  render() {
    const {error, isVerified} = this.props;
    return <VerifyEmail error={error} isVerified={isVerified}/>
  }
}

function mapStateToProps(state) {
  return {
    error: state.auth.error,
    isVerified: state.auth.user.isVerified
  };
}
