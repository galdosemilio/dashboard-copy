declare namespace Cypress {
  interface Chainable<Subject> {
    setTimezone(value: string): Chainable<void>;
    setOrganization(value: string): Chainable<void>;
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

Cypress.Commands.add('setOrganization', (org: string) => {
  let translatedOrg: number;

  switch (org) {
    case 'cmwl':
      translatedOrg = 6955;
      break;
    case 'ccr':
      translatedOrg = 1;
      break;
    case 'mdteam':
      translatedOrg = 7384;
      break;
    case 'inhealth':
      translatedOrg = 7242;
      break;
    case 'shiftsetgo':
      translatedOrg = 7355;
      break;
    default:
      translatedOrg = 1;
  }

  cy.log(`setting organizationId to ${translatedOrg}...`);
  Cypress.env('organizationId', translatedOrg);
});
