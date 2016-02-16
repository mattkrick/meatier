import {createStore, applyMiddleware, compose} from 'redux';
import thunkMiddleware from 'redux-thunk';
import optimisticMiddleware from '../universal/redux/middleware/optimisticMiddleware';
import {syncHistory, routeReducer} from 'redux-simple-router';
import {browserHistory} from 'react-router';
import makeReducer from '../universal/redux/makeReducer';
import storeCreator from './storeCreator';

export default function (initialState) {
  const reduxRouterMiddleware = syncHistory(browserHistory);
  const createStoreWithMiddleware = applyMiddleware(
    reduxRouterMiddleware,
    optimisticMiddleware,
    thunkMiddleware
  )(storeCreator);
  return createStoreWithMiddleware(makeReducer(), initialState);
}
