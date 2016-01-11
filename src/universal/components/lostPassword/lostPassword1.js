import React, { Component, PropTypes } from 'react';
import TextField from 'material-ui/lib/text-field';
import RaisedButton from 'material-ui/lib/raised-button';
import styles from './lostPassword1.css';
import {Link} from 'react-router';
import {reduxForm} from 'redux-form';
import Joi from 'joi';
import {sendResetEmail} from '../../redux/ducks/auth';
import {authSchemaEmail} from '../../schemas/auth'
import {parsedJoiErrors} from '../../utils/schema';
import {getFormState} from '../../redux/helpers';

@reduxForm({form: 'lostPasswordForm', fields: ['email'], validate, getFormState})
export default class LostPassword extends Component {
  render() {
    const {fields: {email}, error, handleSubmit, submitting, location} = this.props;
    return (
      <div className={styles.lostPasswordForm}>
        <h3>Lost password</h3>
        <span className={styles.instructions}>Enter your email address and we'll send you a password reset link.</span>
        {error && <span>{error}</span>}
        <form className={styles.lostPasswordForm} onSubmit={handleSubmit(sendResetEmail)}>
          <input style={{display:'none'}} type="text" name="javascript-disabled"/>

          <TextField {...email}
            type="text"
            hintText="name@email.com"
            errorText={ email.touched && email.error || ''}
            floatingLabelText="Email"
            defaultValue={location.query.e}
            autoFocus={true}
          />
          <input style={{display:'none'}} type="text" name="javascript-disabled"/>
          <div className={styles.lostPasswordButton}>
            <RaisedButton
              label='Send password reset'
              secondary={true}
              type='submit'
              disabled={submitting}
              onClick={handleSubmit(sendResetEmail)}
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
