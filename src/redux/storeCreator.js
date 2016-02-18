export default () =>
  window.devToolsExtension
    ? window.devToolsExtension()(createStore)
    : createStore;
