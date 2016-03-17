import React, { Component, PropTypes } from 'react';
import Input from 'react-toolbox/lib/input';
import Button from 'react-toolbox/lib/button';
import styles from './Auth.css';
import {Link} from 'react-router';
import {loginUser, signupUser, oauthLogin} from '../..//ducks/auth';
import {getJSON} from 'universal/utils/fetching';

export default class Auth extends Component {
  static PropTypes = {
    location: PropTypes.object,
    isAuthenticating: PropTypes.bool.isRequired,
    authError: PropTypes.shape({
      _error: PropTypes.string.isRequired,
      email: PropTypes.string,
      password: PropTypes.string
    }),
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired
  };

  render() {
    const {fields: {email, password}, handleSubmit, isLogin, error, isAuthenticating, authError} = this.props;
    const localError = error || authError._error;
    return (
      <div className={styles.loginForm}>
        <h3>{isLogin ? 'Login' : 'Sign up'}</h3>
        {localError && <span>{localError}</span>}
        <form className={styles.loginForm} onSubmit={handleSubmit(this.onSubmit)}>
          <input style={{display:'none'}} type="text" name="chromeisabitch"/>

          <Input {...email}
            type="text"
            hint="name@email.com"
            error={ email.touched && email.error || ''}
            label="Email"
          />
          <input style={{display:'none'}} type="text" name="chromeisabitch"/>

          <Input {...password}
            type="password"
            label="Password"
            hint="hunter2"
            error={ password.touched && password.error || ''}
          />

          {isLogin ?
            <Link to={{pathname: "/login/lost-password", query: {e:email.value}}} className={styles.lostPassword}>
              Forgot your password?
            </Link> : null}

          <div className={styles.loginButton}>
            <Button
              label={isLogin ? 'Login' : 'Sign up'}
              primary={true}
              type='submit'
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
  //need async?
  loginWithGoogle = () => {
    const redirectRoute = this.props.location.query.next || '/';
    this.props.dispatch(oauthLogin('/auth/google', redirectRoute));
  };

  onSubmit = (data, dispatch) => {
    //gotta get that redirect from props
    const redirectRoute = this.props.location.query.next || '/';
    const authFunc = this.props.isLogin ? loginUser : signupUser;
    return authFunc(dispatch, data, redirectRoute);
  };
}
