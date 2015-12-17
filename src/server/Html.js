import React, {Component, PropTypes} from 'react';
import {Provider} from 'react-redux';
import { match, RoutingContext } from 'react-router'

// Injects the server rendered state and app into a basic html template
export default class
Html extends Component {
  static propTypes:{
    store: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    renderProps: PropTypes.object
    };

  render() {
    const PROD = process.env.NODE_ENV === 'production';
    const {title, store, renderProps} = this.props;
    const initialState = 'window.__INITIAL_STATE__ = ' + JSON.stringify(store.getState());
    return (
      <html>
      <head>
        {PROD && <link rel="stylesheet" href="/static/style.css" type="text/css"/>}
        <title>{title}</title>
      </head>
      <body>
      <div id="root">
        {PROD &&
        <Provider store={store}>
          <RoutingContext {...renderProps} />
        </Provider> }
      </div>
      <script dangerouslySetInnerHTML={{__html: initialState}}/>
      <script src="/static/app.js"/>
      </body>
      </html>
    );
    //{process.env.NODE_ENV === 'production' ? <script src="/static/vendor.js"/> : null}
  }
}
