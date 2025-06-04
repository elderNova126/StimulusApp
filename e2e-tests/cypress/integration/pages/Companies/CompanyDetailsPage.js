const { SELECTORS } = require('../../locators/Companies/CompanyDetailsLocators');

class CompanyDetailsPage {
  saveChanges() {
    cy.contains('Industry').should('exist').and('be.visible');
    cy.get(SELECTORS.SAVECHANGES_BTN).should('be.visible').click();
  }
  validateSupplierCompanyCreated(supplier_company_name) {
    cy.get(`h2:contains("${supplier_company_name}")`).should('be.visible');
  }
}

export default CompanyDetailsPage;
