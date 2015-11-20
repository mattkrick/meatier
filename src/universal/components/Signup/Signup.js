import React, { Component, PropTypes } from 'react';
import TextField from 'material-ui/lib/text-field';
import RaisedButton from 'material-ui/lib/raised-button';
import styles from './Signup.css';

export default class Signup extends Component {
  static PropTypes = {
    authActions: PropTypes.object.isRequired,
    location: PropTypes.object,
    isAuthenticating: PropTypes.bool.isRequired,
    statusText: PropTypes.string
  };

  render() {
    return (
      <div className={styles.signupForm}>
        <h3>Sign up</h3>
        <form className={styles.signupForm}>
          <input style={{display:'none'}} type="text" name="chromeisabitch"/>
          <input style={{display:'none'}} type="password" name="chromeisabitch"/>

          <TextField
            type="text"
            hintText="name@email.com"
            floatingLabelText="Email"/>

          <TextField
            type="password"
            floatingLabelText="Password"
            hintText="hunter2"
          />

          <RaisedButton
            label="Sign up"
            secondary={true}
            type='submit'
            disabled={this.props.isAuthenticating}
            onClick={::this.signup}/>
        </form>
      </div>
    );
  }

  signup(e) {
    e.preventDefault();
    const redirectRoute = this.props.location.query.next || '/'; //todo fix location
    this.props.authActions.signupUser(this.refs.email.value, this.refs.password.value, redirectRoute);
  }
}
