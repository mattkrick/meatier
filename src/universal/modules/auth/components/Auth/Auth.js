import React, {Component, PropTypes} from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import styles from './Auth.css';
import {Link} from 'react-router';
import {loginUser, signupUser, oauthLogin} from '../../ducks/auth';

export default class Auth extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    error: PropTypes.any,
    handleSubmit: PropTypes.func,
    submitting: PropTypes.bool,
    params: PropTypes.shape({
      resetToken: PropTypes.string
    }),
    location: PropTypes.shape({
      query: PropTypes.shape({
        e: PropTypes.string,
        next: PropTypes.string
      })
    }),
    isAuthenticating: PropTypes.bool,
    isLogin: PropTypes.bool,
    authError: PropTypes.shape({
      _error: PropTypes.string,
      email: PropTypes.string,
      password: PropTypes.string
    }),
    dispatch: PropTypes.func.isRequired
  }

  render() {
    const {fields: {email, password}, handleSubmit, isLogin, error, isAuthenticating, authError} = this.props;
    const localError = error || authError._error;
    /* eslint-disable react/jsx-handler-names*/
    return (
      <div className={styles.loginForm}>
        <h3>{isLogin ? 'Login' : 'Sign up'}</h3>
        {localError && <span>{localError}</span>}
        <form className={styles.loginForm} onSubmit={handleSubmit(this.onSubmit)}>
          <input style={{display: 'none'}} type="text" name="chromeisabitch"/>

          <TextField
            {...email}
            type="text"
            hintText="name@email.com"
            errorText={email.touched && email.error || ''}
            floatingLabelText="Email"
          />
          <input style={{display: 'none'}} type="text" name="chromeisabitch"/>

          <TextField
            {...password}
            type="password"
            floatingLabelText="Password"
            hintText="hunter2"
            errorText={password.touched && password.error || ''}
          />

          {isLogin ?
            <Link to={{pathname: '/login/lost-password', query: {e: email.value}}} className={styles.lostPassword}>
              Forgot your password?
            </Link> : null}

          <div className={styles.loginButton}>
            <RaisedButton
              label={isLogin ? 'Login' : 'Sign up'}
              secondary
              type="submit"
              disabled={isAuthenticating}
              onClick={handleSubmit(this.onSubmit)}
            />

          </div>
        </form>
        <div className={styles.hrWithText}>
          <span className={styles.hrText}>or</span>
        </div>
        <span onClick={this.loginWithGoogle}>Login with Google</span>
      </div>
    );
  }
  // need async?
  loginWithGoogle = () => {
    const redirectRoute = this.props.location.query.next || '/';
    this.props.dispatch(oauthLogin('/auth/google', redirectRoute));
  };

  onSubmit = (data, dispatch) => {
    // gotta get that redirect from props
    const redirectRoute = this.props.location.query.next || '/';
    const authFunc = this.props.isLogin ? loginUser : signupUser;
    return authFunc(dispatch, data, redirectRoute);
  };
}
