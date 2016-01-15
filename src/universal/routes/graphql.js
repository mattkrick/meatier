export default {
  path: 'graphql',
  getComponent: async (location, cb) => {
    let component = await System.import('universal/modules/admin/components/Graphql/Graphql');
    cb(null, component)
  }
}
