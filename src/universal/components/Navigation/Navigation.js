import Button from 'react-toolbox/lib/button';
import AppBar from 'react-toolbox/lib/app_bar';
import React, { PropTypes, Component } from 'react';
import styles from './Navigation.css';
import {Link} from 'react-router';
import smallLogo from './../Navigation/logo-small.png';

export default class Navigation extends Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired
  };

  render() {
    return (
      <AppBar className={styles.nav}>
        <Link to="/" className={styles.brand}>
          <img src={smallLogo} width="38" height="38" alt="React"/>
          <span>React, Redux, Rethink</span>
        </Link>
        <div className={styles.menuButtons}>
          <Link className={styles.buttonBuffer} to="/kanban">
            <Button flat={true} className={styles.menuButton} label="Kanban"/>
          </Link>

          <span className="spacer"> | </span>
          {this.props.isAuthenticated ? this.renderLoggedIn() : this.renderLoggedOut()}
        </div>
      </AppBar>
    );
  }

  renderLoggedIn() {
    return (
      <Link className={styles.buttonBuffer} to="/logout">
        <Button flat={true} className={styles.menuButton} label="Logout"/>
      </Link>
    )
  }

  renderLoggedOut() {
    return (
      <span>
          <Link className={styles.buttonBuffer} to="/login">
            <Button flat={true} className={styles.menuButton} label="Login"/>
          </Link>
          <Link className={styles.buttonBuffer} to="/signup">
            <Button raised={true} primary={true} className={styles.menuButton} label="Sign up"/>
          </Link>
        </span>
    )
  }
}
