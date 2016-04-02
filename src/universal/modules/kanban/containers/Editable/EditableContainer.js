import React, {PropTypes, Component} from 'react';
import {reduxForm} from 'redux-form';
import Editable from 'universal/modules/kanban/components/Editable/Editable';
import {getFormState} from 'universal/redux/helpers';

@reduxForm({getFormState})
export default class EditableContainer extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    updateItem: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    form: PropTypes.string,
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func,
    active: PropTypes.string
  };

  render() {
    const {fields} = this.props;
    const fieldName = Object.keys(fields)[0];
    const field = fields[fieldName];
    const {dispatch, item, updateItem, handleSubmit} = this.props;
    const isEditing = this.props.active === fieldName;
    const compProps = {dispatch, item, updateItem, handleSubmit, isEditing};
    return <Editable {...compProps} formProps={field}/>;
  }
}
