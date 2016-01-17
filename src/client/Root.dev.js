import React, {Component} from 'react';
import {Router, browserHistory} from 'react-router';
import {Provider} from 'react-redux';
import routes from '../universal/routes/index';
import DevTools from './DevTools';

export default class Root extends Component {
  render() {
    const {store} = this.props;
    return (
      <Provider store={store}>
        <div>
          <Router history={browserHistory} routes={routes(store)}/>
          <DevTools/>
        </div>
      </Provider>
    );
  }
}
