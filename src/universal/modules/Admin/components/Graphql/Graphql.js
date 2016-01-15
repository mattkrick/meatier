import React, {Component} from 'react';
import GraphiQL from 'graphiql';
import fetch from 'isomorphic-fetch';
import socketOptions from 'universal/utils/socketOptions';
import styles from './graphiql.css';


function graphQLFetcher({query, variables}) {
  if (!__CLIENT__) return;
  const authToken = localStorage.getItem(socketOptions.authTokenName);
  console.log('var', variables);

  variables = variables ? JSON.parse(variables) : undefined;
  return fetch('http://localhost:3000/graphql', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify({query, variables}),
  }).then(response => response.json());
}

export default class Graphiql extends Component {
  render() {
    return (
      <GraphiQL fetcher={graphQLFetcher}/>
    );
  }
}
