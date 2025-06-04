module.exports = {
  SELECTORS: {
    MENU: {
      ICON: 'img[alt="STIMULUS"]',
      COMPANIES_ALL_SECTION: '[data-cy="all-companies-page"]',
      PROJECT_SECTION: '[data-cy="projects-page"]',
      REPORTS_SECTION: 'img[alt="STIMULUS"] +++> :contains("Reports")',
      DASHBOARD_SECTION: 'img[alt="STIMULUS"] +++> :contains("Dashboard")',
    },
    SETTING: '.css-le7fkx',
    USER_MENU_SETTINGS: {
      USER_MENU_AVATAR: '#user-avatar-menu',
      ACCOUNT: 'h4:contains("Account"):visible',
    },
    TENANT_MENU_SETTINGS: {
      USERMANAGEMENT: 'h4:contains("User Management"):visible',
      ACCOUNT: 'h4:contains("Account"):visible',
    },
    PROFILE: '#user-avatar-menu',
    LOGOUT: 'h4:contains("Log out")',
    LOGOUT_BTN: '#logout-button',
    SKELETON_ANIMATION: '.chakra-skeleton',
  },
  TEXTS: {},
};
