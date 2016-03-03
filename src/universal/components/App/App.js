import React, { PropTypes, Component } from 'react';
import styles from './App.css';

export default class App extends Component {
  render() {
    return (
      <div className={styles.app}>
        {this.props.children}
      </div>
    )
  }
}
