import React, {Component, PropTypes} from 'react';

export default class Lanes extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    lane: PropTypes.object.isRequired
    //notes: PropTypes.object.isRequired
  };

  render() {
    return <div>{this.props.lane.id} (client)</div>;
  }
}
