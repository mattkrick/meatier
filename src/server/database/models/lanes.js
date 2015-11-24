import thinky from './thinky';
import promisify from 'es6-promisify';
const {type, r} = thinky;

const fullLaneSchema = Joi.object().keys({
  id: idSchema,
  title: laneTitleSchema,
  userId: idSchema,
  isPrivate: Joi.boolean()
});
export const laneTitleSchema = Joi.string().max(200).trim().required();
const idSchema = Joi.string().min(3).max(36).required();

const Lane = thinky.createModel("lanes", {
  id: type.string(),
  title: type.string(),
  email: type.string().email().required(),
  isVerified: type.boolean().default(false),
  password: type.string().required(),
  createdAt: type.date().default(r.now())
}, {
  enforce_extra: 'strict'
});
Lane.ensureIndex("userId");

export function addLane(data) {
  return connect()
    .then(conn => {
      return r
        .table(table)
        .insert(document).run(conn)
        .then(response => {
          if (response.errors) {
            throw 'Duplicate ID';
          }
          return response.inserted; //should always be 1
        });
    });
}
