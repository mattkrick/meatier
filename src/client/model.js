import Lokka from 'lokka';
import Transport from 'lokka-transport-sc';
//import Transport from 'lokka-transport-http';
import socketClusterOptions from '../universal/utils/socketOptions';

/*
 Model responsible for querying and mutate todos
 */
export default class TodosModel {
  constructor() {
    // create a new Lokka client
    this.client = new Lokka({
      //transport: new Transport('/graphql')
      transport: new Transport('graphql', socketClusterOptions)
    });

    // Get the initial data from the transport (it's a promise)
    this.dataPromise = this.client
      // invoke the GraphQL query to get all the items
      .query(`
        {items}
      `)
      .then(data => {
        console.log('MDATA', data);
        return data.items
      });
  }

  getAll() {
    console.log(this.dataPromise);
    // get all the items but we clone the content inside the promise
    return this.dataPromise
      .then(items => {
        console.log('ITE', items);
        return items.concat([])
      });
  }

  // Add a newItem and register a callback to fire after
  // getting response from the server
  addItem(newItem, afterAdded) {
    this.client
      // Invoke the GraphQL query, which invoke our `addItem` mutation
      .mutate(`
        {
          item: addItem(item: "${newItem}")
        }
      `)
      .then(data => data.item)
      .then(item => {
        // if success, we replace the promise by adding the newly added item
        this.dataPromise = this.getAll().then(items => items.concat([newItem]));
      }, error => {
        // if there is an error, we simply log it
        console.error('Error adding item:', error);
      })
      // delay 600ms to show changes from optimistic updates
      .then(() => {
        return new Promise(resolve => setTimeout(resolve, 600))
      })
      .then(() => {
        // trigger the afterAdded callback with the updated data promise
        afterAdded(this.getAll());
      })

    // Add the item temporary to the data array to achieve
    // optimistic updates
    return this
      .getAll()
      .then(items => {
        items.push(`Adding "${newItem}" ...`);
        return items;
      });
  }
}
