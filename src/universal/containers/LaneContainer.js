import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {actions as noteActions} from '../redux/ducks/notes.js';
import Lane from '../components/Lane.js';
//import {createSelector} from 'reselect'; //TODO

@connect(mapStateToProps, mapDispatchToProps)
export default class LaneContainer extends Component {
  static propTypes = {
    laneActions: PropTypes.object.isRequired,
    lane: PropTypes.object.isRequired,
    notes: PropTypes.array.isRequired,
    noteActions: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  };

  render() {
    return <Lane {...this.props}/>
  }
}

function mapStateToProps(state, props) {
  return {
    notes: state.notes.data.filter(note => note.laneId === props.lane.id)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    noteActions: bindActionCreators({...noteActions}, dispatch),
    dispatch
  };
}
