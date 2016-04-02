import React, {PropTypes, Component} from 'react';
import styles from './VerifyEmail.css';

export default class VerifyEmail extends Component {
  static propTypes = {
    error: PropTypes.any,
    isVerified: PropTypes.bool
  }

  render() {
    const {error, isVerified} = this.props;
    let status;
    if (error && error._error) {
      status = `There was an error verifying your email: ${error._error}`;
    } else {
      status = isVerified ? 'Your email has been verified. Thank you!' : 'Your email is currently being verified...';
    }

    return (
      <div className={styles.form}>
        <h3>Verifying Email</h3>
        <span className={styles.instructions}>{status}</span>
      </div>
    );
  }
}
