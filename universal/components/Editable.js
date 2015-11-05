import React, {PropTypes, Component} from 'react';

export default class Editable extends Component {
  constructor(props) {
    super(props);
    this.finishEdit = this.finishEdit.bind(this);
    this.checkEnter = this.checkEnter.bind(this);
    this.renderEdit = this.renderEdit.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);

  }

  toggleEdit() {
    this.setState({
      isEditing: !this.state.isEditing
    });
  }
  render() {
    const {isEditing} = this.state;
    console.log('e props', this.props);
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
