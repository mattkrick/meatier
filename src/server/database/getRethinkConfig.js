import {readCert} from './readCert';
import flag from 'node-env-flag';

export const getRethinkConfig = () => {
  const config = {
    host: process.env.DATABASE_HOST || 'localhost',
    port: process.env.DATABASE_PORT || 28015,
    authKey: process.env.DATABASE_AUTH_KEY || '',
    db: process.env.NODE_ENV === 'testing' ? 'ava' : 'meatier',
    min: process.env.NODE_ENV === 'production' ? 50 : 3,
    buffer: process.env.NODE_ENV === 'production' ? 50 : 3
  };

  if (process.env.NODE_ENV && flag(process.env.DATABASE_SSL)) {
    // we may need a cert for production deployment
    // Compose.io requires this, for example.
    // https://www.compose.io/articles/rethinkdb-and-ssl-think-secure/
    Object.assign(config, {
      ssl: {
        ca: readCert()
      }
    });
  }
  return config;
};
