import React from 'react';
import {renderToString} from 'react-dom/server';
import {createStore} from 'redux';
import rootReducer from '../universal/redux/reducer.js';
import {match} from 'react-router'
import Html from './Html.js';
import {UPDATE_PATH} from 'redux-simple-router';
// https://github.com/systemjs/systemjs/issues/953

function renderApp(store, res, renderProps) {
  const path = renderProps && renderProps.location ? renderProps.location.pathname : '/';
  store.dispatch({type: UPDATE_PATH, payload: {path}});
  //console.log('REN PROP', renderProps);
  const html = renderToString(<Html title="meatier" store={store} renderProps={renderProps}/>)
  res.send('<!doctype html>\n' + html);
}

export default async function createSSR(req, res) {
  const initialState = {};
  const store = createStore(rootReducer, initialState);
  if (process.env.NODE_ENV !== 'production') {
    // just send a cheap html doc + stringified store
    renderApp(store, res, null);
  } else {
    let makeRoutes;
    try {
      makeRoutes = require('../../serverBuild/app.js').default;
    } catch(e) {
      console.log('ERR', e, e.stack)
    }
    const routes = makeRoutes(store);
    match({routes, location: req.url}, (error, redirectLocation, renderProps) => {
      if (error) {
        res.status(500).send(error.message)
      } else if (redirectLocation) {
        res.redirect(redirectLocation.pathname + redirectLocation.search)
      } else if (renderProps) {
        // just look away, this is ugly & wrong https://github.com/callemall/material-ui/pull/2172
        GLOBAL.navigator = {userAgent: req.headers['user-agent']}
        renderApp(store, res, renderProps)
      } else {
        res.status(404).send('Not found')
      }
    })
  }
}

