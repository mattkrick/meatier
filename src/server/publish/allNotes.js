import changeHandler from './changeHandler';
import thinky from '../database/models/thinky'
const {r} = thinky;

export default function allNotes(channel, query) {
  r.table('notes')
    .changes({
      //squash: 4.0,
      includeInitial: true
    })
    .run({cursor: true}, changeHandler.call(this,channel));
}
