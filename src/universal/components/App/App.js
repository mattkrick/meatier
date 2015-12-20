import React, { PropTypes, Component } from 'react';
import styles from './App.css';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import injectTapeEventPlugin from 'react-tap-event-plugin';

export default class App extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    isAuthenticated: PropTypes.bool.isRequired
  };

  render() {
    const {isAuthenticated, children} = this.props;
    return (
      <div className={styles.app}>
        <Header isAuthenticated={isAuthenticated}/>
        <div className={styles.component}>
          {children}
        </div>
        <Footer />
      </div>
    )
  }
}
