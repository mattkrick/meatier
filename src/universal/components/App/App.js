import React, { PropTypes, Component } from 'react';
import pureRender from 'universal/decorators/pureRender/pureRender';
import styles from './App.css';

@pureRender
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
