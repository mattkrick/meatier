import fetch from 'isomorphic-fetch';
import socketOptions from './socketOptions';

export function parseJSON(response) {
  return response.json();
}

export function hostUrl() {
  const host = process.env.HOST;
  const protocol = process.env.PROTOCOL;
  const port = process.env.PORT;
  return `${protocol}://${host}:${port}`;
}

export function postJSON(route, obj) {
  return fetch(hostUrl() + route, {
    method: 'post',
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(obj)
  });
}

export function getJSON(route) {
  return fetch(hostUrl() + route);
}

// export function pick(o, ...fields) {
//  return Object.assign({}, ...(for (p of fields) {[p]: o[p]}));
// }

export const getClientError = errors => {
  if (!errors) {
    return;
  }
  const error = errors[0].message;
  if (!error || error.indexOf('{"_error"') === -1) {
    return {_error: 'Server query error'};
  }
  return JSON.parse(error);
};

export const prepareGraphQLParams = graphParams => {
  // compress
  graphParams.query = graphParams.query.replace(/\s/g, '');
  return JSON.stringify(graphParams);
};

export const fetchGraphQL = async graphParams => {
  const serializedParams = prepareGraphQLParams(graphParams);
  const authToken = localStorage.getItem(socketOptions.authTokenName);
  const currentHostUrl = hostUrl();
  const graphQLUrl = `${currentHostUrl}/graphql`;
  const res = await fetch(graphQLUrl, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: serializedParams
  });
  const resJSON = await res.json();
  const {data, errors} = resJSON;
  return {data, error: getClientError(errors)};
};
