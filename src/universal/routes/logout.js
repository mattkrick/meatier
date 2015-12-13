export default {
  path: 'logout',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('../components/Logout/Logout'))
    })
  }
}
