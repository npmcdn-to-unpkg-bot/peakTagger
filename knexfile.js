module.exports = {

  development: {
    client: 'postgres',
    connection: 'postgres://localhost:5432/peaktagger'
  },
  testing: {
    client: 'postgres',
    connection: process.env.DATABASE_URL
  }
};
