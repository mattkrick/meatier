import {render} from 'react-dom';
import React from 'react';
import {createStore, applyMiddleware, compose} from 'redux';
import thunkMiddleware from 'redux-thunk';
import optimisticMiddleware from '../universal/redux/middleware/optimisticMiddleware.js';
import DevTools from '../universal/containers/DevTools';
import createLogger from 'redux-logger';
import {syncReduxAndRouter} from 'redux-simple-router';
import createHistory from 'history/lib/createBrowserHistory';
import rootReducer from '../universal/redux/reducer.js';
import Root from '../universal/components/Root/Root.js';


const initialState = window.__INITIAL_STATE__ || {};
const loggerMiddleware = createLogger({
  level: 'info',
  collapsed: true
});
const history = createHistory();

const finalCreateStore = compose(
  applyMiddleware(optimisticMiddleware, thunkMiddleware, loggerMiddleware),
  DevTools.instrument())(createStore);
const store = finalCreateStore(rootReducer, initialState);
syncReduxAndRouter(history, store);
// debug
window.store = store;
render(<Root store={store} history={history}/>, document.getElementById('root'));
