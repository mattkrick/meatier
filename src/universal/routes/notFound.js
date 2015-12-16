export default function () {
  return {
    path: '*',
    getComponent: async (location, cb) => {
      let mod = await System.import('universal/components/NotFound/NotFound');
      let component = mod.default;
      cb(null, component)
    }
  }
}
