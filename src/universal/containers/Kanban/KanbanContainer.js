import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {laneActions} from '../../redux/ducks/lanes.js';
import Kanban from '../../components/Kanban/Kanban';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
//import {loadLanes} from '../../redux/ducks/lanes';
import socketCluster from 'socketcluster-client';
import {reduxSocket} from '../../redux-socket-cluster';
import qs from 'query-string';
import socketOptions from '../../utils/socketOptions';

@DragDropContext(HTML5Backend)
@connect(mapStateToProps, mapDispatchToProps)
@reduxSocket(socketOptions)
export default class KanbanContainer extends Component {
  //static contextTypes = {
  //  store: React.PropTypes.object.isRequired
  //};

  static propTypes = {
    laneActions: PropTypes.object.isRequired,
    lanes: PropTypes.object.isRequired,
    userId: PropTypes.string.isRequired
  };

  //constructor(props, context) {
  //  super(props, context);
  //}

  componentWillMount() {
    this.props.laneActions.loadLanes();
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
    laneActions: bindActionCreators({...laneActions}, dispatch)
  };
}
