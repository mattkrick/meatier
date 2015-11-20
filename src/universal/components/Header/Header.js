import React, { Component, PropTypes } from 'react';
import styles from './Header.css';
import Navigation from '../Navigation/Navigation';
import smallLogo from './logo-small.png';
import {Link} from 'react-router';

class Header extends Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired
  };
  render() {
    return (
      <div className={styles.header}>
        <div className={styles.container}>
          <Link to="/" className={styles.brand}>
            <img className={styles.brandImg} src={smallLogo} width="38" height="38" alt="React"/>
            <span className={styles.brandTxt}>React, Redux, Rethink</span>
          </Link>
          <Navigation className={styles.nav} isAuthenticated={this.props.isAuthenticated}/>
          <div className={styles.banner}>
            <h1 className={styles.bannerTitle}>Meatier</h1>
            <p className={styles.bannerDesc}>Like Meteor, but Meatier</p>
          </div>
        </div>
      </div>
    );
  }

}

export default Header;
