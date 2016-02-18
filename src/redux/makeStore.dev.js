import {createStore, applyMiddleware, compose} from 'redux';
import thunkMiddleware from 'redux-thunk';
import optimisticMiddleware from './middleware/optimisticMiddleware';
import {syncHistory} from 'react-router-redux';
import {browserHistory} from 'react-router';
import makeReducer from './makeReducer';
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
