import {requireNoAuth} from './requireNoAuth';

export default {
  onEnter: requireNoAuth,
  path: 'signup',
  getComponent: async (location, cb) => {
    const component = await System.import('universal/modules/auth/containers/Auth/AuthContainer');
    cb(null, component);
  }
};
