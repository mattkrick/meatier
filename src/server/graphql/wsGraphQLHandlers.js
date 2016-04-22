import {graphql} from 'graphql';
import {prepareClientError} from './models/utils';
import Schema from './rootSchema';

export const wsGraphQLHandler = async function (body, cb) {
  const {query, variables, ...rootVals} = body;
  const authToken = this.getAuthToken();
  const docId = variables.doc && variables.doc.id || variables.id;
  if (!docId) {
    console.warn('No documentId found for the doc submitted via websockets!');
    return cb({_error: 'No documentId found'});
  }
  this.docQueue.add(docId);
  const result = await graphql(Schema, query, {socket: this, ...rootVals}, authToken, variables);
  const {error, data} = prepareClientError(result);
  if (error) {
    this.docQueue.delete(docId);
  }
  cb(error, data);
};

export const wsGraphQLSubHandler = function (subscription) {
  const {query, variables, ...rootVals} = JSON.parse(subscription);
  const authToken = this.getAuthToken();
  graphql(Schema, query, {socket: this, ...rootVals}, authToken, variables);
};
