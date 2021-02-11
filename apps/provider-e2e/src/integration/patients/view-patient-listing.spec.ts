import { standardSetup } from '../../support'

const sortableHeaders = [
  {
    displayValue: 'First Name',
    value: 'firstName'
  },
  {
    displayValue: 'Last Name',
    value: 'lastName'
  },
  {
    displayValue: 'Start Weight',
    value: 'weight.first.value'
  },
  {
    displayValue: 'Current Weight',
    value: 'weight.last.value'
  },
  {
    displayValue: 'Weight Change',
    value: 'weight.change.value'
  },
  {
    displayValue: 'Weight Change (%)',
    value: 'weight.change.percentage'
  },
  {
    displayValue: 'Start Date',
    value: 'startedAt'
  },
  {
    displayValue: 'Start Weight Date',
    value: 'weight.first.recordedAt'
  },
  {
    displayValue: 'Current Weight Date',
    value: 'weight.last.recordedAt'
  }
]

describe('Patient Listing', function () {
  it('Start Date not affected by time or timezone offset (ET)', function () {
    cy.setTimezone('et')
    standardSetup()

    cy.visit(`/accounts/patients`)

    cy.get('table', { timeout: 10000 })
    cy.clock().tick(10000)

    cy.get('[data-cy="startDate"]')
      .eq(0)
      .should('contain', 'Jun 21, 2019')
      .should('contain', '(193 days)')

    cy.get('[data-cy="startDate"]')
      .eq(1)
      .should('contain', 'Jun 21, 2019')
      .should('contain', '(193 days)')
  })

  it('Start Date not affected by time or timezone offset (AET)', function () {
    cy.setTimezone('aet')
    standardSetup()

    cy.visit(`/accounts/patients`)

    cy.get('table', { timeout: 10000 })
    cy.clock().tick(10000)

    cy.get('[data-cy="startDate"]')
      .eq(0)
      .should('contain', 'Jun 21, 2019')
      .should('contain', '(194 days)')

    cy.get('[data-cy="startDate"]')
      .eq(1)
      .should('contain', 'Jun 21, 2019')
      .should('contain', '(194 days)')
  })

  it('Properly sorts the content based on the clicked header', function () {
    cy.setTimezone('aet')
    standardSetup()

    cy.visit(`/accounts/patients`)

    cy.get('table', { timeout: 10000 })
    cy.tick(10000)

    cy.get('thead').find('td').as('headerColumns')

    cy.wait('@patientListingGetRequest')

    for (const sortableHeader of sortableHeaders) {
      cy.get('@headerColumns')
        .contains(sortableHeader.displayValue)
        .parent()
        .find('ccr-table-sort-header')
        .find('div')
        .click({ force: true })

      cy.tick(1000)

      cy.wait('@patientListingGetRequest').should((xhr) => {
        expect(xhr.url).to.contain(`[property]=${sortableHeader.value}`)
      })

      cy.tick(1000)
    }
  })

  it('Properly changes the pagination size and stores the value', function () {
    cy.setTimezone('aet')
    standardSetup()

    cy.visit(`/accounts/patients`)

    cy.get('table', { timeout: 10000 })
    cy.tick(10000)

    cy.wait('@patientListingGetRequest')

    cy.get('ccr-page-size-selector').find('select').select('50')
    cy.tick(1000)

    cy.wait('@patientListingGetRequest').should((xhr) => {
      expect(xhr.url).to.contain('limit=50')
      expect(xhr.url).to.contain('offset=0')
      expect(localStorage.getItem('ccrDefaultPageSizePatientListing')).to.equal(
        '50'
      )
    })
  })
})
