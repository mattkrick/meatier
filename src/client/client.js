import {render} from 'react-dom';
import React from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import optimisticMiddleware from '../universal/redux/middleware/optimisticMiddleware.js';
import DevTools from '../universal/containers/DevTools';
import createLogger from 'redux-logger';
import { Provider } from 'react-redux';
import { syncReduxAndRouter} from 'redux-simple-router';
import createHistory from 'history/lib/createBrowserHistory';
import liveQuery from './liveQuery.js';
import rootReducer from '../universal/redux/reducer.js';
import { getOrSetUserId } from './userId';
//import {setUserId} from '../universal/redux/ducks/user.js';
import Root from '../universal/components/Root/Root.js';
import polyfill from 'babel-polyfill';

const initialState = window.__INITIAL_STATE__ || {};
const loggerMiddleware = createLogger({
  level: 'info',
  collapsed: true
});
const history = createHistory();

const finalCreateStore = compose(
  applyMiddleware(optimisticMiddleware,thunkMiddleware, loggerMiddleware),
  DevTools.instrument())(createStore);
  //finalCreateStore = syncReduxAndRouter(history, finalCreateStore);
  const store = finalCreateStore(rootReducer, initialState);
  syncReduxAndRouter(history, store);
window.store = store; //debug
render(<Root store={store} history={history}/>, document.getElementById('root'));

// Now that we have rendered...
//liveQuery(store);
