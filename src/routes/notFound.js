import LandingContainer from 'containers/Landing/LandingContainer';

export default {
  path: '*',
  component: LandingContainer,
  getIndexRoute: async (location, cb) => {
    const component = await System.import('components/NotFound/NotFound');
    cb(null, {component});
  }
}
