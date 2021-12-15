import { standardSetup } from './../../../support'

describe('Account Search in Top Menu', function () {
  it('Account search should not be visible (no org access)', function () {
    cy.setOrganization('ccr')
    standardSetup()
    cy.intercept('GET', '/2.0/access/organization?**', {
      fixture: 'api/general/emptyDataEmptyPagination'
    })
    cy.visit('/')

    cy.get('app-profile')

    cy.tick(10000)

    cy.get('app-topbar').find('app-search').should('not.exist')
    cy.get('[data-cy="search-disabled"]').should('exist')

    // Adding for Cypress issue where page continues to load after spec is done
    cy.get('form-field-lang').should('have.length', 1)
  })

  it('Account search should be visible: no permissions', function () {
    cy.setOrganization('ccr')
    standardSetup({
      apiOverrides: [
        {
          url: '/2.0/access/organization?**',
          fixture: 'api/organization/getAll-nopermissions'
        }
      ]
    })
    cy.visit('/')

    cy.get('app-search').should('exist')
    cy.get('[data-cy="search-disabled"]').should('not.exist')

    verifyActiveAccountsInSearchResults([
      {
        type: 'coach',
        clickable: false,
        callable: true
      }
    ])
  })

  it('Account search should be visible: only client phi', function () {
    cy.setOrganization('ccr')
    standardSetup({
      apiOverrides: [
        {
          url: '/2.0/access/organization?**',
          fixture: 'api/organization/getAll-onlyclientphi'
        }
      ]
    })
    cy.visit('/')

    cy.get('app-search').should('exist')
    cy.get('[data-cy="search-disabled"]').should('not.exist')

    verifyActiveAccountsInSearchResults([
      {
        type: 'coach',
        clickable: false,
        callable: true
      }
    ])
  })

  it('Account search should be visible: only view all', function () {
    cy.setOrganization('ccr')
    standardSetup({
      apiOverrides: [
        {
          url: '/2.0/access/organization?**',
          fixture: 'api/organization/getAll-onlyviewall'
        }
      ]
    })
    cy.visit('/')

    cy.get('app-search').should('exist')
    cy.get('[data-cy="search-disabled"]').should('not.exist')

    verifyActiveAccountsInSearchResults([
      {
        type: 'coach',
        clickable: false,
        callable: true
      },
      {
        type: 'patient',
        clickable: false,
        callable: false
      }
    ])
  })

  it('Account search should be visible: only admin', function () {
    cy.setOrganization('ccr')
    standardSetup({
      apiOverrides: [
        {
          url: '/2.0/access/organization?**',
          fixture: 'api/organization/getAll-onlyadmin'
        }
      ]
    })
    cy.visit('/')

    cy.get('app-search').should('exist')
    cy.get('[data-cy="search-disabled"]').should('not.exist')

    verifyActiveAccountsInSearchResults([
      {
        type: 'coach',
        clickable: true,
        callable: true
      }
    ])
  })

  it('Account search should be visible: view all and client phi', function () {
    cy.setOrganization('ccr')
    standardSetup({
      apiOverrides: [
        {
          url: '/2.0/access/organization?**',
          fixture: 'api/organization/getAll-noadmin'
        }
      ]
    })
    cy.visit('/')

    cy.get('app-search').should('exist')
    cy.get('[data-cy="search-disabled"]').should('not.exist')

    verifyActiveAccountsInSearchResults([
      {
        type: 'coach',
        clickable: false,
        callable: true
      },
      {
        type: 'patient',
        clickable: true,
        callable: true
      }
    ])
  })

  it('Account search should be visible: all permissions', function () {
    cy.setOrganization('ccr')
    standardSetup({
      apiOverrides: [
        {
          url: '/2.0/access/organization?**',
          fixture: 'api/organization/getAll'
        }
      ]
    })
    cy.visit('/')

    cy.get('app-search').should('exist')
    cy.get('[data-cy="search-disabled"]').should('not.exist')

    verifyActiveAccountsInSearchResults([
      {
        type: 'coach',
        clickable: true,
        callable: true
      },
      {
        type: 'patient',
        clickable: true,
        callable: true
      }
    ])
  })
})

function verifyActiveAccountsInSearchResults(accounts: VerifyAccount[]): void {
  cy.clock().tick(10000)

  cy.get('[data-cy="account-search-box"]').eq(1).type('eric')

  cy.clock().tick(10000).wait(500)

  cy.get('[data-cy="account-search-box"]').eq(1).type('{backspace}')

  cy.get('.cdk-overlay-container').find('mat-option').eq(0).as('coach')

  cy.get('@coach').contains('Coach')

  cy.get('@coach').find('ccr-call-control').should('exist')

  cy.get('.cdk-overlay-container').find('mat-option').eq(1).as('patient')

  cy.get('@patient').contains('Patient')

  if (accounts.find((a) => a.type === 'coach')) {
    const setup: VerifyAccount = accounts.find((a) => a.type === 'coach')

    cy.get('@coach').should(
      !setup.clickable ? 'have.class' : 'not.have.class',
      'noAccess'
    )
    cy.get('@coach')
      .find('ccr-call-control')
      .should(setup.callable ? 'exist' : 'not.exist')
  }
  if (accounts.find((a) => a.type === 'patient')) {
    const setup: VerifyAccount = accounts.find((a) => a.type === 'patient')

    cy.get('@patient').should(
      !setup.clickable ? 'have.class' : 'not.have.class',
      'noAccess'
    )
    cy.get('@patient')
      .find('ccr-call-control')
      .should(setup.callable ? 'exist' : 'not.exist')
  }
}

interface VerifyAccount {
  type: 'coach' | 'patient'
  clickable: boolean
  callable: boolean
}
