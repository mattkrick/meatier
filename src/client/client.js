import {render} from 'react-dom';
import React from 'react';
import {syncReduxAndRouter} from 'redux-simple-router';
import rootReducer from '../universal/redux/reducer';
import createHistory from 'history/lib/createBrowserHistory';

const initialState = window.__INITIAL_STATE__ || {};
const history = createHistory();
const __PRODUCTION__ = process.env.NODE_ENV === 'production';
const createStore = __PRODUCTION__ ? require('./createStore.prod.js') : require('./createStore.dev.js');
const Root = __PRODUCTION__ ? require('./Root.prod.js').default : require('./Root.dev.js').default;
const store = createStore.default(rootReducer, initialState);
syncReduxAndRouter(history, store);

render(<Root store={store} history={history}/>, document.getElementById('root'));
