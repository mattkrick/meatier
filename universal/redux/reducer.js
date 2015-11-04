import { combineReducers } from 'redux';
import {reducer as formReducer} from 'redux-form';
import { routerStateReducer } from 'redux-router';
import optimist from 'redux-optimist';
import user from './ducks/user.js';
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
    lanes: docs(state.lanes, action),
    notes: docs(state.notes, action),
    form: formReducer(state.form, action)
  }
}

export default optimist(reducer);
