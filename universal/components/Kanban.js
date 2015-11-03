import React, { Component, PropTypes } from 'react';
import Lanes from '../components/Lanes.js';

export default class Kanban extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    lanes: PropTypes.object.isRequired
    //notes: PropTypes.object.isRequired
  };

  render() {
    return (
      <div id="kanban">
        <button className="addLane" onClick={this.props.actions.addLane}>
          +
        </button>
        <Lanes {...this.props}/>
      </div>
    );
  }
}
