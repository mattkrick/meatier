import Schema from './rootSchema';
import {graphql} from 'graphql';

export default async (req, res) => {
  // Check for admin privileges
  const {query, variables, ...rootVals} = req.body;
  const authToken = req.user || {};
  console.log('RV', rootVals)
  const result = await graphql(Schema, query, {authToken, ...rootVals}, variables);
  console.log('RES', result)
  res.send(result);
}
