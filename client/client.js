import {render} from 'react-dom';
import React from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import { Provider } from 'react-redux';
import {ReduxRouter, reduxReactRouter} from 'redux-router';
//import createHistory from 'history/lib/createMemoryHistory';
import createHistory from 'history/lib/createBrowserHistory';
import liveQuery from './liveQuery.js';
import rootReducer from '../universal/redux/reducer.js';
import routes from '../universal/routes.js';
import { getOrSetUserId } from './userId';
import {setUserId} from '../universal/redux/ducks/user.js';
import Root from '../universal/components/Root.js';
import Joi from 'joi';
import optimisticMiddleware from '../universal/redux/middleware/optimisticMiddleware.js';
//import './style/pure.css';
//import './style/main.css';
//import './style/spinner.css';

const initialState = window.__INITIAL_STATE__;
console.log(initialState);
const loggerMiddleware = createLogger({
  level: 'info',
  collapsed: true
});
const store = compose(
  applyMiddleware(optimisticMiddleware,thunkMiddleware, loggerMiddleware),
  reduxReactRouter({createHistory}))(createStore)(rootReducer, initialState);
render(<Root store={store}/>, document.getElementById('root'));
// Now that we have rendered...
liveQuery(store);
console.log(store.getState());
//
//const schema = Joi.object().keys({
//  id: Joi.string().alphanum().min(3).max(36).required().description('foodie').notes(['good','bad']),
//  _persisted: Joi.boolean()
//});
//
//console.log(schema);
//console.log(Joi.validate({id: '12', _persisted: 'fooz'}, schema, (err,value) => console.log(err,value)));
//
