import React, {Component} from 'react';
import {logoutAndRedirect} from '../../ducks/auth';
import {connect} from 'react-redux';

@connect()
export default class Logout extends Component {
  componentDidMount() {
    const {dispatch} = this.props;
    dispatch(logoutAndRedirect());
  }

  render() {
    return <p>Successfully logged out</p>;
  }
}
