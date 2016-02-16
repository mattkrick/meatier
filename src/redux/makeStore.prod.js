import {createStore, applyMiddleware, compose} from 'redux';
import thunkMiddleware from 'redux-thunk';
import optimisticMiddleware from './middleware/optimisticMiddleware';
import {syncHistory} from 'react-router-redux'
import {browserHistory} from 'react-router';
import makeReducer from './makeReducer';

export default function (initialState) {
  const reduxRouterMiddleware = syncHistory(browserHistory)
  const createStoreWithMiddleware = applyMiddleware(reduxRouterMiddleware, optimisticMiddleware, thunkMiddleware)(createStore);
  return createStoreWithMiddleware(makeReducer(), initialState);
}
