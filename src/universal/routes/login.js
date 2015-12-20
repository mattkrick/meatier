// https://github.com/webpack/webpack/tree/master/examples/code-splitted-require.context
//There's a lot of boilerplate here, but if the require isn't static, then webpack can't chunk properly
import {requireNoAuth} from './utils';

export default store => {
  return {
    onEnter: requireNoAuth(store),
    path: 'login',
    getIndexRoute: async (location, cb) => {
      let mod = await System.import('universal/containers/Auth/AuthContainer');
      let component = mod.default;
      cb(null, {component})
    },
    getChildRoutes: (location, cb) => {
      cb(null, [
        {
          path: 'lost-password',
          getComponent: async (location, cb) => {
            let mod = await System.import('universal/components/LostPassword/LostPassword');
            let component = mod.default;
              cb(null, component)
          }
        },
        {
          path: 'reset-email-sent',
          getComponent: async (location, cb) => {
            let mod = await System.import('universal/components/ResetEmailSent/ResetEmailSent');
            let component = mod.default;
            cb(null, component)
          }
        },
        {
          path: 'reset-password/:resetToken',
          getComponent: async (location, cb) => {
            let mod = await System.import('universal/components/ResetPassword/ResetPassword');
            let component = mod.default;
            cb(null, component)
          }
        },
        {
          path: 'reset-password-success',
          getComponent: async (location, cb) => {
            let mod = await System.import('universal/components/ResetPasswordSuccess/ResetPasswordSuccess');
            let component = mod.default;
            cb(null, component)
          }
        }
      ])
    }
  }
}

