import {LANES, laneSchema, laneTextSchema} from './ducks/lanes';
import {NOTES, noteSchema, noteTextSchema} from './ducks/notes';

export default {
  [LANES]: {
    full: laneSchema,
    text: laneTextSchema
  },
  [NOTES]: {
    full: noteSchema,
    text: noteTextSchema
  }
};
