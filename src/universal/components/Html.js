import React, {Component, PropTypes} from 'react';
import {ReduxRouter} from 'redux-router';
import { Provider } from 'react-redux';
//import Foo from '../universal/components/Foo.js';
//Injects the server rendered state and app into a basic html template
export default class Html extends Component {
  static propTypes:{
    store: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    assets: PropTypes.object,
    component: PropTypes.node
    };

  render() {
    //console.log('DEBUG PROPS', this.props.routerState);
    //console.log('ASSETS', this.props.assets.styles);
    const {title, store} = this.props;
    const initialState = 'window.__INITIAL_STATE__ = ' + JSON.stringify(store.getState());
    console.log(store.getState());
    return (
      <html>
      <head>
        <title>{title}</title>
      </head>
      <body>
      <div id="root">
      </div>
      <script src='/static/Kanban.js'/>
      <script dangerouslySetInnerHTML={{__html: initialState}}/>
      </body>
      </html>
    );
  }
};

//{Object.keys(assets.styles).map((style, key) =>
//  <link href={assets.styles[style]} key={key} media="screen, projection"
//        rel="stylesheet" type="text/css" charSet="UTF-8"/>
//)}

//{ Object.keys(assets.styles).is_empty() ?
//  <style dangerouslySetInnerHTML={{__html: require('./Kanban/styles.css')}}/> : null}


//{Object.keys(assets.javascript).map((script, i) =>
//  <script src={assets.javascript[script]} key={i}/>
//)}

//<script src='/static/Kanban.js'/>
//<Provider store={store}>
//  <ReduxRouter />
//</Provider>
//<script src='/static/common.js'/>
//<div id='root' dangerouslySetInnerHTML={{__html: this.props.html}}/>
//{this.props.children}

///
//<link rel="stylesheet" href="/stylesheets/style.css" />
