import React, { PropTypes, Component } from 'react';
import App from '../../components/App/App';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import socketOptions from 'universal/utils/socketOptions';
import loginWithToken from '../../decorators/loginWithToken/loginWithToken';
import {ensureState} from 'redux-optimistic-ui';
import 'react-toolbox/lib/commons.scss';

@connect(mapStateToProps)
@loginWithToken(socketOptions.authTokenName)
export default class AppContainer extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    isAuthenticated: PropTypes.bool.isRequired
  };

  render() {
    return <App {...this.props}/>
  }
}

function mapStateToProps(state) {
  return {
    isAuthenticated: ensureState(state).getIn(['auth', 'isAuthenticated'])
  }
}
