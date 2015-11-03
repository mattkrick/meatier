import {LANES, laneSchema} from './ducks/lanes.js';
//import {handleChange as handleNotesChange} from './ducks/notes.js';

export default {
  [LANES]: laneSchema
};

//const changefeedHandler = prepareRootHandler(changeHandlers);
//export default changefeedHandler;
//
//function prepareRootHandler(changeHandlers) {
//  const rootHandler = {};
//  for (let handler of changeHandlers) {
//    Object.assign(rootHandler, handler);
//  }
//  return rootHandler;
//}
