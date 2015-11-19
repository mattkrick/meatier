import React, { Component, PropTypes } from 'react';
import TextField from '../../../../node_modules/material-ui/lib/text-field';
import styles from './Auth.css';

export default class Auth extends Component {
  static PropTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired
  };

  render() {
    const {fields: {email, password}} = this.props;
    return (
      <div className={styles.loginForm}>
        <h3>Login</h3>
        <form className={styles.loginForm}>
          <input style={{display:'none'}} type="text" name="chromeisabitch"/>

          <TextField {...email}
            type="text"
            hintText="name@email.com"
            errorText={email.touched && email.error || ''}
            floatingLabelText="Email"/>
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
              onClick={::this.login}/>
          </div>
        </form>
      </div>
    );
  }

  login(e) {
    e.preventDefault();
    const redirectRoute = this.props.location.query.next || '/'; //todo fix location
    //this.props.authActions.loginUser(this.refs.email.value, this.refs.password.value, redirectRoute);
  }
}
