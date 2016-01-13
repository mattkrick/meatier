import React from 'react';

class TodoBanner extends React.Component {
  render() {
    return (
      <h3>TODO app with React and GraphQL </h3>
    );
  }
}

class TodoList extends React.Component {
  render() {
    return (
      <ul>
        {this.props.items.map(this.createItem)}
      </ul>
    );
  }

  createItem(itemText, index) {
    return (
      <li key={index}>{itemText}</li>
    );
  }
}

class TodoForm extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {item: ''};
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.onFormSubmit(this.state.item);
    this.setState({item: ''});
    React.findDOMNode(this.refs.item).focus();
    return;
  }

  onChange(e) {
    this.setState({
      item: e.target.value
    })
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <input
          type='text'
          ref='item'
          onChange={this.onChange.bind(this)}
          value={this.state.item}/>
        <input type='submit' value='Add'/>
      </form>
    );
  }
}

export default class TodoApp extends React.Component {
  constructor(props) {
    super(props);
    this.model = this.props.model;
    // get the initial items from the server
    this.setItems(this.model.getAll());
    // set the initial data as empty
    this.state = {items: []};
  }

  updateItems(newItem) {
    // Recive the items with optimistic updates
    // and register a callback to get items once updated the server

    const afterUpdated = itemsPromise => {
      this.setItems(itemsPromise);
    };
    const pendingItems = this.model.addItem(newItem, afterUpdated);
    this.setItems(pendingItems);
  }

  // accepts a promise which return items and
  // make it as the state
  setItems(itemsPromise) {
    itemsPromise
      .then(items => {
        this.setState({
          items
        });
      })
  }

  render() {
    return (
      <div>
        <TodoBanner/>
        <TodoList items={this.state.items}/>
        <TodoForm onFormSubmit={this.updateItems.bind(this)}/>
      </div>
    );
  }
}
