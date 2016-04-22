import React, {Component} from 'react';
import GraphiQL from 'graphiql';
import fetch from 'isomorphic-fetch';
import socketOptions from 'universal/utils/socketOptions';
import 'universal/styles/global/graphiql.css';
import {hostUrl} from 'universal/utils/fetching';

const graphQLFetcher = async ({query, variables}) => {
  if (!__CLIENT__) {
    return;
  }
  const authToken = localStorage.getItem(socketOptions.authTokenName);
  variables = variables ? JSON.parse(variables) : undefined;
  const currentHostUrl = hostUrl();
  const res = await fetch(`${currentHostUrl}/graphql`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify({query, variables})
  });
  return res.json();
};

export default class Graphiql extends Component {
  render() {
    return (
      <GraphiQL fetcher={graphQLFetcher}/>
    );
  }
}
