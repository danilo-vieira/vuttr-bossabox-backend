const dotenv = require('dotenv');

dotenv.config({
  path: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.prod'
});

module.exports = {
  "type": process.env.TYPEORM_CONNECTION,
  "host": process.env.TYPEORM_HOST,
  "port": process.env.TYPEORM_PORT,
  "username": process.env.TYPEORM_USERNAME,
  "password": process.env.TYPEORM_PASSWORD,
  "database": process.env.TYPEORM_DATABASE,
  "synchronize": process.env.TYPEORM_SYNCHRONIZE,
  "entities": [
    process.env.TYPEORM_ENTITIES
  ],
  "migrations": [
    process.env.TYPEORM_MIGRATIONS
  ],
  "cli": {
    "migrationsDir": process.env.TYPEORM_MIGRATIONS_DIR
  }
}
