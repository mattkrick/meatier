import {requireNoAuth} from './utils';
export default store => {
  return {
    onEnter: requireNoAuth,
    path: 'signup',
    getComponent: async (location, cb) => {
      let mod = await System.import('universal/containers/Auth/AuthContainer');
      let component = mod.default;
      cb(null, component)
    }
  }
}

