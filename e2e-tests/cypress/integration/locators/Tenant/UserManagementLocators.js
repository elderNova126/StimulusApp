module.exports = {
  SELECTORS: {
    USEREMAIL: ':contains("User Email") input',
    SENDINVITE: 'button:contains("Send Invite")',
    PENDING_INVITATIONS_SECTION: {
      INVITATIONS_LIST: '//p[text()="Pending Invitations"]/../../table/descendant::h3',
    },
  },
  TEXTS: {},
};
