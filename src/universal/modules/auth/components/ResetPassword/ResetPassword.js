import React, { Component, PropTypes } from 'react';
import Input from 'react-toolbox/lib/input';
import Button from 'react-toolbox/lib/button';
import styles from './ResetPassword.css';
import {Link} from 'react-router';
import {reduxForm} from 'redux-form';
import Joi from 'joi';
import {authSchemaPassword} from '../..//schemas/auth';
import {resetPassword} from '../..//ducks/auth'
import {parsedJoiErrors} from 'universal/utils/schema';
import {getFormState} from 'universal/redux/helpers';

@reduxForm({form: 'resetPasswordForm', fields: ['password'], validate, getFormState})
export default class ResetPassword extends Component {
  render() {
    const {fields: {password}, error, handleSubmit, submitting} = this.props;
    return (
      <div className={styles.resetPasswordForm}>
        <h3>Reset your password</h3>
        <span className={styles.instructions}>Please type your new password here</span>
        {error && <span>{error}</span>}
        <form className={styles.resetPasswordForm} onSubmit={handleSubmit(this.onSubmit)}>
          <input style={{display:'none'}} type="text" name="chromeisabitch"/>

          <Inbox {...password}
            type="password"
            label="Password"
            hint="hunter2"
            error={ password.touched && password.error || ''}
          />
          <input style={{display:'none'}} type="text" name="javascriptDisabled"/>
          <div className={styles.resetPasswordButton}>
            <Button raised={true}
              label='Set new password'
              primary={true}
              type='submit'
              disabled={submitting}
              onClick={handleSubmit(this.onSubmit)}
            />
          </div>
        </form>
      </div>
    );
  }
  onSubmit = (data,dispatch) => {
    const {resetToken} = this.props.params;
    const outData = Object.assign({}, data, {resetToken});
    return resetPassword(outData, dispatch);
  };
}

function validate(values) {
  const results = Joi.validate(values, authSchemaPassword, {abortEarly: false});
  return parsedJoiErrors(results.error);
}
