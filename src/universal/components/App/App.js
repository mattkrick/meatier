import React, {PropTypes, Component} from 'react';
import styles from './App.css';

export default class App extends Component {
  static propTypes = {
    children: PropTypes.any
  }

  render() {
    return (
      <div className={styles.app}>
        {this.props.children}
      </div>
    );
  }
}
