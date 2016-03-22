import {readFileSync} from 'fs';
import {join} from 'path';

export const readCert = () => {
  const cert = readFileSync(join(__dirname, 'cacert'), 'utf8');
  return cert;
};
