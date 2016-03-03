import rethinkdbdash from 'rethinkdbdash';
import {getRethinkConfig} from './getRethinkConfig';

const config = getRethinkConfig();
export default rethinkdbdash(config);
