import {
  GraphQLString,
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLID,
  GraphQLInt
} from 'graphql';
import {GraphQLTitleType} from '../types';
import {makeRequired} from '../utils';

export const Note = new GraphQLObjectType({
  name: 'Note',
  description: 'A kanban note',
  fields: () => ({
    id: {type: new GraphQLNonNull(GraphQLID), description: 'The noteId'},
    userId: {type: new GraphQLNonNull(GraphQLID), description: 'The userId that created the lane'},
    laneId: {type: new GraphQLNonNull(GraphQLID), description: 'The laneId that the note belongs to'},
    title: {type: new GraphQLNonNull(GraphQLTitleType), description: 'The note title'},
    index: {type: new GraphQLNonNull(GraphQLInt), description: 'The index of the note in its lane'},
    createdAt: {type: GraphQLString, description: 'The datetime the note was created'},
    updatedAt: {type: GraphQLString, description: 'The datetime the note was last updated'}
  })
});

const inputFields = {
  id: {type: GraphQLID, description: 'The noteId'},
  userId: {type: GraphQLID, description: 'The userId that created the note'},
  title: {type: GraphQLTitleType, description: 'The note title'},
  index: {type: GraphQLInt, description: 'The index of the note in its lane'},
  laneId: {type: GraphQLID, description: 'The laneId that the note belongs to'}
};

export const UpdatedNote = new GraphQLInputObjectType({
  name: 'UpdatedNote',
  description: 'Args to update a note in a kanban lane',
  fields: () => makeRequired(inputFields, ['id'])
});

export const NewNote = new GraphQLInputObjectType({
  name: 'NewNote',
  description: 'Args to add a note in kanban lane',
  fields: () => makeRequired(inputFields, ['userId', 'title', 'index', 'laneId'])
});
