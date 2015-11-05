import React, {PropTypes, Component} from 'react';
import {reduxForm, focus} from 'redux-form';
import {laneTextSchema} from '../redux/ducks/lanes';
import Joi from 'joi';

const fieldName = 'laneName';
const validate = values => {
  console.log(values);
  const results = Joi.validate(values[fieldName], laneTextSchema);
  console.log(results);
  return results.errors || {};
};

const formDetails = {form: 'laneNameField', fields: [fieldName], validate};

@reduxForm(formDetails)
export default class EditableContainer extends Component {
  static PropTypes = {
    item: PropTypes.object.isRequired,
    deleteItem: PropTypes.func.isRequired,
    updateItem: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    //this.finishEdit = this.finishEdit.bind(this);
    this.checkEnter = this.checkEnter.bind(this);
    this.renderEdit = this.renderEdit.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  render() {
    const isEditing = this.props.active === fieldName;
    //console.log(this.props.fieldss[fieldName]);
    return (
      <div>
        {isEditing ? this.renderEdit() : this.renderItem()}
      </div>
    );
  }

  renderEdit() {
    const {text} = this.props.item;

    const formProps = this.props.fields[fieldName];
    console.log(this.props);
    return (
      <form onSubmit={this.onSubmit}>
        <input {...formProps}
          ref={fieldName}
          type="text"
          autoFocus={true}
          defaultValue={text}
          //onChange={()=>{}}
          onSubmit={this.onSubmit}
          onFocus={()=>{}}
          onBlur={this.onSubmit}
          />
      </form>
    )
  }

  onSubmit(e) {
    e.preventDefault();
    const {id, text} = this.props.item;
    const val = this.refs[fieldName].value;
    this.props.fields[fieldName].onBlur();
    if (text ===  val) return;
    this.props.handleSubmit(this.props.updateItem(id,val));
  }

  renderItem() {
    //const {editItem, deleteItem, item} = this.props;
    const {id, text} = this.props.item;
    const formProps = this.props.fields[fieldName];
    return (
      <span onClick={formProps.onFocus}>
        <span className="text">{text}</span>
        <button className="delete" onClick={() => this.props.deleteItem(id)}>x</button>
      </span>
    );
  }

  checkEnter(e) {
    if (e.key === 'Enter') {
      this.props.handleSubmit(this.save(e));
    }
  }
}
