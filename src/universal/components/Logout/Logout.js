import React, { Component, PropTypes } from 'react';
import {logoutAndRedirect} from '../../redux/ducks/auth';
import {delay} from '../../utils/utils';
import {connect} from 'react-redux';
//import socketCluster from 'socketcluster-client';

@connect()
export default class Logout extends Component {
  componentDidMount() {
    const {dispatch} = this.props;
    dispatch(logoutAndRedirect());
    //const socket = socketCluster.connect();
    //socket.disconnect();
  }

  render() {
    return <p>Successfully logged out</p>
  }
}
