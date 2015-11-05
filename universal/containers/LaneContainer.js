import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {actions as noteActions} from '../redux/ducks/notes.js';
import Lane from '../components/Lane.js';
//import {createSelector} from 'reselect';

@connect(mapStateToProps, mapDispatchToProps)
export default class LaneContainer extends Component {
  //constructor(props) {
    //this.setState
  //}
  static propTypes = {
    actions: PropTypes.object.isRequired,
    lane: PropTypes.object.isRequired,
    notes: PropTypes.array.isRequired
  };

  render() {
    //console.log('notes:', this.props.notes);
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
