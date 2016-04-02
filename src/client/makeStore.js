import {createStore, applyMiddleware, compose} from 'redux';
import thunkMiddleware from 'redux-thunk';
import optimisticMiddleware from '../universal/redux/middleware/optimisticMiddleware';
import {routerMiddleware} from 'react-router-redux';
import {browserHistory} from 'react-router';
import makeReducer from '../universal/redux/makeReducer';

export default initialState => {
  let store;
  const reducer = makeReducer();
  const reduxRouterMiddleware = routerMiddleware(browserHistory);
  const middlewares = [
    reduxRouterMiddleware,
    optimisticMiddleware,
    thunkMiddleware
  ];

  if (__PRODUCTION__) {
    store = createStore(reducer, initialState, applyMiddleware(...middlewares));
  } else {
    const devtoolsExt = global.devToolsExtension && global.devToolsExtension();
    if (!devtoolsExt) {
      // We don't have the Redux extension in the browser, show the Redux logger
      const createLogger = require('redux-logger');
      const logger = createLogger({
        level: 'info',
        collapsed: true
      });
      middlewares.push(logger);
    }
    store = createStore(reducer, initialState, compose(
      applyMiddleware(...middlewares),
      devtoolsExt || (f => f)
    ));
  }
  return store;
};
