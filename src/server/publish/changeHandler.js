export default function changeHandler(channel) {
  return (err, cursor) => {
    if (err) throw err;
    cursor.each((err, data) => {
      if (err) throw err;
      const docId = data.new_val ? data.new_val.id : data.old_val.id;
      //if the client is the one who made the change, don't push it to them, they already have it
      //we use emit not publish because these are personalized changefeeds that have includeInitial
      //if we don't need the initial docs, we can use publish & save a little memory by using a public channel
      this.docQueue.has(docId) ? this.docQueue.delete(docId) : this.emit(channel, data);
    });
    this.on('unsubscribe', channelName => {
      if (channelName === channel) {
        cursor && cursor.close();
      }
    })
  }
}
