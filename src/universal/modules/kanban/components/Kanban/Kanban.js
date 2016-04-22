import React, {Component, PropTypes} from 'react';
import uuid from 'node-uuid';

import Lanes from '../Lanes/Lanes.js';
import styles from './Kanban.css';

export default class Kanban extends Component {
  static propTypes = {
    laneActions: PropTypes.object.isRequired,
    lanes: PropTypes.object.isRequired,
    userId: PropTypes.string
  };

  render() {
    const {userId, laneActions: {addLane}} = this.props;
    /* eslint-disable react/jsx-no-bind*/
    return (
      <div className={styles.kanban} id="kanban">
        <h1 className={styles.title}>Meaty Kanban</h1>
        <button
          className={styles.addLane}
          onClick={() => addLane({id: uuid.v4(), userId, isPrivate: false, title: 'New lane'})}>
          Add lane
        </button>
        <Lanes {...this.props}/>
      </div>
    );
  }
}
