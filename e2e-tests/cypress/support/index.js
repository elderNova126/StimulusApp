require('dd-trace/ci/cypress/support');
import './commands';

beforeEach(function () {
  cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
});

// FIXME: A weird Apollo exception prevents addNewProject.feature from running
Cypress.on('uncaught:exception', (err) => {
  if (err.message.includes('Cannot read properties of ')) {
    return false;
  }
});
