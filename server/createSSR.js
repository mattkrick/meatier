import createHistory from 'history/lib/createMemoryHistory';
import React from 'react';
import {renderToString} from 'react-dom/server';
import { Provider } from 'react-redux';
import {reduxReactRouter, match} from 'redux-router/server';
import { createStore ,compose } from 'redux';
import PrettyError from 'pretty-error';
import qs from 'query-string';
import {getState} from './rethinkQueries.js';
import rootReducer from '../universal/redux/reducer.js';
import routes from '../universal/routes.js';
import Html from './Html.js';
import DevTools from '../universal/containers/DevTools';

const pretty = new PrettyError();
export default function createSSR(req, res) {
  const subs = ['lanes', 'notes'];
  const initialState = {
    user: {
      userId: 'baseUser'
    }
  };
  getState(subs)
    .then(initialTables => {
      subs.map((table, idx) => {
        initialState[table] = {
          error: null,
          synced: true,
          data: initialTables[idx]
        }
      });
      //let finalCreateStore = compose(DevTools.instrument())(createStore);
      let finalCreateStore = reduxReactRouter({routes, createHistory})(createStore);
      const store = finalCreateStore(rootReducer, initialState);
      //const store = compose(DevTools.instrument())reduxReactRouter({routes, createHistory})(createStore)(rootReducer, initialState);
      hydrateOnClient(store);
    });
  function hydrateOnClient(store, routerState) {
    res.send('<!doctype html>\n' + renderToString(<Html routerState={routerState} title='Quack Quack' store={store}/>));
  }
}
//console.log('store', store.getState());
//store.dispatch(match(req.originalUrl, (error, redirectLocation, routerState) => {
//  console.log('match conf', req.originalUrl, error, redirectLocation, routerState);
//  if (redirectLocation) {
//    res.redirect(redirectLocation.pathname + redirectLocation.search);
//  } else if (error) {
//    console.error('ROUTER ERROR:', pretty.render(error));
//    res.status(500);
//    hydrateOnClient(store, routerState);
//  } else if (!routerState) {
//    res.status(500);
//    hydrateOnClient(store, routerState);
//  } else {
//    // Workaround redux-router query string issue:
//    // https://github.com/rackt/redux-router/issues/106
//    if (routerState.location.search && !routerState.location.query) {
//      routerState.location.query = qs.parse(routerState.location.search);
//    }
//
//    store.getState().router.then(() => {
//      const status = getStatusFromRoutes(routerState.routes);
//      if (status) {
//        res.status(status);
//      }
//      hydrateOnClient(store, routerState);
//    }).catch((err) => {
//      console.error('DATA FETCHING ERROR:', pretty.render(err));
//      res.status(500);
//      //hydrateOnClient();
//    });
//  }
//}));


function getStatusFromRoutes(matchedRoutes) {
  return matchedRoutes.reduce((prev, cur) => cur.status || prev, null);
};


