const setProviderSiteCookie = (): void => {
  cy.log('Setting cookie for provider site');

  cy.setCookie('ccrStatic', 'provider');
};

const setGuideStorage = (seen: boolean = true): void => {
  if (!seen) {
    return;
  }

  window.localStorage.setItem('ccrRPMGuide', seen.toString());
  window.localStorage.setItem('ccrFirstTimeGuide', seen.toString());
};

const setSiteLanguageToEnglish = (): void => {
  cy.log('Setting cookie for en language');

  cy.setCookie('ccrStaticLanguage', 'en');
};

export { setGuideStorage, setProviderSiteCookie, setSiteLanguageToEnglish };
