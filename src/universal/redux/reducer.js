import { combineReducers } from 'redux';
import {reducer as formReducer} from 'redux-form';
import {LANES} from './ducks/lanes';
import {NOTES} from './ducks/notes';
import optimist from 'redux-optimist';
import { routeReducer } from 'redux-simple-router';
//import user from './ducks/user.js';
import auth, {LOGIN_USER_ERROR} from './ducks/auth';
import lanes from './ducks/lanes';
import notes from './ducks/notes';
import {socketClusterReducer} from '../redux-socket-cluster/index';

function reducer(state, action) {
  return {
    auth: auth(state.auth, action),
    routing: routeReducer(state.routing, action),
    [LANES]: lanes(state.lanes, action),
    [NOTES]: notes(state.notes, action),
    socket: socketClusterReducer(state.socket, action),
    form: formReducer(state.form, action)
      //.plugin({
      //authForm: (state, action) => {
      //  switch(action.type) {
      //    case 'redux-form/STOP_SUBMIT':
      //      return {
      //        ...state,
      //        //password: Object.assign({}, state.password, {value: '', touched: false})
      //      };
      //    default:
      //      return state;
      //  }
      //}
    //})
  }
}

export default optimist(reducer);
