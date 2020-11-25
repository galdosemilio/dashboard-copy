import { standardSetup } from '../../../support'

describe('Clinic Marketing List Management', function () {
  beforeEach(() => {
    cy.setTimezone('et')
  })

  it('Properly shows the list of associated marketing lists', function () {
    standardSetup(true)

    cy.visit(`/admin/organizations/${Cypress.env('organizationId')}/marketing`)

    cy.tick(10000)

    cy.get('ccr-organizations-active-campaign')
      .find('mat-table')
      .find('mat-row')
      .as('marketingListRows')

    cy.get('@marketingListRows').should('have.length', 4)

    cy.get('@marketingListRows')
      .eq(0)
      .should('contain', '31')
      .should('contain', 'CoachCare Employees')
      .should('contain', '30')
      .should('contain', 'CoachCare')
      .should('contain', 'Active')

    cy.get('@marketingListRows')
      .eq(1)
      .should('contain', '33')
      .should('contain', 'Client list 6.26.20')
      .should('contain', '7419')
      .should('contain', 'created under coachcare')
      .should('contain', 'Active')

    cy.get('@marketingListRows')
      .eq(2)
      .should('contain', '34')
      .should('contain', 'Homepage View Demo SEM')
      .should('contain', '3378')
      .should('contain', 'Test IP Clinic (SD)')
      .should('contain', 'Active')

    cy.get('@marketingListRows')
      .eq(3)
      .should('contain', '32')
      .should('contain', 'White Paper Landing Page')
      .should('contain', '3378')
      .should('contain', 'Test IP Clinic (SD)')
      .should('contain', 'Inactive')

    cy.get('ccr-organizations-active-campaign')
      .find('p.footnotes')
      .should('exist')
  })

  it('Properly filters the list of associated marketing lists', function () {
    standardSetup(true)

    cy.visit(`/admin/organizations/${Cypress.env('organizationId')}/marketing`)

    cy.tick(10000)

    cy.get('ccr-organizations-active-campaign')
      .find('div.mat-select-trigger')
      .click({ force: true })
    cy.tick(1000)

    cy.get('mat-option').contains('All').click({ force: true })
    cy.tick(1000)

    cy.wait('@activeCampaignListAssociationGetRequest').should((xhr) => {
      expect(xhr.url).to.contain('status=all')
    })

    cy.get('ccr-organizations-active-campaign')
      .find('div.mat-select-trigger')
      .click({ force: true })
    cy.tick(1000)

    cy.get('mat-option').contains('Inactive').click({ force: true })
    cy.tick(1000)

    cy.wait('@activeCampaignListAssociationGetRequest').should((xhr) => {
      expect(xhr.url).to.contain('status=inactive')
    })

    cy.get('ccr-organizations-active-campaign')
      .find('div.mat-select-trigger')
      .click({ force: true })
    cy.tick(1000)

    cy.get('mat-option').contains('Active').click({ force: true })
    cy.tick(1000)

    cy.wait('@activeCampaignListAssociationGetRequest').should((xhr) => {
      expect(xhr.url).to.contain('status=active')
    })
  })

  it('Properly disables the retroactive buttons if list is empty', function () {
    standardSetup(true, undefined, [
      {
        url: '1.0/active-campaign/list/association**',
        fixture: 'fixture:/api/general/emptyDataEmptyPagination'
      }
    ])

    cy.visit(`/admin/organizations/${Cypress.env('organizationId')}/marketing`)

    cy.tick(10000)

    cy.get('ccr-organizations-active-campaign')
      .find('button')
      .parent()
      .contains('Retroactively enroll one provider')
      .should('be.disabled')

    cy.get('ccr-organizations-active-campaign')
      .find('button')
      .parent()
      .contains('Retroactively enroll all providers at or below this clinic')
      .should('be.disabled')
  })

  it('Prevents users from deleting inherited associations of marketing lists', function () {
    standardSetup(true)

    cy.visit(`/admin/organizations/${Cypress.env('organizationId')}/marketing`)

    cy.tick(10000)

    cy.get('ccr-organizations-active-campaign')
      .find('mat-row')
      .as('activeCampaignListRows')

    cy.get('@activeCampaignListRows')
      .eq(0)
      .find('mat-icon')
      .parent()
      .parent()
      .should('be.disabled')

    cy.get('@activeCampaignListRows')
      .eq(1)
      .find('mat-icon')
      .parent()
      .parent()
      .should('be.disabled')
  })

  it('Allows admins to add marketing list associations', function () {
    standardSetup(true)

    cy.visit(`/admin/organizations/${Cypress.env('organizationId')}/marketing`)

    cy.tick(10000)

    cy.get('ccr-organizations-active-campaign')
      .find('button')
      .contains('Associate Active Campaign')
      .click({ force: true })
    cy.tick(1000)

    cy.get('mat-dialog-container')
      .find('div.mat-select-trigger')
      .click({ force: true })
    cy.tick(1000)

    cy.get('mat-option').contains('TEST').click({ force: true })
    cy.tick(1000)

    cy.get('mat-dialog-container')
      .find('button')
      .contains('Associate')
      .click({ force: true })
    cy.tick(1000)

    cy.wait('@activeCampaignListAssociationPostRequest').should((xhr) => {
      expect(xhr.request.body.list.id).to.equal('12')
      expect(xhr.request.body.list.name).to.equal('TEST')
      expect(xhr.request.body.organization).to.equal('3378')
    })

    cy.wait(2000)
  })

  it('Allows admins to remove a local marketing list association', function () {
    standardSetup(true)

    cy.visit(`/admin/organizations/${Cypress.env('organizationId')}/marketing`)

    cy.tick(10000)

    cy.get('ccr-organizations-active-campaign')
      .find('mat-table')
      .find('mat-row')
      .as('activeCampaignListRows')

    cy.get('@activeCampaignListRows')
      .eq(2)
      .find('button')
      .click({ force: true })
    cy.tick(1000)

    cy.get('mat-dialog-container')
      .find('button')
      .contains('Yes')
      .click({ force: true })
    cy.tick(1000)

    cy.wait('@activeCampaignListAssociationDeleteRequest').should((xhr) => {
      expect(xhr.url).to.contain('34')
    })

    cy.wait(2000)
  })

  it.only('Allows admins to retroactively enroll one provider', function () {
    standardSetup(true)

    cy.visit(`/admin/organizations/${Cypress.env('organizationId')}/marketing`)

    cy.tick(10000)

    cy.get('ccr-organizations-active-campaign')
      .find('mat-table')
      .find('mat-row')

    cy.get('ccr-organizations-active-campaign')
      .find('button')
      .contains('Retroactively enroll one provider')
      .click({ force: true })
    cy.tick(1000)

    cy.get('mat-dialog-container')
      .find('input[data-placeholder="Select Provider"]')
      .type('test')
    cy.tick(1000)

    cy.get('mat-option').contains('1030').click({ force: true })
    cy.tick(1000)

    cy.get('mat-dialog-container')
      .find('button')
      .contains('Enroll')
      .click({ force: true })
    cy.tick(1000)

    cy.wait('@activeCampaignListSubscriptionPostRequest').should((xhr) => {
      expect(xhr.request.body.account).to.equal('5606')
      expect(xhr.request.body.organization).to.equal(
        Cypress.env('organizationId')
      )
    })

    cy.wait(2000)
  })

  it('Allows admins to retroactively enroll all providers at or below the current clinic', function () {
    standardSetup(true)

    cy.visit(`/admin/organizations/${Cypress.env('organizationId')}/marketing`)

    cy.tick(10000)

    cy.get('ccr-organizations-active-campaign')
      .find('mat-table')
      .find('mat-row')

    cy.get('ccr-organizations-active-campaign')
      .find('button')
      .contains('Retroactively enroll all providers at or below this clinic')
      .click({ force: true })
    cy.tick(1000)

    cy.get('mat-dialog-container')
      .find('button')
      .contains('Yes')
      .click({ force: true })

    cy.wait('@activeCampaignListSubscriptionPostRequest').should((xhr) => {
      expect(xhr.request.body.account).to.equal('5606')
      expect(xhr.request.body.organization).to.equal(
        Cypress.env('organizationId')
      )
    })

    cy.wait('@activeCampaignListSubscriptionPostRequest').should((xhr) => {
      expect(xhr.request.body.account).to.equal('5608')
      expect(xhr.request.body.organization).to.equal(
        Cypress.env('organizationId')
      )
    })

    cy.wait(2000)
  })

  it('Allows enabling Active Campaign for the current clinic and its subclinics', function () {
    standardSetup(true)

    cy.visit(`/admin/organizations/${Cypress.env('organizationId')}/marketing`)

    cy.tick(10000)

    cy.get('ccr-organizations-active-campaign')
      .find('mat-table')
      .find('mat-row')

    cy.get('[data-cy="org-marketing-activeCampaign"]')
      .find('.mat-slide-toggle-input')
      .click({ force: true })

    cy.tick(1000)

    cy.get('[data-cy="org-marketing-activeCampaign"]')
      .find('.mat-slide-toggle-input')
      .click({ force: true })

    cy.tick(1000)

    cy.wait('@updateOrgCall').should((xhr) => {
      expect((xhr.request.body as any).useActiveCampaign).to.equal(false)
    })

    cy.wait('@updateOrgCall').should((xhr) => {
      expect((xhr.request.body as any).useActiveCampaign).to.equal(true)
    })
  })

  it('Allows disabling Active Campaign for the current clinic and its subclinics', function () {
    standardSetup(true)

    cy.visit(`/admin/organizations/${Cypress.env('organizationId')}/marketing`)

    cy.tick(10000)

    cy.get('ccr-organizations-active-campaign')
      .find('mat-table')
      .find('mat-row')

    cy.get('[data-cy="org-marketing-activeCampaign"]')
      .find('.mat-slide-toggle-input')
      .click({ force: true })

    cy.tick(1000)

    cy.wait('@updateOrgCall').should((xhr) => {
      expect((xhr.request.body as any).useActiveCampaign).to.equal(false)
    })
  })
})
