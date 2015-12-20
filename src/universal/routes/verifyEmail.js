export default {
  path: 'verify-email/:verifiedEmailToken',
  getComponent: async (location, cb) => {
    let component = await System.import('universal/containers/VerifyEmail/VerifyEmailContainer');
    cb(null, component)
  }
}
