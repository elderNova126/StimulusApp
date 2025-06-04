const cucumber = require('cypress-cucumber-preprocessor').default;
require('dotenv').config();

module.exports = (on, config) => {
  on('file:preprocessor', cucumber());

  config.env.CYPRESS_LOGIN_EMAIL = process.env.CYPRESS_LOGIN_EMAIL;
  config.env.CYPRESS_LOGIN_PASSWORD = process.env.CYPRESS_LOGIN_PASSWORD;
  config.env.CYPRESS_RAPIDAPI_KEY = process.env.CYPRESS_RAPIDAPI_KEY;

  return config;
};
