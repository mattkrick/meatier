import {
  GraphQLBoolean,
  GraphQLString,
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLID,
} from 'graphql';
import {GraphQLEmailType, GraphQLURLType, GraphQLTitleType} from '../types';

export const Lane =  new GraphQLObjectType({
  name: 'Lane',
  description: 'A kanban lane',
  fields: () => ({
    id: {type: new GraphQLNonNull(GraphQLID), description: 'The laneId'},
    userId: {type: new GraphQLNonNull(GraphQLID), description: 'The userId that created the lane'},
    isPrivate: {type: GraphQLBoolean, description: 'Whether the lane is visible to other users'},
    title: {type: new GraphQLNonNull(GraphQLTitleType), description: 'The lane title'},
    createdAt: {type: GraphQLString, description: 'The datetime the lane was created'},
    updatedAt: {type: GraphQLString, description: 'The datetime the lane was last updated'}
  })
});

export const LaneInput =  new GraphQLInputObjectType({
  name: 'LaneInput',
  description: 'A kanban lane argument',
  fields: () => ({
    id: {type: GraphQLID, description: 'The laneId'},
    userId: {type: new GraphQLNonNull(GraphQLID), description: 'The userId that created the lane'},
    isPrivate: {type: GraphQLBoolean, description: 'Whether the lane is visible to other users'},
    title: {type: new GraphQLNonNull(GraphQLTitleType), description: 'The lane title'},
  })
});
