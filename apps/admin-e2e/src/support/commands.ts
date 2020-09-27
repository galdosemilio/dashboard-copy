declare namespace Cypress {
  interface Chainable<Subject> {
    setTimezone(value: string): Chainable<void>;
    setOrganization(value: 'ccr' | 'cmwl'): Chainable<void>;
  }
}

Cypress.Commands.add('setTimezone', (tz: 'en' | 'aet') => {
  let tzProper: string;

  switch (tz) {
    case 'aet':
      tzProper = 'Australia/Sydney';
      break;
    default:
      tzProper = 'America/New_York';
  }

  cy.log(`setting timezone to ${tzProper}...`);
  Cypress.env('timezone', tzProper);
});

Cypress.Commands.add('setOrganization', (org: 'ccr' | 'cmwl') => {
  let translatedOrg: number;

  switch (org) {
    case 'cmwl':
      translatedOrg = 6955;
      break;
    case 'ccr':
      translatedOrg = 1;
    default:
      translatedOrg = 1;
  }

  cy.log(`setting organizationId to ${translatedOrg}...`);
  Cypress.env('organizationId', translatedOrg);
});

Cypress.Commands.add('setOrgCookie', (orgId: string) => {
  cy.setCookie('ccrOrg', orgId);
});
