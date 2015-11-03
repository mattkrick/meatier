import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {actions as laneActions} from '../redux/ducks/lanes.js';
//import {actions as noteActions} from '../redux/ducks/notes.js';
import Kanban from '../components/Kanban.js';


@connect(mapStateToProps, mapDispatchToProps)
export default class KanbanContainer extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    lanes: PropTypes.object.isRequired
    //notes: PropTypes.object.isRequired
  };

  render() {
    const {actions, lanes, notes} = this.props;
    return <Kanban addLane={actions.addLane} lanes={lanes} actions={actions}/>
  }
}

function mapStateToProps(state) {
  return {
    lanes: state.lanes,
    notes: state.notes
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({...laneActions}, dispatch)
  };
}
