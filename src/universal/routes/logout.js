export default {
  path: 'logout',
  getComponent: async (location, cb) => {
    let mod = await System.import('universal/components/Logout/Logout');
    let component = mod.default;
    cb(null, component)
  }
}
