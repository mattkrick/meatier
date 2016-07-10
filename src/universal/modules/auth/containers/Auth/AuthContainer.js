import React, {Component, PropTypes} from 'react';
import {authSchemaInsert} from '../../schemas/auth';
import {connect} from 'react-redux';
import Auth from '../../components/Auth/Auth';
import {ensureState} from 'redux-optimistic-ui';
import meatierForm from 'universal/decorators/meatierForm/meatierForm'

// use the same form to retain form values (there's really no difference between login and signup, it's just for show)
@connect(mapStateToProps)
// must come after connect to get the path field
@meatierForm({form: 'authForm', fields: ['email', 'password'], schema: authSchemaInsert})
export default class AuthContainer extends Component {
  static propTypes = {
    location: PropTypes.object,
    isAuthenticating: PropTypes.bool,
    isAuthenticated: PropTypes.bool,
    authError: PropTypes.shape({
      _error: PropTypes.string,
      email: PropTypes.string,
      password: PropTypes.string
    }),
    pathname: PropTypes.string
  };

  render() {
    const {pathname} = this.props;
    const isLogin = pathname && pathname.indexOf('/login') !== -1;
    return <Auth isLogin={isLogin} {...this.props}/>;
  }
}

function mapStateToProps(state, props) {
  state = ensureState(state);
  const auth = state.get('auth');
  return {
    isAuthenticated: auth.get('isAuthenticated'),
    isAuthenticating: auth.get('isAuthenticating'),
    authError: auth.get('error').toJS(),
    pathname: props.location.pathname
  };
}
