import CompaniesHomePage from '../../../../pages/Companies/CompaniesHomePage';
import HomePage from '../../../../pages/HomePage';
const companiesHomePage = new CompaniesHomePage();
const homePage = new HomePage();
And('is on companies list page', () => {
  homePage.goCompaniesSection();
});

When('the user searches for a company by {string} with the value {string}', (searchType, searchValue) => {
  companiesHomePage.searchCompany(searchType, searchValue);
});

Then('then the search for {string} with the value {string} is performed correctly', (searchType, searchValue) => {
  switch (searchType) {
    case 'Company Name':
      companiesHomePage.validateCompanyByName(searchValue);
      break;
    case 'All':
      companiesHomePage.validateCompanyByName(searchValue);
      break;
    case 'Tags':
      companiesHomePage.validateCompanyByTag(searchValue);
      break;
    case 'Ownership':
      companiesHomePage.validateCompanyByOwnership(searchValue);
      break;
    case 'Tax ID No':
      companiesHomePage.validateCompanyByTaxId(searchValue);
      break;
    case 'Description':
      companiesHomePage.validateCompanyByDescription(searchValue);
  }
});
