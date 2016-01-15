import {Note, NewNote, UpdatedNote} from './noteSchema';
import {errorObj} from '../utils';
import {GraphQLNonNull, GraphQLInputObjectType, GraphQLBoolean, GraphQLID} from 'graphql';
import r from '../../../database/rethinkdriver';

export default {
  addNote: {
    type: Note,
    args: {
      note: {type: new GraphQLNonNull(NewNote)}
    },
    async resolve(source, {note}, {rootValue}) {
      const {authToken: {id: verifiedId}} = rootValue;
      if (!verifiedId) {
        throw errorObj({_error: 'Unauthorized'});
      }
      note.createdAt = new Date();
      let newNote;
      try {
        newNote = await r.table('notes').insert(note, {returnChanges: true});
      } catch (e) {
        throw errorObj({_error: 'Add note failed'});
      }
      return newNote.changes[0].new_val;
    }
  },
  updateNote: {
    type: Note,
    args: {
      note: {type: new GraphQLNonNull(UpdatedNote)}
    },
    async resolve(source, {note}, {rootValue}) {
      const {authToken: {id: verifiedId, isAdmin}} = rootValue;
      if (note.userId !== verifiedId && !isAdmin) {
        throw errorObj({_error: 'Unauthorized'});
      }

      note.updatedAt = new Date();
      let updatedNote;
      try {
        updatedNote = await r.table('notes').update(note, {returnChanges: true});
      } catch (e) {
        throw errorObj({_error: 'Update note failed'});
      }
      return updatedNote.changes[0].new_val;
    }
  },
  deleteNote: {
    type: GraphQLBoolean,
    args: {
      id: {type: new GraphQLNonNull(GraphQLID)}
    },
    async resolve(source, {id}, {rootValue}) {
      const {authToken: {id: verifiedId, isAdmin}} = rootValue;
      if (note.userId !== verifiedId && !isAdmin) {
        throw errorObj({_error: 'Unauthorized'});
      }
      try {
        await r.tables('notes').delete(id);
      } catch(e) {
        throw errorObj({_error: 'Delete note failed'});
      }
      return true;
    }
  }
};
