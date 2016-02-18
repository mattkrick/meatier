export default {
  path: 'graphql',
  getComponent: async (location, cb) => {
    let component = await System.import('components/Graphql/Graphql');
    cb(null, component)
  }
}
