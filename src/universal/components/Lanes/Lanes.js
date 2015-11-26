import React, {Component, PropTypes} from 'react';
import LaneContainer from '../../containers/Lane/LaneContainer.js';

export default class Lanes extends Component {
  static propTypes = {
    laneActions: PropTypes.object.isRequired,
    lanes: PropTypes.object.isRequired
  };
  constructor(props) {
    super(props);
    this.renderLane = this.renderLane.bind(this);
  }
  render() {
    const {data} = this.props.lanes;
    return <div className="lanes">{data.map(this.renderLane)}</div>;
  }

  renderLane(lane) {
    const {laneActions} = this.props;
    return <LaneContainer key={`lane${lane.id}`} formKey={`lane${lane.id}`} initialValues={lane} lane={lane}
                          laneActions={laneActions}/>;
  }
}
