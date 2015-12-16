import createHistory from 'history/lib/createMemoryHistory';
import React from 'react';
import {renderToString} from 'react-dom/server';
import {createStore} from 'redux';
import rootReducer from '../universal/redux/reducer.js';
import { match, RoutingContext } from 'react-router'
import { write, writeError, writeNotFound, redirect } from './utils'
import routes from '../../serverBuild/app';
import Html from './Html.js';

function renderApp(renderProps, res) {
  const initialState = {};
  const store = createStore(rootReducer, initialState);
  const html = renderToString(<Html title="Quack Quack" store={store} renderProps={renderProps}/>)
  res.send('<!doctype html>\n' + html);
}

export default function createSSR(req, res) {
  const initialState = {};
  const store = createStore(rootReducer, initialState);
  const madeRoutes = routes(store);
  const PROD = process.env.NODE_ENV === 'production';
  if (!PROD) {
    return renderApp(null, res);
  }
  match({routes: madeRoutes, location: req.url }, (error, redirectLocation, renderProps) => {
    if (error) {
      writeError('ERROR!', res)
    } else if (redirectLocation) {
      redirect(redirectLocation, res)
    } else if (renderProps) {
      //TODO breaks on any javascript-rich page
      renderApp(renderProps, res)
    } else {
      writeNotFound(res)
    }
  })
}

