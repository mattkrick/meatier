import React from 'react';
import {createStore, applyMiddleware} from 'redux';
import makeReducer from '../universal/redux/makeReducer';
import {match} from 'react-router';
import Html from './Html';
import {push} from 'react-router-redux';
import {renderToStaticMarkup} from 'react-dom-stream/server';
import fs from 'fs';
import {join, basename} from 'path';
import promisify from 'es6-promisify';
import thunkMiddleware from 'redux-thunk';
import {Map as iMap} from 'immutable';

// https://github.com/systemjs/systemjs/issues/953

function renderApp(res, store, assets, renderProps) {
  const location = renderProps && renderProps.location && renderProps.location.pathname || '/';
  // Needed so some components can render based on location
  store.dispatch(push(location));
  const htmlStream = renderToStaticMarkup(<Html
    title="meatier"
    store={store}
    assets={assets}
    renderProps={renderProps}
    />);
  res.write('<!DOCTYPE html>');
  htmlStream.pipe(res, {end: false});
  htmlStream.on('end', () => res.end());
}

export default async function createSSR(req, res) {
  const finalCreateStore = applyMiddleware(thunkMiddleware)(createStore);
  const store = finalCreateStore(makeReducer(), iMap());
  if (process.env.NODE_ENV === 'production') {
    const makeRoutes = require('../../build/prerender');
    const assets = require('../../build/assets.json');
    const readFile = promisify(fs.readFile);
    assets.manifest.text = await readFile(join(__dirname, '..', '..', 'build', basename(assets.manifest.js)), 'utf-8');
    const routes = makeRoutes(store);
    match({routes, location: req.url}, (error, redirectLocation, renderProps) => {
      if (error) {
        res.status(500).send(error.message);
      } else if (redirectLocation) {
        res.redirect(redirectLocation.pathname + redirectLocation.search);
      } else if (renderProps) {
        // just look away, this is ugly & wrong https://github.com/callemall/material-ui/pull/2172
        GLOBAL.navigator = {userAgent: req.headers['user-agent']};
        renderApp(res, store, assets, renderProps);
      } else {
        res.status(404).send('Not found');
      }
    });
  } else {
    // just send a cheap html doc + stringified store
    renderApp(res, store);
  }
}
