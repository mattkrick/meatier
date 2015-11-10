import React, { Component, PropTypes } from 'react';
import Lanes from '../Lanes/Lanes.js';
import styles from './Kanban.css'

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
    return (
      <div className={styles.kanban} id="kanban">
        <h1 className={styles.title}>Meaty Kanban</h1>
        <button className={styles.addLane} onClick={this.props.laneActions.addLane}>
          Add lane
        </button>
        <Lanes {...this.props}/>
      </div>
    );
  }
}


