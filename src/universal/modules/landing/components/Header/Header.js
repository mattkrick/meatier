import React, {Component} from 'react';
import {Link} from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';
import styles from './Header.css';

export default class Header extends Component {
  render() {
    return (
      <div className={styles.header}>
        <div className={styles.banner}>
          <h1 className={styles.bannerTitle}>Welcome to Meatier</h1>
          <h3 className={styles.bannerDesc}>Like Meteor, but Meatier</h3>
          <div className={styles.tryButton}>
            <Link to="/kanban">
              <RaisedButton secondary label="Try the Kanban"/>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
