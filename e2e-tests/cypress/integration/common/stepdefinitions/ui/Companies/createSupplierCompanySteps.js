import CompaniesHomePage from '../../../../pages/Companies/CompaniesHomePage';
import CompanyDetailsPage from '../../../../pages/Companies/CompanyDetailsPage';
import { getNameRandom, getTaxId } from './../../../../../plugins/DataGenerator';
import { getVariable, setVariable } from '../../../../../utils/Context';
import HomePage from '../../../../pages/HomePage';
const { COMPANY_NAME } = require('../../../../../utils/CommonVariables');
const companiesHomePage = new CompaniesHomePage();
const companyDetailsPage = new CompanyDetailsPage();
const homePage = new HomePage();

And('is on companies list page', () => {
  homePage.goCompaniesSection();
});

When('the user click create a supplier company', () => {
  companiesHomePage.clickOnCreateCompany();
});

And('fill out the form', () => {
  let taxId = getTaxId();
  let company_name = getNameRandom();
  setVariable(COMPANY_NAME, company_name);
  companiesHomePage.createSupplierCompany(company_name, taxId);
  companyDetailsPage.saveChanges(company_name);
});

Then('the company is created', () => {
  let companyName = getVariable(COMPANY_NAME);
  companyDetailsPage.validateSupplierCompanyCreated(companyName);
});
