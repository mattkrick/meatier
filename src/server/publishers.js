export function sendTodosByUserId(io, userId) {
  //How to auth? By linking a client socketId to a user in a lookup table?
  connect()
    .then(conn => {
      r
        .table('todos')
        .filter(todos => todos("userId").eq(userId))
        .changes().run(conn, (err, cursor) => {
        cursor.each((err, change) => {
          //Do I emit a unique message? namespace?  How do I handle 2 clients using the same userId?
          io.emit('TODO_CHANGE', change);
        });
      });
    });
}
