import r from '../../../database/rethinkdriver';
import {GraphQLNonNull, GraphQLID} from 'graphql';
import {Note} from './noteSchema';
import {errorObj} from '../utils';
import {isLoggedIn} from '../authorization';

export default {
  getNoteById: {
    type: Note,
    args: {
      id: {type: new GraphQLNonNull(GraphQLID)}
    },
    async resolve(source, {id}, {authToken}) {
      isLoggedIn(authToken);
      const note = await r.table('notes').get(id);
      if (!note) {
        throw errorObj({_error: 'Note not found'});
      }
      return note;
    }
  }
};

