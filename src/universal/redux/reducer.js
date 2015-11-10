import { combineReducers } from 'redux';
import {reducer as formReducer} from 'redux-form';
import { routerStateReducer } from 'redux-router';
import {LANES} from './ducks/lanes';
import {NOTES} from './ducks/notes';
import optimist from 'redux-optimist';
import user from './ducks/user.js';
import lanes from './ducks/lanes';
import notes from './ducks/notes';

function reducer(state, action) {
  return {
    router: routerStateReducer(state.router, action),
    user: user(state.user, action),
    [LANES]: lanes(state.lanes, action),
    [NOTES]: notes(state.notes, action),
    form: formReducer(state.form, action)
  }
}

export default optimist(reducer);
