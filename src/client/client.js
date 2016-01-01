import {render} from 'react-dom';
import React from 'react';
import {syncReduxAndRouter} from 'redux-simple-router';
import makeReducer from '../universal/redux/makeReducer';
import {browserHistory} from 'react-router'

const initialState = window.__INITIAL_STATE__ || {};
const createStore = __PRODUCTION__ ? require('./createStore.prod.js') : require('./createStore.dev.js');
const Root = __PRODUCTION__ ? require('./Root.prod.js') : require('./Root.dev.js');
const store = createStore(makeReducer(), initialState);
syncReduxAndRouter(browserHistory, store);

// Will implement when react-router supports HMR
//if (module.hot) {
//  module.hot.accept('../universal/redux/makeReducer', () => {
//    const nextRootReducer = require('../universal/redux/makeReducer')
//    store.replaceReducer(nextRootReducer())
//  })
//  //module.hot.dispose(data => data.foo = 'hi');
//}

render(<Root store={store} history={browserHistory}/>, document.getElementById('root'));

