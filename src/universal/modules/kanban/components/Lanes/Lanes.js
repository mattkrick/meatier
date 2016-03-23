import React, {Component, PropTypes} from 'react';
import LaneContainer from '../../containers/Lane/LaneContainer.js';

export default class Lanes extends Component {
  static propTypes = {
    laneActions: PropTypes.object.isRequired,
    lanes: PropTypes.object.isRequired,
    userId: PropTypes.string
  };
  render() {
    const {data} = this.props.lanes;
    return <div className="lanes">{data.map(this.renderLane)}</div>;
  }

  renderLane = lane => {
    const {laneActions, userId} = this.props;
    return <LaneContainer key={`lane${lane.id}`} lane={lane} userId={userId} laneActions={laneActions}/>;
  };
}
