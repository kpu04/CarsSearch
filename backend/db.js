require('dotenv').config();
const { Sequelize } = require('sequelize');
const config = require('./Config/config');

const env = process.env.NODE_ENV || 'development';
const { username, password, database, host, dialect } = config[env];

const sequelize = new Sequelize(database, username, password, {
  host,
  dialect,
  logging: console.log, 
});

module.exports = sequelize;
