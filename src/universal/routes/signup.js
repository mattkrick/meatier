import {requireNoAuth} from './utils';
export default store => {
  return {
    onEnter: requireNoAuth,
    path: 'signup',
    getComponent(location, cb) {
      require.ensure([], (require) => {
        cb(null, require('../containers/Auth/AuthContainer').default)
      })
    }
  }
}
