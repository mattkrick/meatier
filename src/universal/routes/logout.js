export default {
  path: 'logout',
  getComponent: async (location, cb) => {
    let component = await System.import('universal/components/Logout/Logout');
    cb(null, component)
  }
}
