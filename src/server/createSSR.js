import createHistory from 'history/lib/createMemoryHistory';
import React from 'react';
import {renderToString} from 'react-dom/server';
import {createStore} from 'redux';
import rootReducer from '../universal/redux/reducer.js';
//import Html from './Html.js';

export default function createSSR(req, res) {
  const initialState = {};
  const store = createStore(rootReducer, initialState);
  // TODO: handle production webpack script & prerendering
  hydrateOnClient(store);

  function hydrateOnClient(store) {
    res.send(`<!doctype html>
              <html>
                <head>
                  <title>Meatier</title>
                </head>
                <body>
                  <div id="root"></div>
                  <script src="/static/app.js"></script>
                </body>
              </html>`)

    //res.send('<!doctype html>\n' + renderToString(<Html title="Quack Quack" store={store}/>));
  }
}

