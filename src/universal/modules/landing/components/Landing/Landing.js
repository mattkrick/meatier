import React, { PropTypes, Component } from 'react';
import styles from './Landing.css';

import Footer from 'universal/components/Footer/Footer';
import Navigation from 'universal/components/Navigation/Navigation';

export default class Landing extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    isAuthenticated: PropTypes.bool.isRequired
  };
  render() {
    const {isAuthenticated, children} = this.props;
    return (
      <div>
        <Navigation isAuthenticated={isAuthenticated}/>
        <div className={styles.component}>
          {children}
        </div>
        <Footer />
      </div>
    )
  }
}
