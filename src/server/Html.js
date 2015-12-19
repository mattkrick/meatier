import React, {Component, PropTypes} from 'react';
import {Provider} from 'react-redux';
import {RoutingContext} from 'react-router';
import {renderToString} from 'react-dom-stream/server';

// Injects the server rendered state and app into a basic html template
export default class Html extends Component {
  static propTypes:{
    store: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    assets: PropTypes.object,
    renderProps: PropTypes.object
    };

  render() {
    const PROD = process.env.NODE_ENV === 'production';
    const {title, store, assets, renderProps} = this.props;
    const {manifest, app, vendor} = assets || {};
    const initialState = `window.__INITIAL_STATE__ = ${JSON.stringify(store.getState())}`;
    return (
      <html>
      <head>
        <meta charSet="utf-8"/>
        {PROD && <link rel="stylesheet" href="/static/prerender.css" type="text/css"/>}
        <title>{title}</title>
      </head>
      <body>
      <div id="root">
        {PROD && renderToString(
          <Provider store={store}>
            <div>
              <RoutingContext {...renderProps} />
            </div>
          </Provider>)}
      </div>
      {PROD && <script dangerouslySetInnerHTML={{__html: manifest.text}}/>}
      {PROD && <script src={vendor.js}/>}
      <script src={PROD ? app.js : '/static/app.js'}/>
      <script dangerouslySetInnerHTML={{__html: initialState}}/>
      </body>
      </html>
    );
  }
}
