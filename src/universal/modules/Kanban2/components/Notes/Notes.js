import React, {Component, PropTypes} from 'react';
import EditableContainer from '../../containers/Editable/EditableContainer.js';
import {NOTE} from 'universal/modules/kanban/ducks/notes';
import {DropTarget} from 'react-dnd';
import Note from '../Note/Note';
import styles from './Notes.css';

const noteTarget = {
  hover(inTargetProps, monitor) {
    const targetLaneId = inTargetProps.laneId;
    const {id:sourceId, index: sourceIndex, laneId:sourceLaneId, onMove} = monitor.getItem();
    if (inTargetProps.notes.length > 0 || targetLaneId === sourceLaneId) return;
    onMove({
      sourceId,
      sourceIndex,
      sourceLaneId,
      targetIndex: 0,
      targetLaneId,
      monitor
    });
  }
};
@DropTarget(NOTE, noteTarget, (connect) => ({
  connectDropTarget: connect.dropTarget()
}))

export default class Notes extends Component {

  render() {
    const {notes,connectDropTarget} = this.props;
    const sortedNotes = notes.sort((a,b) => a.index - b.index);
    return connectDropTarget(<ul className={styles.notes}>{sortedNotes.map(this.renderNote)}</ul>);
  };

  renderNote = (note, index) => {
    const {updateNote, dragNote, deleteNote} = this.props.noteActions;
    return (
      <Note className={styles.note} note={note} key={`note${note.id}`} onMove={dragNote} updateNote={updateNote} index={index}>
        <EditableContainer item={note}
                           updateItem={updateNote}
                           dispatch={this.props.dispatch}
                           formKey={`note${note.id}`}
                           initialValue={note}
                           fields={['title']}
                           form="noteNameForm"
          />
        <div className={styles.delete} onClick={() => deleteNote(note.id)}>x</div>
      </Note>
    );
  };
}


