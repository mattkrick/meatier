/*
 * getDotenv()
 * processes .env file (if it exists). Sets process.env[VARS] as a
 * side-effect.
 *
 * Returns true.
 */
export function getDotenv() {
  var dotenv = require('dotenv');              // eslint-disable-line
  var dotenvExpand = require('dotenv-expand'); // eslint-disable-line
  var myEnv = dotenv.config({silent: true});   // eslint-disable-line
  dotenvExpand(myEnv);

  return true;
}
