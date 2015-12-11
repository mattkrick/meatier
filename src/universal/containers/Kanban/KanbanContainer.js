import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import Kanban from '../../components/Kanban/Kanban';
import {reduxSocket} from 'redux-socket-cluster';
import socketOptions from '../../utils/socketOptions';
import socket from '../../utils/socket';
import {loadLanes, laneActions} from '../../redux/ducks/lanes';
import {loadNotes} from '../../redux/ducks/notes';

@DragDropContext(HTML5Backend)
@connect(mapStateToProps, mapDispatchToProps)
@reduxSocket(socket)
export default class KanbanContainer extends Component {
  static propTypes = {
    laneActions: PropTypes.object.isRequired,
    lanes: PropTypes.object.isRequired,
    userId: PropTypes.string.isRequired
  };

  componentWillMount() {
    const {dispatch, socketState} = this.props;
    if (socketState === 'closed') {
      //handle here & not in middleware to make it atomic, otherwise state could change between loadLanes & loadNotes
      dispatch(loadLanes());
      dispatch(loadNotes());
    }
  }

  render() {
    return <Kanban addLane={this.props.laneActions.addLane} {...this.props}/>
  }
}

function mapStateToProps(state) {
  return {
    lanes: state.lanes,
    userId: state.auth.user.id,
    socketState: state.socket.state
  };
}

function mapDispatchToProps(dispatch) {
  return {
    laneActions: bindActionCreators({...laneActions}, dispatch),
    dispatch
  };
}
