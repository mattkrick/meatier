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
      console.log('CHANGES', data);
      this.emit(channel, data)
    });
    this.on('unsubscribe', channelName => {
      console.log('UNSUBBIN', channelName);
      if (channelName === channel) {

        cursor && cursor.close();
      }
    })
  }
}




