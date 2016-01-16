import changeHandler from './changeHandler';
import r from '../database/rethinkdriver';

export default function allNotes(channel, query) {
  r.table('notes')
    .changes({
      //squash: 4.0,
      includeInitial: true
    })
    .run({cursor: true}, changeHandler.call(this,channel));
}
