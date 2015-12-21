import FlatButton from 'material-ui/lib/flat-button';
import RaisedButton from 'material-ui/lib/raised-button';
import AppBar from 'material-ui/lib/app-bar';
import Paper from 'material-ui/lib/paper';
import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';
import styles from './Navigation.css';
import {Link} from 'react-router';
import smallLogo from './../Navigation/logo-small.png';

class Navigation extends Component {

  static propTypes = {
    className: PropTypes.string,
    isAuthenticated: PropTypes.bool.isRequired
  };

  render() {
    return (
      <Paper zDepth={0} className={styles.nav}>
        <Link to="/" className={styles.brand}>
          <img src={smallLogo} width="38" height="38" alt="React"/>
          <span>React, Redux, Rethink</span>
        </Link>
        <div className={styles.menuButtons}>
          <Link className={styles.buttonBuffer} to="/kanban">
            <FlatButton className={styles.menuButton} label="Kanban"/>
          </Link>

          <span className="spacer"> | </span>
          {this.renderAuthButtons()}
        </div>
      </Paper>
      //</div>
    );
  }

  renderAuthButtons() {
    if (this.props.isAuthenticated) {
      return (
        <Link className={styles.buttonBuffer} to="/logout">
          <FlatButton className={styles.menuButton} label="Logout"/>
        </Link>
      )
    } else {
      return (
        <span>
          <Link className={styles.buttonBuffer} to="/login">
            <FlatButton className={styles.menuButton} label="Login"/>
          </Link>
          <Link className={styles.buttonBuffer} to="/signup">
            <RaisedButton secondary={true} className={styles.menuButton} label="Sign up"/>
          </Link>
        </span>
      )
    }
  }

}

export default Navigation;
