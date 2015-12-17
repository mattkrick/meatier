export default {
  host: 'localhost',
  port: 28015,
  db: process.env.NODE_ENV === 'testing' ? 'ava' : 'meatier',
  min: process.env.NODE_ENV === 'production' ? 50 : 3,
  buffer: process.env.NODE_ENV === 'production' ? 50 : 3
}

