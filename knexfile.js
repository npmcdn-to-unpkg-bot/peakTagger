var dotenv = require('dotenv');

module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://localhost:5432/peaktagger'
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL
  }
};
