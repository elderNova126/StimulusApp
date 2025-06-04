import HomePage from '../../../../pages/HomePage';
import AccountPage from '../../../../pages/Tenant/AccountPage';
import UserSettingsPage from '../../../../pages/User/UserSettingsPage';
const homePage = new HomePage();
const accountPage = new AccountPage();
const userSettingsPage = new UserSettingsPage();

And('the user is in Account section', () => {
  homePage.enterUserAccount();
});

When('the user makes the change from tenant to {string}', (tenant_name) => {
  userSettingsPage.changeTenant(tenant_name);
});

And('the user makes the change of tenant from Switch Company to {string}', (tenant_name) => {
  homePage.switchTenant(tenant_name);
});

And('change of tenant to {string} is displayed', (tenant_name) => {
  homePage.enterTenantAccount();
  accountPage.validateTenantNameVisible(tenant_name);
});

When('the user makes the change of tenant from Switch Company to {string}', (tenant_name) => {
  homePage.switchTenant(tenant_name);
});
