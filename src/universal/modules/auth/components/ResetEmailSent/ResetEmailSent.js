import React, {Component} from 'react';
import styles from './ResetEmailSent.css';

export default class ResetEmailSent extends Component {
  render() {
    return (
      <div className={styles.resetEmailForm}>
        <h3>Reset Email Sent</h3>
        <span className={styles.instructions}>Please check your inbox for directions on resetting your password</span>
      </div>
    );
  }
}
