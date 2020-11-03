import { standardSetup } from '../../support';

describe('Platform Updates', function () {
  beforeEach(() => {
    cy.setTimezone('et');
    standardSetup();

    cy.visit(`/resources/platform-updates`);
  });

  it('Properly shows the list of the Zendesk articles', function () {
    cy.get('app-platform-updates').find('li').as('articleListItems');

    cy.get('@articleListItems').should('have.length', 4);

    cy.get('@articleListItems')
      .eq(0)
      .should('contain', 'Clone Digital Library Content')
      .should('contain', 'Monday, September 7, 2020');
    cy.get('@articleListItems')
      .eq(0)
      .find('a')
      .invoke('attr', 'href')
      .should('contain', '?lang=en');

    cy.get('@articleListItems')
      .eq(1)
      .should('contain', 'Weight Threshold Alert')
      .should('contain', 'Tuesday, July 28, 2020');
    cy.get('@articleListItems')
      .eq(1)
      .find('a')
      .invoke('attr', 'href')
      .should('contain', '?lang=en');

    cy.get('@articleListItems')
      .eq(2)
      .should('contain', 'Patient Clinical Report')
      .should('contain', 'Monday, July 20, 2020');
    cy.get('@articleListItems')
      .eq(2)
      .find('a')
      .invoke('attr', 'href')
      .should('contain', '?lang=en');

    cy.get('@articleListItems')
      .eq(3)
      .should('contain', 'Video Conference Enhancements')
      .should('contain', 'Tuesday, May 19, 2020');
    cy.get('@articleListItems')
      .eq(3)
      .find('a')
      .invoke('attr', 'href')
      .should('contain', '?lang=en');
  });

  it('Properly show unread badges of the Zendesk articles', function () {
    cy.get('app-platform-updates').find('li').as('articleListItems');

    cy.get('@articleListItems').eq(0).should('have.class', 'unread');

    cy.get('@articleListItems').eq(1).should('not.have.class', 'unread');

    cy.get('@articleListItems').eq(2).should('not.have.class', 'unread');

    cy.get('@articleListItems').eq(3).should('not.have.class', 'unread');

    cy.get('@articleListItems')
      .eq(0)
      .find('a')
      .invoke('removeAttr', 'href')
      .invoke('attr', 'target', '_self')
      .click();

    cy.get('@articleListItems').eq(0).should('not.have.class', 'unread');
  });

  it('Properly sets the localStorage key for article checkout', function () {
    cy.get('app-platform-updates')
      .find('li')
      .then(() => {
        expect(localStorage['ccrNewsLastSeenTimestamp']).to.contain('Z'); // means a timestamp is set there
      });
  });
});
