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
    const {item:{title}, formProps, handleSubmit} = this.props;
    return (
      <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
        <input {...formProps}
          ref={formProps.name}
          type="text"
          autoFocus={true}
          defaultValue={title}
          onSubmit={handleSubmit(this.onSubmit.bind(this))}
          onFocus={()=>{}}
          onBlur={handleSubmit(this.onSubmit.bind(this))}
        />
      </form>
    )
  }

  onSubmit(data, dispatch) {
    const {item:{id, title}, formProps, updateItem} = this.props;
    const val = this.refs[formProps.name].value;
    formProps.onBlur();
    if (title === val) return;
    const payload = {
      title: data.title,
      id
    }
    updateItem(payload);
  }

  renderItem() {
    const {item:{title}, formProps} = this.props;
    return (
      <span onClick={formProps.onFocus}>
        <span className="title">{title}</span>
      </span>
    );
  }
}
