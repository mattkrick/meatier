export default function changeHandler(channel) {
  return (err, cursor) => {
    if (err) return console.log(err);
    cursor.each((err, data) => {
      if (err) console.log(err);
      //if the client is the one who made the change, don't push it to them, they already have it
      const docId = data.new_val ? data.new_val.id : data.old_val.id;
      this.docQueue.has(docId) ? this.docQueue.delete(docId) : this.emit(channel, data);
    });
    this.on('unsubscribe', channelName => {
      if (channelName === channel) {
        cursor && cursor.close();
      }
    })
  }
}
