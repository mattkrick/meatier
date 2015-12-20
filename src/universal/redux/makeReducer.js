import {reducer as form} from 'redux-form';
import {routeReducer as routing} from 'redux-simple-router';
import {combineReducers, compose} from 'redux'
import auth from './ducks/auth';

const coreReducers = {
  auth,
  routing,
  form
}

let asyncReducers = {};

export default (newReducers, reducerEnhancers) => {
  Object.assign(asyncReducers, newReducers);
  console.log(asyncReducers);
  const reducer = combineReducers({
    ...coreReducers,
    ...asyncReducers
  })
  if (reducerEnhancers){
    return Array.isArray(reducerEnhancers) ? compose(...reducerEnhancers)(reducer) : reducerEnhancers(reducer);
  }
  return reducer;
}
