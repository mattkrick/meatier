/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes, Component } from 'react';
import styles from './App.css';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

//@withContext
////@withStyles(styles)
class App extends Component {

  static propTypes = {
    children: PropTypes.element.isRequired
  };

  render() {
    return (
      <div className={styles.app}>
        <Header />
        {this.props.children}
        <Footer />
      </div>
    )
  }

}

export default App;
