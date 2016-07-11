import {reduxForm} from 'redux-form';
import Joi from 'joi';
import {parsedJoiErrors} from 'universal/utils/schema';
import {getFormState} from 'universal/redux/helpers';

/**
 * A small wrapper for reduxForm that can (optionally) inject a validate method based on the Joi `schema` prop in the
 * options, and also injects the necessary `getFormState` for `redux-optimistic-ui`.
 */
export default function meatierForm(options) {
  const {schema} = options
  return reduxForm(Object.assign(
    options,
    {getFormState},
    schema && {
      validate(values) {
        const results = Joi.validate(values, options.schema, {abortEarly: false});
        return parsedJoiErrors(results.error);
      }
    }
  ));
}
