import React, {Component, PropTypes} from 'react';
import EditableContainer from '../../containers/Editable/EditableContainer.js';
import Notes from '../Notes/Notes';
import styles from './lane.css';
import uuid from 'node-uuid';
import {getFormState} from 'universal/redux/helpers';

export default class Lane extends Component {
  static propTypes = {
    laneActions: PropTypes.object.isRequired,
    noteActions: PropTypes.object.isRequired,
    lane: PropTypes.object.isRequired,
    notes: PropTypes.array.isRequired,
    dispatch: PropTypes.func.isRequired,
    userId: PropTypes.string.isRequired
  };

  render() {
    const {laneActions:{updateLane, deleteLane}, noteActions: {addNote, ...modNoteActions},
      lane, notes, formKey, initialValues, dispatch, userId} = this.props;
    const laneId = lane.id;
    const laneProps = {dispatch, formKey, initialValues};
    const noteProps = {notes, noteActions: modNoteActions, laneId};
    return (
      <div className={styles.lane}>
        <div className={styles.header}>
          <div className={styles.delete} onClick={() => deleteLane(laneId)}>x</div>
          <EditableContainer {...laneProps}
            item={lane}
            formKey={`lane${laneId}`}
            updateItem={updateLane}
            initialValues={lane}
            fields={["title"]}
            form="laneTitleForm"
          />
          <div className={styles.addNote}>
            <button
              onClick={() => addNote({userId, title: `New note ${notes.length}`, id: uuid.v4(), laneId, index: notes.length})}>
              Add a note
            </button>
          </div>
        </div>
        <Notes {...noteProps} dispatch={dispatch}/>
      </div>
    )
  }
}
