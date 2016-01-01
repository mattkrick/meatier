import React, {Component} from 'react';
import {Router} from 'react-router';
import {Provider} from 'react-redux';
import DevTools from './DevTools';
import routes from '../universal/routes/index';
export default class Root extends Component {
  render() {
    const {history, store} = this.props;
    return (
      <Provider store={store}>
        <div>
          <Router history={history} routes={routes(store)}/>
          <DevTools/>
        </div>
      </Provider>
    );
  }
}
