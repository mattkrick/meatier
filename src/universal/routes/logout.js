export default {
  path: 'logout',
  getComponent: async (location, cb) => {
    const component = await System.import('universal/modules/auth/components/Logout/Logout');
    cb(null, component);
  }
};
