import React, {PropTypes, Component} from 'react';
import {DropTarget} from 'react-dnd';

import {NOTE} from 'universal/modules/kanban/ducks/notes';
import EditableContainer from 'universal/modules/kanban/containers/Editable/EditableContainer.js';
import Note from 'universal/modules/kanban/components/Note/Note';
import styles from './Notes.css';

const noteTarget = {
  hover(inTargetProps, monitor) {
    const targetLaneId = inTargetProps.laneId;
    const {id: sourceId, index: sourceIndex, laneId: sourceLaneId, onMove} = monitor.getItem();
    if (inTargetProps.notes.length > 0 || targetLaneId === sourceLaneId) {
      return;
    }
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
@DropTarget(NOTE, noteTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))

export default class Notes extends Component {
  static propTypes = {
    connectDropTarget: PropTypes.any,
    dispatch: PropTypes.func.isRequired,
    notes: PropTypes.array,
    noteActions: PropTypes.shape({
      updateNote: PropTypes.func,
      dragNote: PropTypes.func,
      deleteNote: PropTypes.func
    })
  }

  render() {
    const {notes, connectDropTarget} = this.props;
    const sortedNotes = notes.sort((a, b) => a.index - b.index);
    return connectDropTarget(<ul className={styles.notes}>{sortedNotes.map(this.renderNote)}</ul>);
  }

  renderNote = (note, index) => {
    const {updateNote, dragNote, deleteNote} = this.props.noteActions;
    /* eslint-disable react/jsx-no-bind*/
    return (
      <Note className={styles.note} note={note} key={`note${note.id}`} onMove={dragNote} updateNote={updateNote} index={index}>
        <EditableContainer
          item={note}
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
