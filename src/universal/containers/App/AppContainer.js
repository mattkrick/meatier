import React, { PropTypes, Component } from 'react';
import pureRender from 'universal/decorators/pureRender/pureRender';
import App from '../../components/App/App';
import injectTapeEventPlugin from 'react-tap-event-plugin';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import socketOptions from 'universal/utils/socketOptions';
import loginWithToken from '../../decorators/loginWithToken/loginWithToken';
import {ensureState} from 'redux-optimistic-ui';

injectTapeEventPlugin();
@connect(mapStateToProps)
@loginWithToken(socketOptions.authTokenName)
@pureRender
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
