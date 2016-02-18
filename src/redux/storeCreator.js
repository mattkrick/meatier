import {createStore} from 'redux';

export default () =>
  window.devToolsExtension
    ? window.devToolsExtension()(createStore)
    : createStore;
