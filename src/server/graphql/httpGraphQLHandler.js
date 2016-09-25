import Schema from './rootSchema';
import {graphql} from 'graphql';
import {prepareClientError} from './models/utils';

export default async (req, res) => {
  // Check for admin privileges
  const {query, variables, ...newContext} = req.body;
  const authToken = req.user || {};
  const context = {authToken, ...newContext};
  const result = await graphql(Schema, query, null, context, variables);
  const {error} = prepareClientError(result);
  const body = {data: result.data};
  if (error) body.error = error;
  res.send(body);
};
