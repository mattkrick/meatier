import {reducer as form} from 'redux-form';
import {routeReducer as routing} from 'redux-simple-router';
import {compose} from 'redux';
import {combineReducers} from 'redux-immutablejs';
import auth from '../modules/auth/ducks/auth';
import {optimistic} from 'redux-optimistic-ui';

let currentReducers = {
  auth,
  routing,
  form
}

export default (newReducers, reducerEnhancers) => {
  Object.assign(currentReducers, newReducers);
  const reducer = combineReducers({...currentReducers})
  if (reducerEnhancers){
    return Array.isArray(reducerEnhancers) ? compose(...reducerEnhancers)(reducer) : reducerEnhancers(reducer);
  }
  return reducer;
}
//if (module.hot && module.hot.data) {
//  currentReducers = module.hot.data.currentReducers;
//}
//if (module.hot) {
//  module.hot.dispose(function(data) { data.currentReducers = currentReducers; })
//}
