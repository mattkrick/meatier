import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Kanban from 'universal/modules/kanban/components/Kanban/Kanban';
import {reduxSocket} from 'redux-socket-cluster';
import socketOptions from 'universal/utils/socketOptions';
import {loadLanes, laneActions} from 'universal/modules/kanban/ducks/lanes';
import {loadNotes} from 'universal/modules/kanban/ducks/notes';
import {ensureState} from 'redux-optimistic-ui';
import requireAuth from 'universal/decorators/requireAuth/requireAuth';

@connect(mapStateToProps, mapDispatchToProps)
@requireAuth
@reduxSocket(socketOptions)
@DragDropContext(HTML5Backend)
export default class KanbanContainer extends Component {
  static propTypes = {
    laneActions: PropTypes.object.isRequired,
    lanes: PropTypes.object.isRequired,
    userId: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
    const {dispatch, socketState} = props;
    if (socketState === 'closed') {
      // handle here & not in middleware to make it atomic, otherwise state could change between loadLanes & loadNotes
      dispatch(loadLanes());
      dispatch(loadNotes());
    }
  }

  render() {
    return <Kanban addLane={this.props.laneActions.addLane} {...this.props}/>;
  }
}

function mapStateToProps(state) {
  state = ensureState(state);
  const auth = state.get('auth');
  return {
    lanes: state.get('lanes').toJS(),
    userId: auth.getIn(['user', 'id']),
    socketState: state.getIn(['socket', 'socketState']),
    isAuthenticated: auth.get('isAuthenticated'),
    hasAuthError: Boolean(auth.get('error').size)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    laneActions: bindActionCreators({...laneActions}, dispatch),
    dispatch
  };
}
