import thinky from '../database/models/thinky'
const {r} = thinky;

export default function allLanes(channel, query) {
  //handleChange = handleChange.bind(this);
  r.table('lanes')
    .changes({
      squash: 4.0,
      includeInitial: true
    })
    .run({cursor: true}, handleChange.call(this,channel));
}

function handleChange(channel) {
  return (err, cursor) => {
    if (err) return console.log(err);
    cursor.each((err, data) => {
      if (err) console.log(err);
      //console.log('CHANGES', data);
      const docId = data.new_val ? data.new_val.id : data.old_val.id;
      this.docQueue.has(docId) ? this.docQueue.delete(docId) : this.emit(channel, data);
    });
    this.on('unsubscribe', channelName => {
      console.log('UNSUBBIN', channelName);
      if (channelName === channel) {

        cursor && cursor.close();
      }
    })
  }
}




