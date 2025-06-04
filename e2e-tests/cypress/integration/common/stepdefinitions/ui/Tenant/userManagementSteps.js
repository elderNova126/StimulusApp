import UserManagementPage from '../../../../pages/Tenant/UserManagementPage';
import { getVariable } from '../../../../../utils/Context';
const userManagementPage = new UserManagementPage();
const { GUEST_EMAIL } = require('../../../../../utils/CommonVariables');

Then('the invitation is displayed in the Pending invitations section', () => {
  const email = getVariable(GUEST_EMAIL);
  userManagementPage.validateEmailInPendingInvitation(email);
});
