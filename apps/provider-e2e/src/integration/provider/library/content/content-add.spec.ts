import { standardSetup } from '../../../../support'

describe('Dashboard -> Digital Library -> Add Content', function () {
  it('Shows Content Listing data in Eastern Time (New York)', function () {
    cy.setTimezone('et')
    standardSetup()

    cy.visit(`/library/content`)

    cy.get('[data-cy="add-content-button"]').trigger('click')

    cy.get('[data-cy="content-type-button"]').as('contentTypeButtons')

    cy.get('@contentTypeButtons').should('have.length', 4)
    cy.get('@contentTypeButtons').eq(0).should('contain', 'File')
    cy.get('@contentTypeButtons').eq(1).should('contain', 'Hyperlink')
    cy.get('@contentTypeButtons').eq(2).should('contain', 'Youtube')
    cy.get('@contentTypeButtons').eq(3).should('contain', 'Vimeo')
  })
})
