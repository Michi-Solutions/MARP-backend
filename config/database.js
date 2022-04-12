require('dotenv').config();

module.exports = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'MARP',
  host: process.env.DB_HOST,
  dialect: 'mysql',
}