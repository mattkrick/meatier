import React, { PropTypes, Component } from 'react';
import App from '../../components/App/App';
import injectTapeEventPlugin from 'react-tap-event-plugin';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {loginToken} from '../../redux/ducks/auth';

injectTapeEventPlugin();
@connect(mapStateToProps)
export default class AppContainer extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    dispatch: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired
  };

  componentWillMount() {
    let token = localStorage.getItem('Meatier.token');
    if (token) {
      this.props.dispatch(loginToken(token));
    }
  }

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
