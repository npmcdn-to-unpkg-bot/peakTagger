module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost:5432/peaktagger'
  },
  testing: {
    client: 'pg',
    connection: process.env.DATABASE_URL
  }
};
