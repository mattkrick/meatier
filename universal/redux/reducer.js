import { combineReducers } from 'redux';
//import multireducer from 'multireducer';
import { routerStateReducer } from 'redux-router';
//import lanes from './ducks/lanes.js';
import user from './ducks/user.js';
import optimist from 'redux-optimist';

import docs from './ducks/docs.js';

//export default optimist(combineReducers({
//  router: routerStateReducer,
//  user,
//  lanes
//  //notes
//}));

function reducer(state, action) {
  return {
    router: routerStateReducer(state.router, action),
    user: user(state.user, action),
    lanes: docs(state.lanes, action)
  }
}

export default optimist(reducer);
