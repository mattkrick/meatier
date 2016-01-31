export default {
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  db: process.env.NODE_ENV === 'testing' ? 'ava' : 'meatier',
  min: process.env.NODE_ENV === 'production' ? 50 : 3,
  buffer: process.env.NODE_ENV === 'production' ? 50 : 3
}
