import React, { Component, PropTypes } from 'react';
import {logoutAndRedirect} from '../../redux/ducks/auth';
import {delay} from '../../utils/utils';
import {connect} from 'react-redux';

@connect()
export default class Logout extends Component {
  componentDidMount() {
    const {dispatch} = this.props;
    console.log('logout mounted');
    dispatch(logoutAndRedirect());
  }

  render() {
    return <p>Successfully logged out</p>
  }
}
