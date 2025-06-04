const { SELECTORS } = require('../../locators/Companies/CompaniesHomeLocators');

class CompaniesHomePage {
  clickOnCreateCompany() {
    cy.get(SELECTORS.MENU_BUTTON).click();
    cy.get(SELECTORS.CREATEASUPPLIERCOPANY).click();
  }

  addFilterBasicByStatus(status) {
    cy.get(SELECTORS.FILTERS).click();
    cy.get(SELECTORS.BASIC).click();
    cy.get(`div.chakra-stack > p:contains("${status}")`).should('be.visible').click();
    cy.get(SELECTORS.APPLYFILYERS).click();
  }
  getNameCompany() {
    cy.get('table>thead>>:nth-child(2):contains("COMPANY NAME")').should('be.visible');
    return cy.get('table>tbody>tr:nth-child(1)>td:nth-child(2)>').invoke('text');
  }
  addCompanyToProject(project_name) {
    cy.get(SELECTORS.ADDTO).first().click();
    cy.get(SELECTORS.MOREPROJECTS).click();
    cy.get(`h4:contains("Projects")+ul>li:contains("${project_name}")`).click();
  }

  searchCompany(searchType, searchValue) {
    cy.get(SELECTORS.COMPANIES_TABLE).should('be.visible');
    cy.get(SELECTORS.SEARCH.SEARCH_BTN).click();
    cy.get(SELECTORS.SEARCH.COMPANIES_OPTIONS_BTN).click();
    cy.get(SELECTORS.SEARCH.COMPANIES_OPTIONS_LIST).contains(searchType).click();
    cy.get(SELECTORS.SEARCH.SEARCH_COMPANY_TXTFLD).type(searchValue);
    cy.get(SELECTORS.SEARCH.SEARCH_BTN).click();
  }
  validateCompanyByName(companyName) {
    cy.get(SELECTORS.COMPANIES_TABLEROWS).should('contain', companyName);
  }
  validateCompanyByTag(tag) {
    cy.get(SELECTORS.COMPANIES_TABLEROWS).first().click();
    cy.get(SELECTORS.TAGCOMPANY).scrollIntoView();
    cy.get(SELECTORS.TAGCOMPANY).get('div > p').should('contain', tag);
  }
  validateCompanyByOwnership(ownership) {
    cy.get(SELECTORS.COMPANIES_TABLEROWS).first().click();
    cy.get(SELECTORS.OWNERSHIPCOMPANY).should('contain', ownership);
  }
  validateCompanyByTaxId(taxid) {
    cy.get(SELECTORS.COMPANIES_TABLEROWS).first().click();
    cy.get(SELECTORS.TAXIDCOMPANY).should('contain', taxid);
  }
  validateCompanyByDescription(description) {
    cy.get(SELECTORS.COMPANIES_TABLEROWS).first().click();
    cy.get(SELECTORS.DESCRIPTIONCOMPANY).then(($el) => {
      const text = $el.text().toLowerCase();
      const expectedText = description.toLowerCase();
      expect(text).to.contain(expectedText);
    });
  }

  /*************************************************************/
  /********************* Create supplier company form **********/
  /*************************************************************/
  inputCompanyNameOrTax(name_tax) {
    cy.get(SELECTORS.NAMEORTAXID_FIELD).type(name_tax);
  }
  clickOnCreateNewCompany() {
    cy.get(SELECTORS.CREATENEWCOMPANY_BTN).click();
  }
  inputCompanyName(company_name) {
    cy.get(SELECTORS.COMPANYNAME_FIELD).type(company_name);
  }
  inputTaxId(tax_id) {
    cy.get(SELECTORS.TAXID_FIELD).type(tax_id);
  }
  clickOnConfirmAddCompany() {
    cy.get(SELECTORS.CREATECOMPANY_BTN).click();
  }
  createSupplierCompany(company_name, tax_id) {
    this.inputCompanyNameOrTax('Test Company');
    this.clickOnCreateNewCompany();
    this.inputCompanyName(company_name);
    this.inputTaxId(tax_id);
    this.clickOnConfirmAddCompany();
  }
}

export default CompaniesHomePage;
