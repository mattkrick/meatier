import React, {Component, PropTypes} from 'react';
import { Provider } from 'react-redux';
//import Foo from '../universal/components/Foo.js';
//Injects the server rendered state and app into a basic html template
export default class Html extends Component {
  static propTypes: {
    store: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired
  };

  render() {
    //console.log('DEBUG PROPS', this.props.routerState);
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
      <script src='/static/Kanban.js'/>
      </body>
      </html>
    );
  }
};
//<Provider store={store}>
//  <ReduxRouter />
//</Provider>
//<script src='/static/common.js'/>
//<div id='root' dangerouslySetInnerHTML={{__html: this.props.html}}/>
//{this.props.children}

///
//<link rel="stylesheet" href="/stylesheets/style.css" />
