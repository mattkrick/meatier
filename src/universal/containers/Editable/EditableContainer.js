import React, {PropTypes, Component} from 'react';
import {reduxForm} from 'redux-form';
import Joi from 'joi';
import Editable from '../../components/Editable/Editable';
import {getFormState} from '../../redux/helpers';
//TODO validate the title

@reduxForm({getFormState})
export default class EditableContainer extends Component {
  static PropTypes = {
    item: PropTypes.object.isRequired,
    updateItem: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    form: PropTypes.string.isRequired,
    fields: PropTypes.object.isRequired
  };

  render() {
    const {fields} = this.props;
    const fieldName = Object.keys(fields)[0];
    const field = fields[fieldName];
    const {dispatch, item, updateItem, handleSubmit} = this.props;
    const isEditing = this.props.active === fieldName;
    const compProps = {dispatch, item, updateItem, handleSubmit, isEditing};
    return <Editable {...compProps} formProps={field}/>
  }
}


