import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {actions as laneActions} from '../../redux/ducks/lanes.js';
import Kanban from './Kanban';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';


@DragDropContext(HTML5Backend)
@connect(mapStateToProps, mapDispatchToProps)
export default class KanbanContainer extends Component {
  static propTypes = {
    laneActions: PropTypes.object.isRequired,
    lanes: PropTypes.object.isRequired
  };

  render() {
    return <Kanban addLane={this.props.laneActions.addLane} {...this.props}/>
  }
    //return <div>Hi!</div>
}

function mapStateToProps(state) {
  return {
    lanes: state.lanes
  };
}

function mapDispatchToProps(dispatch) {
  return {
    laneActions: bindActionCreators({...laneActions}, dispatch)
  };
}
