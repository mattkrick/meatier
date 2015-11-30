/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes, Component } from 'react';
import styles from './Footer.css';
import {Link} from 'react-router';

class Footer extends Component {

  render() {
    return (
      <div className={styles.Footer}>
        <div className={styles.container}>
          <span className={styles.text}>© Meatier</span>
          <span className={styles.spacer}>·</span>
          <Link to="/" className={styles.link}>Home</Link>
          <span className={styles.spacer}>·</span>
          <Link to="/" className={styles.link}>Privacy</Link>
          <span className={styles.spacer}>·</span>
          <Link to="/not-found" className={styles.link}>Not found</Link>
        </div>
      </div>
    );
  }

}

export default Footer;
