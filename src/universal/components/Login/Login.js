import React, { Component, PropTypes } from 'react';
import TextField from 'material-ui/lib/text-field';
import RaisedButton from 'material-ui/lib/raised-button';
import styles from './Login.css';

export default class Login extends Component {
  static PropTypes = {
    authActions: PropTypes.object.isRequired,
    location: PropTypes.object,
    isAuthenticating: PropTypes.bool.isRequired,
    error: PropTypes.string,
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired
  };

  render() {
    const {fields: {email, password}, handleSubmit} = this.props;
    return (
      <div className={styles.loginForm}>
        <h3>Login</h3>
        <span>{this.props.error}</span>
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
              label="Log in"
              secondary={true}
              type='submit'
              disabled={this.props.isAuthenticating}
              onClick={handleSubmit(::this.onSubmit)}
            />
          </div>
        </form>
      </div>
    );
  }

  onSubmit(data) {
    const redirectRoute = this.props.location.query.next || '/'; //todo fix location
    this.props.authActions.loginUser(data.email, data.password, redirectRoute);
  }
}
