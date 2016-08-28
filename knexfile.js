var dotenv = require('dotenv');
dotenv.load();

module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://localhost:5432/peaktagger'
  },
  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL
  }
};
