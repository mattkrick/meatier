import {createStore, applyMiddleware, compose} from 'redux';
import thunkMiddleware from 'redux-thunk';
import optimisticMiddleware from '../universal/redux/middleware/optimisticMiddleware';
import {syncHistory} from 'redux-simple-router';
import {browserHistory} from 'react-router';
import makeReducer from '../universal/redux/makeReducer';

export const makeStore = initialState => {
  const reducer = makeReducer();
  const reduxRouterMiddleware = syncHistory(browserHistory);
  const devtoolsExt = global.devToolsExtension && global.devToolsExtension();

  const middlewares = [
    reduxRouterMiddleware,
    optimisticMiddleware,
    thunkMiddleware
  ];

  if (!__PRODUCTION__) {
    if (!devtoolsExt) {
      // We don't have the Redux extension in the browser, show the Redux logger
      const createLogger = require('redux-logger');
      const logger = createLogger({
        level: 'info',
        collapsed: true
      });
      middlewares.push(logger);
    }
  }

  const mw = compose(
    applyMiddleware(...middlewares),
    devtoolsExt || (f => f)
  );
  const store = createStore(reducer, initialState, mw);

  if (!__PRODUCTION__) {
    const {ensureState} = require('redux-optimistic-ui');

    reduxRouterMiddleware.listenForReplays(store, state => ensureState(state).get('routing'));
  }

  return store;
};

export default makeStore;
