const setAdminSiteCookie = (): void => {
  cy.log('Setting cookie for admin site');

  cy.setCookie('ccrStatic', 'admin');
};

const setSiteLanguageToEnglish = (): void => {
  cy.log('Setting cookie for en language');

  cy.setCookie('ccrStaticLanguage', 'en');
};

const setOrgCookie = (): void => {
  cy.log('Setting cookie for org');

  cy.setCookie('ccrOrg', '30');
};

export { setAdminSiteCookie, setOrgCookie, setSiteLanguageToEnglish };
