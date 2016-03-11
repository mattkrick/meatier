import React, { Component, PropTypes } from 'react';
import Input from 'react-toolbox/lib/input';
import Button from 'react-toolbox/lib/button';
import styles from './LostPassword.css';
import {Link} from 'react-router';
import {reduxForm} from 'redux-form';
import Joi from 'joi';
import {emailPasswordReset} from '../..//ducks/auth';
import {authSchemaEmail} from '../..//schemas/auth'
import {parsedJoiErrors} from 'universal/utils/schema';
import {getFormState} from 'universal/redux/helpers';

@reduxForm({form: 'lostPasswordForm', fields: ['email'], validate, getFormState})
export default class LostPassword extends Component {
  render() {
    const {fields: {email}, error, handleSubmit, submitting, location} = this.props;
    return (
      <div className={styles.lostPasswordForm}>
        <h3>Lost password</h3>
        <span className={styles.instructions}>Enter your email address and we'll send you a password reset link.</span>
        {error && <span>{error}</span>}
        <form className={styles.lostPasswordForm} onSubmit={handleSubmit(emailPasswordReset)}>
          <input style={{display:'none'}} type="text" name="javascript-disabled"/>

          <Input {...email}
            type="text"
            hint="name@email.com"
            error={ email.touched && email.error || ''}
            label="Email"
            defaultValue={location.query.e}
            autoFocus={true}
          />
          <input style={{display:'none'}} type="text" name="javascript-disabled"/>
          <div className={styles.lostPasswordButton}>
            <Button
              label='Send password reset'
              primary={true}
              type='submit'
              disabled={submitting}
              onClick={handleSubmit(emailPasswordReset)}
            />
          </div>
        </form>
      </div>
    );
  }
}

function validate(values) {
  const results = Joi.validate(values, authSchemaEmail, {abortEarly: false});
  return parsedJoiErrors(results.error);
}
