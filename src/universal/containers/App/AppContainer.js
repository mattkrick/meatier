import React, { PropTypes, Component } from 'react';
import App from '../../components/App/App';
import injectTapeEventPlugin from 'react-tap-event-plugin';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import socketOptions from '../../utils/socketOptions';
import loginWithToken from '../../decorators/loginWithToken/loginWithToken';

injectTapeEventPlugin();
@connect(mapStateToProps)
@loginWithToken(socketOptions.authTokenName)
export default class AppContainer extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    dispatch: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired
  };

  render() {
    return <App {...this.props}/>
  }
}

function mapStateToProps(state) {
  const {auth: {isAuthenticated}} = state;
  return {
    isAuthenticated
  }
}
