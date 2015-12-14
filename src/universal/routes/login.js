// https://github.com/webpack/webpack/tree/master/examples/code-splitted-require.context
//There's a lot of boilerplate here, but if the require isn't static, then webpack can't chunk properly
//webpack 2 and systemjs may make things nicer
import {requireNoAuth} from './utils';
//const getAsync = specifier => {
//  return async (location, cb) => {
//    let mod = await System.import(specifier);
//    cb(null, mod);
//  }
//}

export default function (store) {
  return {
    onEnter: requireNoAuth,
    path: 'login',
    getIndexRoute: async (location, cb) => {
      let mod = await System.import('universal/containers/Auth/AuthContainer');
      let component = mod.default;
      cb(null, {component});
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
          path: 'reset-password',
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
        },
        {
          path: 'verify-email/:verifiedToken',
          getComponent: async (location, cb) => {
            let mod = await System.import('universal/containers/VerifyEmail/VerifyEmailContainer');
            let component = mod.default;
            cb(null, component)
          }
        }
      ])
    }
  }
}

