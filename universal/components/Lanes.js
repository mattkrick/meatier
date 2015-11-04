import React, {Component, PropTypes} from 'react';
import LaneContainer from '../containers/LaneContainer.js';

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
    return <LaneContainer key={`lane${lane.id}`} formKey={`lane${lane.id}`} initialValues={lane} lane={lane} actions={actions}/>;
  }
}
