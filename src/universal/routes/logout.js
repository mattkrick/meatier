export default {
  path: 'logout',
  getComponent: async (location, cb) => {
    let component = await System.import('universal/modules/auth/components/Logout/Logout');
    cb(null, component)
  }
}
