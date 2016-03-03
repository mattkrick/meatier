import React, {Component} from 'react';
import pureRender from '../universal/decorators/pureRender/pureRender';
import {Router, browserHistory} from 'react-router';
import {Provider} from 'react-redux';
import routes from '../universal/routes/index';

@pureRender
export default class Root extends Component {
  static propTypes = {
    store: React.PropTypes.object.isRequired
  }
  render() {
    const {store} = this.props;
    return (
      <Provider store={store}>
        <div>
          <Router history={browserHistory} routes={routes(store)}/>
        </div>
      </Provider>
    );
  }
}
