/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';
import styles from './Navigation.css';
import {Link} from 'react-router';

class Navigation extends Component {

  static propTypes = {
    className: PropTypes.string,
    isAuthenticated: PropTypes.bool.isRequired
  };

  render() {
    return (
      <div className={classNames(this.props.className, 'Navigation')} role="navigation">
        <Link to="/kanban" className={classNames(styles.link, styles.highlight)}>Kanban</Link>
        <span className="spacer"> | </span>
        {this.renderAuthButtons()}
      </div>
    );
  }

  renderAuthButtons() {
    if (this.props.isAuthenticated) {
      return (
        <span>
          <Link to="/logout" className={classNames(styles.link, styles.highlight)}>Logout</Link>
        </span>
      )
    } else {
      return (
        <span><Link to="/login" className={classNames(styles.link, styles.highlight)}>Login</Link>
          <span className="spacer">or</span>
          <Link to="/signup" className={classNames(styles.link, styles.highlight)}>Sign up</Link>
        </span>
      )
    }
  }

}

export default Navigation;
