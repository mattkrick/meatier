import React, { PropTypes, Component } from 'react';
import styles from './App.css';

export default class App extends Component {
  render() {
    const maxWidth = __PRODUCTION__ ? '100%' : '1000px';
    return (
      <div className={styles.app} style={{maxWidth}}>
        {this.props.children}
      </div>
    )
  }
}
