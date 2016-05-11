import React, {PropTypes, Component} from 'react';
import App from '../../components/App/App';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {connect} from 'react-redux';
import socketOptions from 'universal/utils/socketOptions';
import loginWithToken from '../../decorators/loginWithToken/loginWithToken';
import {ensureState} from 'redux-optimistic-ui';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

injectTapEventPlugin();
@connect(mapStateToProps)
@loginWithToken(socketOptions.authTokenName)
export default class AppContainer extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    isAuthenticated: PropTypes.bool.isRequired
  };

  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme()}>
        <App {...this.props}/>
      </MuiThemeProvider>
    );
  }
}

function mapStateToProps(state) {
  return {
    isAuthenticated: ensureState(state).getIn(['auth', 'isAuthenticated'])
  };
}
