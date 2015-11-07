import React, {PropTypes, Component} from 'react';

export default class Editable extends Component {
  static PropTypes = {
    deleteItem: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    formProps: PropTypes.object.isRequired,
    isEditing: PropTypes.bool.isRequired,
    item: PropTypes.object.isRequired,
    updateItem: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.checkEnter = this.checkEnter.bind(this);
    this.renderEdit = this.renderEdit.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  render() {
    return (
      <div>
        {this.props.isEditing ? this.renderEdit() : this.renderItem()}
      </div>
    );
  }

  renderEdit() {
    const {item:{text}, formProps} = this.props;
    return (
      <form onSubmit={this.onSubmit}>
        <input {...formProps}
          ref={formProps.name}
          type="text"
          autoFocus={true}
          defaultValue={text}
          onSubmit={this.onSubmit}
          onFocus={()=>{}}
          onBlur={this.onSubmit}
        />
      </form>
    )
  }

  onSubmit(e) {
    e.preventDefault();
    const {item:{id, text}, formProps, handleSubmit} = this.props;
    const val = this.refs[formProps.name].value;
    formProps.onBlur();
    if (text === val) return;
    handleSubmit(this.props.updateItem(id, val));
  }

  renderItem() {
    const {item:{id, text}, formProps} = this.props;
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
