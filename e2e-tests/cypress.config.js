const { defineConfig } = require('cypress');
require('dotenv').config();

module.exports = defineConfig({
  projectId: process.env.CYPRESS_PROJECT_ID,
  pageLoadTimeout: 60000,
  requestTimeout: 60000,
  defaultCommandTimeout: 60000,
  screenshotOnRunFailure: true,
  responseTimeout: 60000,
  waitForAnimations: true,
  chromeWebSecurity: false,
  viewportWidth: 1920,
  viewportHeight: 1200,
  e2e: {
    setupNodeEvents(on, config) {
      require('dd-trace/ci/cypress/plugin')(on, config);
      return require('./cypress/plugins/index.js')(on, config);
    },
    baseUrl: process.env.CYPRESS_BASE_URL,
    supportFile: 'cypress/support/index.js',
    specPattern: 'cypress/integration/**/**/**/*.{feature,features}',
    excludeSpecPattern:
      process.env.REACT_APP_ENVIRONMENT === 'demo'
        ? [
            '**/stepdefinitions/*/*/*',
            '*.js',
            '*.md',
            '*.ts',
            '**/addNewProject.feature',
            '**/addDataToProject.feature',
          ]
        : ['**/stepdefinitions/*/*/*', '*.js', '*.md', '*.ts'],
  },
  retries: {
    // Configure retry attempts for `cypress run`
    // Default is 0
    runMode: 3,
    // Configure retry attempts for `cypress open`
    // Default is 0
    openMode: 1,
  },
});
