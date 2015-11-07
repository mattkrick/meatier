import React, { Component, PropTypes } from 'react';
import Lanes from '../Lanes.js';
//import styles from './style.css'

export default class Kanban extends Component {
  static propTypes = {
    laneActions: PropTypes.object.isRequired,
    lanes: PropTypes.object.isRequired
    //notes: PropTypes.object.isRequired
  };
  constructor(p,c) {
    super(p, c);
  }
  render() {
    const styles = require('./style.css');
    console.log(styles);
    return (
      <div className={styles.kanban} id="kanban">
        <button className="addLane" onClick={this.props.laneActions.addLane}>
          +
        </button>
        <Lanes {...this.props}/>
      </div>
    );
  }
}


