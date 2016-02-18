import Joi from 'joi';

const idSchema = Joi.string().min(3).max(36);
export const noteSchemaUpdate = Joi.object({
  id: idSchema.required(),
  title: Joi.string().max(30).trim(),
  laneId: idSchema,
  userId: idSchema,
  index: Joi.number()
});
export const noteSchemaInsert = noteSchemaUpdate.requiredKeys('title', 'laneId', 'userId', 'index');
