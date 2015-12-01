import React, { Component, PropTypes } from 'react';
import styles from './VerifyEmail.css';

export default class VerifyEmail extends Component {
  render() {
    const {error, isVerified} = this.props;
    let status;
    if (error && error._error) {
      status = `There was an error verifying your email: ${error._error}`
    } else {
      if (isVerified) {
        status = 'Your email has been verified. Thank you!'
      } else {
        status = 'Your email is currently being verified...'
      }
    }

    return (
      <div className={styles.form}>
        <h3>Verifying Email</h3>
        <span className={styles.instructions}>{status}</span>
      </div>
    );
  }
}
