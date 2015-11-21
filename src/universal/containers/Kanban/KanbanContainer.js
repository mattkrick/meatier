import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {laneActions} from '../../redux/ducks/lanes.js';
import Kanban from '../../components/Kanban/Kanban';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
//import liveQuery from '../../../client/liveQuery';
import {getAllLanes} from '../../redux/ducks/lanes';
import socketCluster from 'socketcluster-client';
//import {getState} from '../../../server/databaseQueries';


@DragDropContext(HTML5Backend)
@connect(mapStateToProps, mapDispatchToProps)

export default class KanbanContainer extends Component {
  static contextTypes = {
    store: React.PropTypes.object.isRequired
  };

  static propTypes = {
    laneActions: PropTypes.object.isRequired,
    lanes: PropTypes.object.isRequired
  };

  constructor(props, context) {
    super(props, context);
  }

  componentWillMount() {
    const store = this.context.store;
    //store.dispatch()
    store.dispatch(getAllLanes());
    const socket = socketCluster.connect();
    socket.on('connect', function () {
      console.log('CONNECTED');
    });
    socket.emit('here i be bitches');
    //liveQuery(store);
    //const subs = ['lanes'];
    //debugger;
    //getState()
    //  .then(initialTables => {
    //    subs.forEach((sub, idx) => {
    //      store.dispatch(this.props.laneActions.loadDoc(initialTables[idx]))
    //    })
    //  })
  }

  render() {
    return <Kanban addLane={this.props.laneActions.addDoc} {...this.props}/>
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
