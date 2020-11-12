import { standardSetup } from './../../../support'

describe('Patient profile -> journal -> food', function () {
  it('Summary circles show with correct labels', function () {
    standardSetup()

    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/journal`)

    cy.get('app-dieter-journal-food').find('mat-grid-tile').as('summaryBoxes')
    cy.get('@summaryBoxes').should('have.length', 4)
    cy.get('@summaryBoxes').eq(0).should('contain', 'CALORIES')
    cy.get('@summaryBoxes').eq(1).should('contain', 'PROTEIN')
    cy.get('@summaryBoxes')
      .eq(2)
      .should('contain', 'CARB')
      .should('contain', 'Fiber')
      .should('contain', 'Sugar')
    cy.get('@summaryBoxes')
      .eq(3)
      .should('contain', 'FAT')
      .should('contain', 'Sat. Fat')

    // wait for cypress to load sidepanel
    cy.get('app-rightpanel-reminders').find('.mat-subheader')
    cy.wait(3000)
  })

  it('Values show correct in Eastern Time (New York)', function () {
    cy.setTimezone('et')
    standardSetup()

    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/journal`)

    cy.get('app-dieter-journal-food').find('mat-grid-tile').as('summaryBoxes')
    cy.get('@summaryBoxes').should('have.length', 4)
    cy.get('@summaryBoxes').eq(0).should('contain', '300')
    cy.get('@summaryBoxes').eq(1).should('contain', '30.0g')
    cy.get('@summaryBoxes')
      .eq(2)
      .should('contain', '3.0g')
      .should('contain', '3.0g')
      .should('contain', '0g')
    cy.get('@summaryBoxes')
      .eq(3)
      .should('contain', '3.0g')
      .should('contain', '0g')

    cy.get('app-dieter-journal-food-table')
      .find('mat-row.level0')
      .as('tableRows')

    cy.get('@tableRows').should('have.length', 7)

    cy.get('@tableRows').eq(0).should('contain', 'Wednesday, Dec 25')
    cy.get('@tableRows').eq(1).should('contain', 'Thursday, Dec 26')
    cy.get('@tableRows').eq(2).should('contain', 'Friday, Dec 27')
    cy.get('@tableRows').eq(3).should('contain', 'Saturday, Dec 28')
    cy.get('@tableRows').eq(4).should('contain', 'Sunday, Dec 29')
    cy.get('@tableRows').eq(5).should('contain', 'Monday, Dec 30')
    cy.get('@tableRows').eq(6).should('contain', 'Tuesday, Dec 31')

    // Inspect for specific ingredients
    cy.get('@tableRows').eq(5).find('.expandable').trigger('click')

    cy.get('@tableRows').eq(6).find('.expandable').trigger('click')

    cy.get('app-dieter-journal-food-table')
      .find('mat-row.level1')
      .not('.hidden')
      .as('mealRows')

    cy.get('@mealRows').should('have.length', 8)

    cy.get('@mealRows').eq(0).find('.expandable').trigger('click')

    cy.get('@mealRows').eq(5).find('.expandable').trigger('click')

    cy.get('@mealRows').eq(6).find('.expandable').trigger('click')

    cy.get('app-dieter-journal-food-table')
      .find('mat-row.level2')
      .not('.hidden')
      .as('consumedRow')

    cy.get('@consumedRow')
      .eq(0)
      .should('contain', 'Chocolate Mint Pudding & Shake')
      .should('contain', '2 1/2')
      .should('contain', '100')
      .should('contain', '10 g')
    cy.get('@consumedRow')
      .eq(1)
      .should('contain', 'Chocolate Beverage - Natural')
      .should('contain', '1')
      .should('contain', '200')
      .should('contain', '20 g')
    cy.get('@consumedRow')
      .eq(2)
      .should('contain', 'Caramel Cocoa Bar')
      .should('contain', '1 3/4')
      .should('contain', '300')
      .should('contain', '30 g')

    cy.wait(3000)
  })

  it('Values show correct in Eastern Time (Australia)', function () {
    cy.setTimezone('aet')
    standardSetup()

    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/journal`)

    cy.get('app-dieter-journal-food').find('mat-grid-tile').as('summaryBoxes')
    cy.get('@summaryBoxes').should('have.length', 4)
    cy.get('@summaryBoxes').eq(0).should('contain', '300')
    cy.get('@summaryBoxes').eq(1).should('contain', '30.0g')
    cy.get('@summaryBoxes')
      .eq(2)
      .should('contain', '3.0g')
      .should('contain', '3.0g')
      .should('contain', '0g')
    cy.get('@summaryBoxes')
      .eq(3)
      .should('contain', '3.0g')
      .should('contain', '0g')

    cy.get('app-dieter-journal-food-table')
      .find('mat-row.level0')
      .as('tableRows')

    cy.get('@tableRows').should('have.length', 7)

    cy.get('@tableRows').eq(0).should('contain', 'Thursday, Dec 26')
    cy.get('@tableRows').eq(1).should('contain', 'Friday, Dec 27')
    cy.get('@tableRows').eq(2).should('contain', 'Saturday, Dec 28')
    cy.get('@tableRows').eq(3).should('contain', 'Sunday, Dec 29')
    cy.get('@tableRows').eq(4).should('contain', 'Monday, Dec 30')
    cy.get('@tableRows').eq(5).should('contain', 'Tuesday, Dec 31')
    cy.get('@tableRows').eq(6).should('contain', 'Wednesday, Jan 1')

    // Inspect for specific ingredients
    cy.get('@tableRows').eq(5).find('.expandable').trigger('click')

    cy.get('@tableRows').eq(6).find('.expandable').trigger('click')

    cy.get('app-dieter-journal-food-table')
      .find('mat-row.level1')
      .not('.hidden')
      .as('mealRows')

    cy.get('@mealRows').should('have.length', 8)

    cy.get('@mealRows').eq(0).find('.expandable').trigger('click')

    cy.get('@mealRows').eq(5).find('.expandable').trigger('click')

    cy.get('@mealRows').eq(6).find('.expandable').trigger('click')

    cy.get('app-dieter-journal-food-table')
      .find('mat-row.level2')
      .not('.hidden')
      .as('consumedRow')

    cy.get('@consumedRow')
      .eq(0)
      .should('contain', 'Chocolate Mint Pudding & Shake')
      .should('contain', '2 1/2')
      .should('contain', '100')
      .should('contain', '10 g')
    cy.get('@consumedRow')
      .eq(1)
      .should('contain', 'Chocolate Beverage - Natural')
      .should('contain', '1')
      .should('contain', '200')
      .should('contain', '20 g')
    cy.get('@consumedRow')
      .eq(2)
      .should('contain', 'Caramel Cocoa Bar')
      .should('contain', '1 3/4')
      .should('contain', '300')
      .should('contain', '30 g')

    cy.wait(3000)
  })
})
