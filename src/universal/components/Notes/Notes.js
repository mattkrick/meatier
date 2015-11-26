import React, {Component, PropTypes} from 'react';
import EditableContainer from '../../containers/Editable/EditableContainer.js';
import {NOTE} from '../../redux/ducks/notes';
import {DropTarget} from 'react-dnd';
import Note from './../Note/Note';
import styles from './Notes.css';

const noteTarget = {
  hover(inTargetProps, monitor) {
    const targetLaneId = inTargetProps.laneId;
    const {id:sourceId, laneId:sourceLaneId, onMove} = monitor.getItem();
    if (inTargetProps.notes.length > 0 || targetLaneId === sourceLaneId) return;
    onMove(sourceId, null, targetLaneId);
  }
};
@DropTarget(NOTE, noteTarget, (connect) => ({
  connectDropTarget: connect.dropTarget()
}))

export default class Notes extends Component {
  constructor(props) {
    super(props);
    this.renderNote = this.renderNote.bind(this);
  }

  render() {
    const {notes,connectDropTarget} = this.props;
    return connectDropTarget(<ul className={styles.notes}>{notes.map(this.renderNote)}</ul>);
  }

  renderNote(note, index) {
    const {updateNote, moveNote, deleteNote} = this.props.noteActions;
    return (
      <Note className={styles.note} note={note} key={`note${note.id}`} onMove={moveNote} index={index}>
        <EditableContainer item={note}
                           updateItem={updateNote}
                           dispatch={this.props.dispatch}
                           formKey={`note${note.id}`}
                           initialValue={note}
                           fields={['title']}
                           form="noteNameForm"
          />
        <div className={styles.delete} onClick={() => deleteNote({id:note.id})}>x</div>
      </Note>
    );
  }
}


