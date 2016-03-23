import {
  GraphQLBoolean,
  GraphQLString,
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLID,
  GraphQLList
} from 'graphql';
import {GraphQLTitleType} from '../types';
import {makeRequired} from '../utils';
import {Note} from '../Notes/noteSchema';
import r from '../../../database/rethinkdriver';

export const Lane = new GraphQLObjectType({
  name: 'Lane',
  description: 'A kanban lane',
  fields: () => ({
    id: {type: new GraphQLNonNull(GraphQLID), description: 'The laneId'},
    userId: {type: new GraphQLNonNull(GraphQLID), description: 'The userId that created the lane'},
    isPrivate: {type: GraphQLBoolean, description: 'Whether the lane is visible to other users'},
    title: {type: new GraphQLNonNull(GraphQLTitleType), description: 'The lane title'},
    createdAt: {type: GraphQLString, description: 'The datetime the lane was created'},
    updatedAt: {type: GraphQLString, description: 'The datetime the lane was last updated'},
    notes: {
      type: new GraphQLList(Note),
      description: 'The notes in a given lane',
      resolve(source) {
        return r.table('notes').getAll(source.id, {index: 'laneId'}).run();
      }
    }
  })
});

const inputFields = {
  id: {type: GraphQLID, description: 'The laneId'},
  userId: {type: GraphQLID, description: 'The userId that created the lane'},
  isPrivate: {type: GraphQLBoolean, description: 'Whether the lane is visible to other users'},
  title: {type: GraphQLTitleType, description: 'The lane title'}
};

export const UpdatedLane = new GraphQLInputObjectType({
  name: 'UpdatedLane',
  description: 'Args to update a kanban lane',
  fields: () => makeRequired(inputFields, ['id'])
});

export const NewLane = new GraphQLInputObjectType({
  name: 'NewLane',
  description: 'Args to add a kanban lane',
  fields: () => makeRequired(inputFields, ['userId', 'title'])
});
