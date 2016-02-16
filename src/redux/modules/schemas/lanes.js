import Joi from 'joi';

const idSchema = Joi.string().min(3).max(36);
export const laneSchemaUpdate = Joi.object({
  id: idSchema.required(),
  title: Joi.string().max(30).trim(),
  userId: idSchema,
  isPrivate: Joi.boolean()
});
export const laneSchemaInsert = laneSchemaUpdate.requiredKeys('title', 'userId');
