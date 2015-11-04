import React, {PropTypes, Component} from 'react';
import {reduxForm} from 'redux-form';
import {laneSchema} from '../redux/ducks/lanes';
import Joi from 'joi';



const validate = values => {
  console.log('values', values);
  const results = Joi.validate(values, laneSchema);
  console.log('errors', results.errors);

  const errors = {};
  if (!values.laneName) {
    errors.username = 'Required';
  } else if (values.username.length > 15) {
    errors.username = 'Must be 15 characters or less';
  }
  return errors;
};

const formDetails = {form: 'laneName', fields: ['laneName'], validate};
@reduxForm(formDetails)
export default class Editable extends Component {
  constructor(props) {
    super(props);
    this.finishEdit = this.finishEdit.bind(this);
    this.checkEnter = this.checkEnter.bind(this);
    this.renderEdit = this.renderEdit.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
    this.state = {
      isEditing: false
    };

  }

  toggleEdit() {
    this.setState({
      isEditing: !this.state.isEditing
    });
  }
  render() {
    const {isEditing} = this.state;
    return (
      <div>
        {isEditing ? this.renderEdit() : this.renderItem()}
      </div>
    );
  }

  renderEdit() {
    const {text} = this.props.item;
    console.log(this.props.fields.laneName);
    const p = this.props;
    return <input type="text"
      {...this.props.fields.laneName}
                  autoFocus={true}
                  defaultValue={text}
                  onBlur={this.finishEdit}
                  onKeyPress={this.checkEnter}
      />;
  }

  renderItem() {
    const {editItem, deleteItem, item} = this.props;
    const {id, text} = item;
    return (
      <div onClick={this.toggleEdit}>
        <span className="text">{text}</span>
        <button className="delete" onClick={() => deleteItem(id)}>x</button>
      </div>
    );
  }

  checkEnter(e) {
    if (e.key === 'Enter') {
      this.finishEdit(e);
    }
  }

  finishEdit(e) {
    const {handleSubmit, item} = this.props;
    const {id} = item;
    this.toggleEdit();
    //handleSubmit();
    //updateItem(id, e.target.value);
    //editItem(id, false);
  }
}
