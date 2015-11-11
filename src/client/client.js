import {render} from 'react-dom';
import React from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import optimisticMiddleware from '../universal/redux/middleware/optimisticMiddleware.js';
import DevTools from '../universal/containers/DevTools';
import createLogger from 'redux-logger';
import { Provider } from 'react-redux';
import {ReduxRouter, reduxReactRouter} from 'redux-router';
import createHistory from '../../node_modules/history/lib/createBrowserHistory';
import liveQuery from './liveQuery.js';
import rootReducer from '../universal/redux/reducer.js';
import routes from '../universal/routes.js';
import { getOrSetUserId } from './userId';
import {setUserId} from '../universal/redux/ducks/user.js';
import Root from '../universal/components/Root/Root.js';

const initialState = {};
//const initialState = window.__INITIAL_STATE__;
console.log(initialState);
const loggerMiddleware = createLogger({
  level: 'info',
  collapsed: true
});

let finalCreateStore = compose(
  applyMiddleware(optimisticMiddleware,thunkMiddleware, loggerMiddleware),
  DevTools.instrument())(createStore);
  finalCreateStore = reduxReactRouter({createHistory})(finalCreateStore);
  const store = finalCreateStore(rootReducer, initialState);
//console.log(store.getState());
window.store = store;
render(<Root store={store}/>, document.getElementById('root'));

// Now that we have rendered...
liveQuery(store);
