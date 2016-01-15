import {requireNoAuth} from './requireNoAuth';

export default store => {
  return {
    onEnter: requireNoAuth,
    path: 'signup',
    getComponent: async (location, cb) => {
      let component = await System.import('universal/modules/auth/containers/auth/AuthContainer');
      cb(null, component)
    }
  }
}
