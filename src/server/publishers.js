export function publishLanes(io) {
  connect()
    .then(conn => {
      r
        .table(table)
        .changes().run(conn, (err, cursor) => {
        console.log(`Listening for ${table} changes...`);
        cursor.each((err, change) => {
          io.emit(DOCS_CHANGE, change, table);
        });
      });
    });
}
