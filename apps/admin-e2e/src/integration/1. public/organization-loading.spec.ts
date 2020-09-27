import { standardSetup } from '../../support';

function validateOrgPreferenceCalls(orgId: string) {
  cy.wait('@apiCallOrgPreference')
    .its('url')
    .should('include', `4.0/organization/${orgId}/preference/assets?id=${orgId}&mala=true`)
    .its('status')
    .should('be', 200);
  cy.wait('@apiCallAndroidApp')
    .its('url')
    .should('include', `1.0/app/android/${orgId}`)
    .its('status')
    .should('be', 200);
  cy.wait('@apiCallIosApp')
    .its('url')
    .should('include', `1.0/app/ios/${orgId}`)
    .its('status')
    .should('be', 200);
}

function validateAppStoreBadges() {
  cy.get('.badge-button-wrapper-lg-and-up')
    .find('a')
    .should('have.length', 2)
    .as('appStoreBadges');

  cy.get('@appStoreBadges')
    .eq(0)
    .find('img')
    .should('have.attr', 'src', '/assets/badges/en-app-store-badge.png');

  cy.get('@appStoreBadges')
    .eq(1)
    .find('img')
    .should('have.attr', 'src', '/assets/badges/en-play-store-badge.png');
}

describe('Load homepage', function() {
  beforeEach(() => {
    cy.setTimezone('et');
    standardSetup(false);
  });

  it('Load default organization homepage (30) with app links', function() {
    cy.visit(`/`);

    cy.url().should('include', 'baseOrg=30');
    cy.getCookie('ccrOrg').should('be', '30');

    validateAppStoreBadges();
    validateOrgPreferenceCalls('30');
  });

  it('Load default organization homepage (30) with no app links', function() {
    cy.route({
      method: 'GET',
      url: '1.0/app/android/30',
      status: 404,
      response: {}
    });
    cy.route({
      method: 'GET',
      url: '1.0/app/ios/30',
      status: 404,
      response: {}
    });

    cy.visit(`/`);

    cy.url().should('include', 'baseOrg=30');
    cy.getCookie('ccrOrg').should('be', '30');

    cy.get('.badge-button-wrapper-lg-and-up')
      .find('a')
      .should('have.length', 0);

    cy.wait('@apiCallOrgPreference')
      .its('url')
      .should('include', `4.0/organization/30/preference/assets?id=30&mala=true`)
      .its('status')
      .should('be', 200);
  });

  it('Load custom organization homepage as uri segment (31)', function() {
    cy.visit(`/31`);

    cy.url().should('include', 'baseOrg=31');
    cy.getCookie('ccrOrg').should('be', '31');

    validateOrgPreferenceCalls('31');
    validateAppStoreBadges();
  });

  it('Visit clean url after custom organization homepage as uri segment (31)', function() {
    cy.visit(`/31`);

    cy.url().should('include', 'baseOrg=31');
    cy.getCookie('ccrOrg').should('be', '31');

    validateOrgPreferenceCalls('31');
    validateAppStoreBadges();

    cy.visit(`/`);

    cy.url().should('include', 'baseOrg=31');
    cy.getCookie('ccrOrg').should('be', '31');

    validateOrgPreferenceCalls('31');
    validateAppStoreBadges();
  });

  it('Load custom organization homepage as query param (32)', function() {
    cy.visit(`/?baseOrg=32`);

    cy.url().should('include', 'baseOrg=32');
    cy.getCookie('ccrOrg').should('be', '32');

    validateOrgPreferenceCalls('32');
    validateAppStoreBadges();
  });

  it('Visit clean url after custom organization homepage as query param (32)', function() {
    cy.visit(`/?baseOrg=32`);

    cy.url().should('include', 'baseOrg=32');
    cy.getCookie('ccrOrg').should('be', '32');

    validateOrgPreferenceCalls('32');
    validateAppStoreBadges();

    cy.visit(`/`);

    cy.url().should('include', 'baseOrg=32');
    cy.getCookie('ccrOrg').should('be', '32');

    validateOrgPreferenceCalls('32');
    validateAppStoreBadges();
  });
});
