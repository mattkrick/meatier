import {reducer as form} from 'redux-form';
import {routeReducer as routing} from 'redux-simple-router';
import {combineReducers, compose} from 'redux'
import auth from './ducks/auth';

let currentReducers = {
  auth,
  routing,
  form
}

export default (newReducers, reducerEnhancers) => {
  //if (module.hot && module.hot.data) {
  //  currentReducers = module.hot.data.currentReducers;
  //}

  Object.assign(currentReducers, newReducers);
  const reducer = combineReducers({...currentReducers})

  if (reducerEnhancers){
    return Array.isArray(reducerEnhancers) ? compose(...reducerEnhancers)(reducer) : reducerEnhancers(reducer);
  }
  return reducer;
}

//if (module.hot) {
//  module.hot.dispose(function(data) { data.currentReducers = currentReducers; })
//}
