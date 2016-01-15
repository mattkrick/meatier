import r from '../../../database/rethinkdriver';
import {GraphQLString, GraphQLNonNull, GraphQLID} from 'graphql';
import {Note} from './noteSchema';
import {errorObj} from '../utils';

export default {
  getNoteById: {
    type: Note,
    args: {
      id: {type: new GraphQLNonNull(GraphQLID)}
    },
     resolve: async (source, {id}, {rootValue}) => {
      const {authToken: {id: verifiedId, isAdmin}} = rootValue;
       if (!verifiedId) {
         throw errorObj({_error: 'Unauthorized'});
       }
      let note;
      try {
        note = await r.table('notes').get(id).run()
      } catch(e) {
        throw e;
      }
       if (note.isPrivate && (note.userId !== verifiedId || !isAdmin)) {
         throw errorObj({_error: 'Unauthorized'});
       }
       return note;
    }
  }
}

