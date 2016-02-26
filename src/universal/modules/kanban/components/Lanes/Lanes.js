import React, {Component, PropTypes} from 'react';
import pureRender from 'universal/decorators/pureRender/pureRender';
import LaneContainer from '../../containers/Lane/LaneContainer.js';

@pureRender
export default class Lanes extends Component {
  static propTypes = {
    laneActions: PropTypes.object.isRequired,
    lanes: PropTypes.object.isRequired
  };
  render() {
    const {data} = this.props.lanes;
    return <div className="lanes">{data.map(this.renderLane)}</div>;
  };

  renderLane = (lane) => {
    const {laneActions, userId} = this.props;
    return <LaneContainer key={`lane${lane.id}`} lane={lane} userId={userId} laneActions={laneActions}/>;
  };
}
