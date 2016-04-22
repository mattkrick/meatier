import {Note, NewNote, UpdatedNote} from './noteSchema';
import {errorObj} from '../utils';
import {isLoggedIn} from '../authorization';
import {GraphQLNonNull, GraphQLBoolean, GraphQLID} from 'graphql';
import r from '../../../database/rethinkdriver';

export default {
  addNote: {
    type: Note,
    args: {
      note: {type: new GraphQLNonNull(NewNote)}
    },
    async resolve(source, {note}, {authToken}) {
      isLoggedIn(authToken);
      note.createdAt = new Date();
      const newNote = await r.table('notes').insert(note, {returnChanges: true});
      if (newNote.errors) {
        throw errorObj({_error: 'Could not add note'});
      }
      return newNote.changes[0].new_val;
    }
  },
  updateNote: {
    type: Note,
    args: {
      note: {type: new GraphQLNonNull(UpdatedNote)}
    },
    async resolve(source, {note}, {authToken}) {
      isLoggedIn(authToken);
      note.updatedAt = new Date();
      const {id, ...updates} = note;
      const updatedNote = await r.table('notes').get(id).update(updates, {returnChanges: true});
      if (updatedNote.errors) {
        throw errorObj({_error: 'Could not update note'});
      }
      return updatedNote.changes[0].new_val;
    }
  },
  deleteNote: {
    type: GraphQLBoolean,
    args: {
      id: {type: new GraphQLNonNull(GraphQLID)}
    },
    async resolve(source, {id}, {authToken}) {
      isLoggedIn(authToken);
      const result = await r.table('notes').get(id).delete();
      // return true is delete succeeded, false if doc wasn't found
      return Boolean(result.deleted);
    }
  }
};
