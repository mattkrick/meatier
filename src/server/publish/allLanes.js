import changeHandler from './changeHandler';
import thinky from '../database/models/thinky'
const {r} = thinky;

export default function allLanes(channel, query) {
  r.table('lanes')
    .changes({
      //a 4 second squash means changefeed waits 4 seconds from the first doc edit received
      //note that if we use squash, we'll have to save more than just the id in the docQueue
      //since it's possible that another change gets squashed after the change we made
      /*
      * TODO eval alternatives, probably the best would be to push the docque to redis where the docId
      * is the key & the val is the latest userId to touch the doc. since this isn't atomic, it's not 100% guaranteed
      * */
      //the
      //squash: 4.0,
      includeInitial: true
    })
    .run({cursor: true}, changeHandler.call(this,channel));
}




