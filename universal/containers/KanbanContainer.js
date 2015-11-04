import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {actions as laneActions} from '../redux/ducks/lanes.js';
import Kanban from '../components/Kanban.js';


@connect(mapStateToProps, mapDispatchToProps)
export default class KanbanContainer extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    lanes: PropTypes.object.isRequired
  };

  render() {
    return <Kanban addLane={this.props.actions.addLane} {...this.props}/>
  }
}

function mapStateToProps(state) {
  return {
    lanes: state.lanes
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({...laneActions}, dispatch)
  };
}
