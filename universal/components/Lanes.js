import React, {Component, PropTypes} from 'react';
import Lane from './Lane.js';

export default class Lanes extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    lanes: PropTypes.object.isRequired
    //notes: PropTypes.object.isRequired
  };

  render() {
    const {data} = this.props.lanes;

    return <div className="lanes">{data.map(this.renderLane.bind(this))}</div>;
  }

  renderLane(lane) {
    const {actions} = this.props;
    //const laneNotes = notes.filter(note => note.laneId === lane.id);
    return <Lane key={`lane${lane.id}`} lane={lane} actions={actions}/>;
  }
}
