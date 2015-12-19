export default {
  path: 'verify-email/:verifiedEmailToken',
  getComponent: async (location, cb) => {
    let mod = await System.import('universal/containers/VerifyEmail/VerifyEmailContainer');
    let component = mod.default;
    cb(null, component)
  }
}
