export default {
  path: '*',
  getComponent: async (location, cb) => {
    let component = await System.import('universal/components/NotFound/NotFound');
    cb(null, component)
  }
}
