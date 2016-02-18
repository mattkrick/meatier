import {applyMiddleware, compose} from 'redux';
import thunkMiddleware from 'redux-thunk';
import optimisticMiddleware from '../universal/redux/middleware/optimisticMiddleware';
import {syncHistory, routeReducer} from 'redux-simple-router'
import {browserHistory} from 'react-router';
import makeReducer from '../universal/redux/makeReducer';
import {ensureState} from 'redux-optimistic-ui';

import createLogger from 'redux-logger';
import storeCreator from './storeCreator';

const loggerMiddleware = createLogger({
  level: 'info',
  collapsed: true
});

export default function (initialState) {
  const reduxRouterMiddleware = syncHistory(browserHistory)
  const createStoreWithMiddleware = compose(
    applyMiddleware(reduxRouterMiddleware, optimisticMiddleware, thunkMiddleware, loggerMiddleware)
  )(storeCreator);

  const store = createStoreWithMiddleware(makeReducer(), initialState);
  reduxRouterMiddleware.listenForReplays(store, state => ensureState(state).get('routing'));
  return store;
}
