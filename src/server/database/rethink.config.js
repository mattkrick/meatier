export default {
    host: 'localhost',
    port: 28015,
    db: process.env.NODE_ENV === 'testing' ? 'ava' : 'meatier'
}

