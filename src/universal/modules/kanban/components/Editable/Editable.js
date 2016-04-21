import React, {PropTypes, Component} from 'react';
import styles from './Editable.css';

export default class Editable extends Component {
  static propTypes = {
    deleteItem: PropTypes.func,
    dispatch: PropTypes.func.isRequired,
    formProps: PropTypes.object.isRequired,
    isEditing: PropTypes.bool.isRequired,
    item: PropTypes.object.isRequired,
    updateItem: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func
  };

  render() {
    return (
      <div>
        {this.props.isEditing ? this.renderEdit() : this.renderItem()}
      </div>
    );
  }

  renderEdit = () => {
    const {item: {title}, formProps, handleSubmit} = this.props;
    /* eslint-disable react/jsx-no-bind, react/no-string-refs*/
    return (
      <form onSubmit={handleSubmit(this.onSubmit)}>
        <input
          {...formProps}
          ref={formProps.name}
          type="text"
          autoFocus
          defaultValue={title}
          onSubmit={handleSubmit(this.onSubmit)}
          onFocus={() => {}}
          onBlur={handleSubmit(this.onSubmit)}
        />
      </form>
    );
  };

  onSubmit = data => {
    const {item: {id, title}, formProps, updateItem} = this.props;
    const val = this.refs[formProps.name].value;
    formProps.onBlur();
    if (title === val) {
      return;
    }
    const payload = {
      title: data.title,
      id
    };
    updateItem(payload);
  };

  renderItem = () => {
    const {item: {title}, formProps: {onFocus: handleOnFocus}} = this.props;
    return (
      <span onClick={handleOnFocus}>
        <span className={styles.title}>{title}</span>
      </span>
    );
  };
}
