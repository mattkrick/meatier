import Joi from 'joi';

const anyErrors = {
  required: '!!Required',
  empty: '!!Required'
};

export const authSchemaInsert = Joi.object().keys({
  email: Joi.string().email().trim().lowercase().max(200).label('Email').required().options({
    language: {
      any: anyErrors,
      string: {
        email: '!!That\'s not an email!'
      }
    }
  }),
  password: Joi.string().min(6).label('Password').required().options({
    language: {
      any: anyErrors,
      string: {
        min: '{{!key}} should be at least {{limit}} chars long'
      }
    }
  })
});
export const authSchemaEmail = authSchemaInsert.optionalKeys('password');
export const authSchemaPassword = authSchemaInsert.optionalKeys('email');
