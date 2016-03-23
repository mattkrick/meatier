import React, {Component} from 'react';
import styles from './ResetPasswordSuccess.css';

export default class ResetPasswordSuccess extends Component {
  render() {
    return (
      <div className={styles.form}>
        <h3>Password successfully reset</h3>
        <span className={styles.instructions}>Your password has been reset and you are now logged in</span>
      </div>
    );
  }
}
