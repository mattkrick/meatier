import React, { Component, PropTypes } from 'react';
import TextField from 'material-ui/lib/text-field';
import RaisedButton from 'material-ui/lib/raised-button';
import styles from './ResetPassword.css';
import {Link} from 'react-router';
import {reduxForm} from 'redux-form';
import Joi from 'joi';
import {authSchemaPassword} from '../../redux/modules/schemas/auth';
import {resetPassword} from '../../redux/modules/ducks/auth'
import {parsedJoiErrors} from 'utils/schema';
import {getFormState} from 'redux/helpers';

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

          <TextField {...password}
            type="password"
            floatingLabelText="Password"
            hintText="hunter2"
            errorText={ password.touched && password.error || ''}
          />
          <input style={{display:'none'}} type="text" name="javascriptDisabled"/>
          <div className={styles.resetPasswordButton}>
            <RaisedButton
              label='Set new password'
              secondary={true}
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
