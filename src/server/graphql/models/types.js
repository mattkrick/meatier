import {GraphQLStringFactory, GraphQLURLType as _GraphQLURLType} from 'graphql-type-factory';
//import _GraphQLDateType from 'graphql-custom-datetype'; //no good

export const GraphQLURLType = _GraphQLURLType;
//export const GraphQLDateType = _GraphQLDateType;

export const GraphQLEmailType = GraphQLStringFactory({
  name: 'email',
  min: 6,
  max: 300,
  regex: /.+@.+/
})

export const GraphQLPasswordType = GraphQLStringFactory({
  name: 'password',
  min: 6,
  max: 30
})
