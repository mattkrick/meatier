import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import Kanban from '../../components/Kanban/Kanban';
import {reduxSocket} from '../../redux-socket-cluster';
import socketOptions from '../../utils/socketOptions';
import {loadLanes, laneActions} from '../../redux/ducks/lanes';
import {loadNotes} from '../../redux/ducks/notes';

@DragDropContext(HTML5Backend)
@connect(mapStateToProps, mapDispatchToProps)
@reduxSocket(socketOptions)
export default class KanbanContainer extends Component {

  static propTypes = {
    laneActions: PropTypes.object.isRequired,
    lanes: PropTypes.object.isRequired,
    userId: PropTypes.string.isRequired
  };

  componentWillMount() {
    const {dispatch} = this.props;
    dispatch(loadLanes());
    dispatch(loadNotes());
  }

  render() {
    return <Kanban addLane={this.props.laneActions.addLane} {...this.props}/>
  }
}

function mapStateToProps(state) {
  return {
    lanes: state.lanes,
    userId: state.auth.user.id
  };
}

function mapDispatchToProps(dispatch) {
  return {
    laneActions: bindActionCreators({...laneActions}, dispatch),
    dispatch
  };
}
