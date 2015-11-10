import {LANES, laneSchema, laneActions} from './ducks/lanes';
import {NOTES, noteSchema, noteActions} from './ducks/notes';

export const DOCS_CHANGE = 'DOCS_CHANGE'; // socket message
export default {
  [LANES]: {
    schema: laneSchema,
    actions: laneActions
  },
  [NOTES]: {
    schema: noteSchema,
    actions: noteActions
  }
};
