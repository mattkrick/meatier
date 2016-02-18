import {applyMiddleware, compose} from 'redux';
import thunkMiddleware from 'redux-thunk';
import optimisticMiddleware from './middleware/optimisticMiddleware';
import {syncHistory} from 'react-router-redux'
import {browserHistory} from 'react-router';
import makeReducer from './makeReducer';
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
