import rethinkdbdash from 'rethinkdbdash';
import {getRethinkConfig} from './getRethinkConfig';

const config = getRethinkConfig();
console.log('rethink config: ',config);

export default rethinkdbdash(config);
