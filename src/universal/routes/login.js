// https://github.com/webpack/webpack/tree/master/examples/code-splitted-require.context
// There's a lot of boilerplate here, but if the require isn't static, then webpack can't chunk properly
import {requireNoAuth} from './requireNoAuth';

export default store => {
  return {
    onEnter: requireNoAuth(store),
    path: 'login',
    getIndexRoute: async (location, cb) => {
      const component = await System.import('universal/modules/auth/containers/Auth/AuthContainer');
      cb(null, {component});
    },
    getChildRoutes: (location, cb) => {
      cb(null, [
        {
          path: 'lost-password',
          getComponent: async (location, cb) => {
            const component = await System.import('universal/modules/auth/components/LostPassword/LostPassword');
            cb(null, component);
          }
        },
        {
          path: 'reset-email-sent',
          getComponent: async (location, cb) => {
            const component = await System.import('universal/modules/auth/components/ResetEmailSent/ResetEmailSent');
            cb(null, component);
          }
        },
        {
          path: 'reset-password/:resetToken',
          getComponent: async (location, cb) => {
            const component = await System.import('universal/modules/auth/components/ResetPassword/ResetPassword');
            cb(null, component);
          }
        },
        {
          path: 'reset-password-success',
          getComponent: async (location, cb) => {
            const component = await System.import('universal/modules/auth/components/ResetPasswordSuccess/ResetPasswordSuccess');
            cb(null, component);
          }
        }
      ]);
    }
  };
};
