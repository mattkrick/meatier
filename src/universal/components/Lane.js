import React, {Component, PropTypes} from 'react';
import EditableContainer from '../containers/EditableContainer.js';
import Notes from './Notes';

export default class Lane extends Component {
  static propTypes = {
    laneActions: PropTypes.object.isRequired,
    noteActions: PropTypes.object.isRequired,
    lane: PropTypes.object.isRequired,
    notes: PropTypes.array.isRequired,
    dispatch: PropTypes.func.isRequired
  };

  render() {
    const {laneActions:{updateLane, deleteLane}, noteActions: {addNote, ...modNoteActions},
      lane, notes, formKey, initialValues, dispatch} = this.props;
    const laneProps = {dispatch, formKey, initialValues};
    const noteProps = {notes, noteActions: modNoteActions, laneId: lane.id};
    return (
      <div className="lane">
        <div className="lane-header">
          <EditableContainer {...laneProps}
            item={lane}
            updateItem={updateLane}
            deleteItem={deleteLane}
            fields={["laneName"]}
            form="laneNameForm"
          />
          <div className="lane-add-note">
            <button onClick={() => addNote(lane.id, notes.length)}>+</button>
          </div>
        </div>
        <Notes {...noteProps} dispatch={dispatch}/>
      </div>
    )
  }
}
