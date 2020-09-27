import { ApiOverrideEntry, interceptCoreApiCalls, seti18n } from './api';
import './commands';
import { setSystemDate } from './date';
import { setAdminSiteCookie, setOrgCookie, setSiteLanguageToEnglish } from './state';

const standardSetup = (
  authenticated?: boolean,
  startDate?: number,
  apiOverrides?: ApiOverrideEntry[]
): void => {
  cy.log('Init standard setup');
  cy.server();

  const auth = authenticated === false ? false : true;

  setOrgCookie();
  if (auth) {
    setAdminSiteCookie();
  }
  setSystemDate(startDate ? startDate : undefined);
  seti18n();
  setSiteLanguageToEnglish();
  interceptCoreApiCalls(auth, apiOverrides);
};

export { standardSetup };
