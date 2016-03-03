import React, { PropTypes, Component } from 'react';
import pureRender from 'universal/decorators/pureRender/pureRender';
import styles from './App.css';

@pureRender
export default class App extends Component {
  render() {
    return (
      <div className={styles.app}>
        {this.props.children}
      </div>
    )
  }
}
