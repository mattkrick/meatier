import React, {Component, PropTypes} from 'react';
import { Provider } from 'react-redux';

// Injects the server rendered state and app into a basic html template
export default class Html extends Component {
  static propTypes: {
    store: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired
  };

  render() {
    const {title, store} = this.props;
    const initialState = 'window.__INITIAL_STATE__ = ' + JSON.stringify(store.getState());
    return (
      <html>
      <head>
        <title>{title}</title>
      </head>
      <body>
      <div id="root">
      </div>
      <script dangerouslySetInnerHTML={{__html: initialState}}/>
      <script src='/static/app.js'/>
      </body>
      </html>
    );
  }
}
