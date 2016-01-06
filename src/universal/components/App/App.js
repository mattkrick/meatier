import React, { PropTypes, Component } from 'react';
import styles from './App.css';

import Footer from '../Footer/Footer';
import injectTapeEventPlugin from 'react-tap-event-plugin';
import Navigation from '../Navigation/Navigation';

export default class App extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    isAuthenticated: PropTypes.bool.isRequired
  };
  render() {
    const maxWidth = __PRODUCTION__ ? '100%' : '1000px';
    const {isAuthenticated, children} = this.props;
    return (
      <div className={styles.app} style={{maxWidth}}>
        <Navigation className={styles.nav} isAuthenticated={isAuthenticated}/>
        <div className={styles.component}>
          {children}
        </div>
        <Footer />
      </div>
    )
  }
}
