import React, {Component} from 'react';
import GraphiQL from 'graphiql';
import fetch from 'isomorphic-fetch';
import socketOptions from '../../utils/socketOptions';
import styles from './graphiql.css';

function graphQLFetcher(graphQLParams) {
  if (!__CLIENT__) return;
  const authToken = localStorage.getItem(socketOptions.authTokenName);
  console.log(socketOptions.authTokenName, authToken)
  return fetch('http://localhost:3000/graphql', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify(graphQLParams),
  }).then(response => response.json());
}

export default class Graphiql extends Component {
  render() {
    return (
      <GraphiQL fetcher={graphQLFetcher}/>
    );
  }
}
