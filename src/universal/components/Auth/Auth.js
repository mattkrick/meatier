import React, { Component, PropTypes } from 'react';
import TextField from 'material-ui/lib/text-field';
import RaisedButton from 'material-ui/lib/raised-button';
import styles from './Auth.css';

export default class Auth extends Component {
  static PropTypes = {
    location: PropTypes.object,
    isAuthenticating: PropTypes.bool.isRequired,
    authError: PropTypes.string,
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    authType: PropTypes.string.isRequired,
    authFunc: PropTypes.func.isRequired
  };

  render() {
    const {fields: {email, password}, handleSubmit, authType, isAuthenticating} = this.props;
    return (
      <div className={styles.loginForm}>
        <h3>{authType}</h3>
        <span>{this.props.authError}</span>
        <form className={styles.loginForm} onSubmit={handleSubmit(::this.onSubmit)}>
          <input style={{display:'none'}} type="text" name="chromeisabitch"/>

          <TextField {...email}
            type="text"
            hintText="name@email.com"
            errorText={email.touched && email.error || ''}
            floatingLabelText="Email"
          />
          <input style={{display:'none'}} type="text" name="chromeisabitch"/>

          <TextField {...password}
            type="password"
            floatingLabelText="Password"
            hintText="hunter2"
            errorText={password.touched && password.error || ''}
          />

          <div className={styles.loginButton}>
            <RaisedButton
              label={authType}
              secondary={true}
              type='submit'
              disabled={isAuthenticating}
              onClick={handleSubmit(::this.onSubmit)}
            />
          </div>
        </form>
      </div>
    );
  }

  onSubmit(data) {
    //auth substate handles the error, so we don't need to use a promise here & pass it through reduxform
    const redirectRoute = this.props.location.query.next || '/'; //todo fix location
    this.props.authFunc(data.email, data.password, redirectRoute);
  }
}
