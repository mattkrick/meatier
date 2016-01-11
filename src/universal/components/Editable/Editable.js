import React, {PropTypes, Component} from 'react';
import styles from './Editable.css';

export default class Editable extends Component {
  static PropTypes = {
    deleteItem: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    formProps: PropTypes.object.isRequired,
    isEditing: PropTypes.bool.isRequired,
    item: PropTypes.object.isRequired,
    updateItem: PropTypes.func.isRequired
  };

  render() {
    return (
      <div>
        {this.props.isEditing ? this.renderEdit() : this.renderItem()}
      </div>
    );
  };

  renderEdit = () => {
    const {item:{title}, formProps, handleSubmit} = this.props;
    return (
      <form onSubmit={handleSubmit(this.onSubmit)}>
        <input {...formProps}
          ref={formProps.name}
          type="text"
          autoFocus={true}
          defaultValue={title}
          onSubmit={handleSubmit(this.onSubmit)}
          onFocus={()=>{}}
          onBlur={handleSubmit(this.onSubmit)}
        />
      </form>
    )
  };

  onSubmit =(data, dispatch) => {
    const {item:{id, title}, formProps, updateItem} = this.props;
    const val = this.refs[formProps.name].value;
    formProps.onBlur();
    if (title === val) return;
    const payload = {
      title: data.title,
      id
    }
    updateItem(payload);
  };

  renderItem = () => {
    const {item:{title}, formProps} = this.props;
    return (
      <span onClick={formProps.onFocus}>
        <span className={styles.title}>{title}</span>
      </span>
    );
  };
}
