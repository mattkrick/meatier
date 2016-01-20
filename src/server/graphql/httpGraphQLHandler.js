import Schema from './rootSchema';
import {graphql} from 'graphql';

export default async (req, res) => {
  // Check for admin privileges
  const {query, variables, ...rootVals} = req.body;
  const authToken = req.user || {};
  const result = await graphql(Schema, query, {authToken, ...rootVals}, variables);
  if (result.errors) {
    console.log('DEBUG GraphQL Error:', result.errors)
  }
  res.send(result);
}
