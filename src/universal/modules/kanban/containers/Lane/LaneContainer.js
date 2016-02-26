import React, { Component, PropTypes } from 'react';
import pureRender from 'universal/decorators/pureRender/pureRender';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {noteActions} from 'universal/modules/kanban/ducks/notes.js';
import Lane from 'universal/modules/kanban/components/Lane/Lane';
import {List} from 'immutable';
import {ensureState} from 'redux-optimistic-ui';

@pureRender
@connect(mapStateToProps, mapDispatchToProps)
export default class LaneContainer extends Component {
  static propTypes = {
    laneActions: PropTypes.object.isRequired,
    lane: PropTypes.object.isRequired,
    notes: PropTypes.array.isRequired,
    noteActions: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    userId: PropTypes.string.isRequired
  };
  render() {
    return <Lane {...this.props}/>
  }
}

function mapStateToProps(state, props) {
  //TODO implement reselctor here as an example
  return {
    notes: ensureState(state).getIn(['notes','data']).toJS().filter(note => note.laneId === props.lane.id)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    noteActions: bindActionCreators({...noteActions}, dispatch),
    dispatch
  };
}
