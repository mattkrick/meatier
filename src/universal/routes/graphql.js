export default {
  path: 'graphql',
  getComponent: async (location, cb) => {
    let component = await System.import('universal/components/Graphql/Graphql');
    cb(null, component)
  }
}
