import React, {Component} from 'react';
import GraphiQL from 'graphiql';
import fetch from 'isomorphic-fetch';
import socketOptions from 'universal/utils/socketOptions';
import 'universal/styles/global/graphiql.css';
import {getGraphQLHost, getGraphQLProtocol} from 'universal/utils/graphQLConfig';

const graphQLHost = getGraphQLHost();
const graphQLProtocol = getGraphQLProtocol();

const graphQLFetcher = async ({query, variables}) => {
  if (!__CLIENT__) return;
  const authToken = localStorage.getItem(socketOptions.authTokenName);
  variables = variables ? JSON.parse(variables) : undefined;
  const res = await fetch(`${graphQLProtocol}//${graphQLHost}/graphql`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify({query, variables}),
  })
  return res.json()
}

export default class Graphiql extends Component {
  render() {
    return (
      <GraphiQL fetcher={graphQLFetcher}/>
    );
  }
}
