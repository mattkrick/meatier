import LandingContainer from 'universal/containers/Landing/LandingContainer';

export default {
  path: '*',
  component: LandingContainer,
  getIndexRoute: async (location, cb) => {
    const component = await System.import('universal/components/NotFound/NotFound');
    cb(null, {component});
  }
}
