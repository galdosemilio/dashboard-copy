import { assertElement, assertTableRow } from '../../../helpers'
import { standardSetup } from './../../../../support'

describe('Patient profile -> journal -> food', function () {
  it('Summary circles show with correct labels', function () {
    standardSetup()

    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/journal`)

    cy.get('app-dieter-journal-food')
      .find('[data-cy="food-circle"]')
      .as('summaryBoxes')
    cy.get('@summaryBoxes').should('have.length', 5)

    assertElement(cy.get('@summaryBoxes').eq(0), ['CALORIES'])
    assertElement(cy.get('@summaryBoxes').eq(1), ['PROTEIN'])
    assertElement(cy.get('@summaryBoxes').eq(2), ['CARB', 'Fiber', 'Sugar'])
    assertElement(cy.get('@summaryBoxes').eq(3), ['FAT', 'Sat. Fat'])
  })

  it('Values show correct in Eastern Time (New York)', function () {
    cy.setTimezone('et')
    standardSetup()

    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/journal`)

    cy.get('app-dieter-journal-food')
      .find('[data-cy="food-circle"]')
      .as('summaryBoxes')
    cy.get('@summaryBoxes').should('have.length', 5)

    assertElement(cy.get('@summaryBoxes').eq(0), ['300'])
    assertElement(cy.get('@summaryBoxes').eq(1), ['30.0g'])
    assertElement(cy.get('@summaryBoxes').eq(2), ['3.0g', '0g'])
    assertElement(cy.get('@summaryBoxes').eq(3), ['3.0g', '0g'])

    cy.get('app-dieter-journal-food-table').find('.newday-row').as('tableRows')

    cy.get('@tableRows').should('have.length', 7)

    assertTableRow(cy.get('@tableRows').eq(0), ['Wednesday, Dec 25'])
    assertTableRow(cy.get('@tableRows').eq(1), ['Thursday, Dec 26'])
    assertTableRow(cy.get('@tableRows').eq(2), ['Friday, Dec 27'])
    assertTableRow(cy.get('@tableRows').eq(3), ['Saturday, Dec 28'])
    assertTableRow(cy.get('@tableRows').eq(4), ['Sunday, Dec 29'])
    assertTableRow(cy.get('@tableRows').eq(5), ['Monday, Dec 30'])
    assertTableRow(cy.get('@tableRows').eq(6), ['Tuesday, Dec 31'])

    // Inspect for specific ingredients
    cy.get('@tableRows').eq(5).find('.clickable').trigger('click')

    cy.get('@tableRows').eq(6).find('.clickable').trigger('click')

    cy.get('app-dieter-journal-food-table')
      .find('.mealtype-row')
      .not('.hidden')
      .as('mealRows')

    cy.get('@mealRows').should('have.length', 8)

    cy.get('@mealRows').eq(0).find('.clickable').trigger('click')

    cy.get('@mealRows').eq(5).find('.clickable').trigger('click')

    cy.get('@mealRows').eq(6).find('.clickable').trigger('click')

    cy.get('app-dieter-journal-food-table')
      .find('.meal-row')
      .not('.hidden')
      .as('consumedRow')

    assertTableRow(cy.get('@consumedRow').eq(0), [
      'Chocolate Mint Pudding & Shake',
      '2 1/2',
      '100',
      '10 g'
    ])

    assertTableRow(cy.get('@consumedRow').eq(1), [
      'Chocolate Beverage - Natural',
      '1',
      '200',
      '20 g'
    ])

    assertTableRow(cy.get('@consumedRow').eq(2), [
      'Caramel Cocoa Bar',
      '1 3/4',
      '300',
      '30 g'
    ])
  })

  it('Values show correct in Eastern Time (Australia)', function () {
    cy.setTimezone('aet')
    standardSetup()

    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/journal`)

    cy.get('app-dieter-journal-food')
      .find('[data-cy="food-circle"]')
      .as('summaryBoxes')
    cy.get('@summaryBoxes').should('have.length', 5)

    assertElement(cy.get('@summaryBoxes').eq(0), ['300'])
    assertElement(cy.get('@summaryBoxes').eq(1), ['30.0g'])
    assertElement(cy.get('@summaryBoxes').eq(2), ['3.0g', '0g'])
    assertElement(cy.get('@summaryBoxes').eq(3), ['3.0g', '0g'])

    cy.get('app-dieter-journal-food-table').find('.newday-row').as('tableRows')

    cy.get('@tableRows').should('have.length', 7)

    assertTableRow(cy.get('@tableRows').eq(0), ['Thursday, Dec 26'])
    assertTableRow(cy.get('@tableRows').eq(1), ['Friday, Dec 27'])
    assertTableRow(cy.get('@tableRows').eq(2), ['Saturday, Dec 28'])
    assertTableRow(cy.get('@tableRows').eq(3), ['Sunday, Dec 29'])
    assertTableRow(cy.get('@tableRows').eq(4), ['Monday, Dec 30'])
    assertTableRow(cy.get('@tableRows').eq(5), ['Tuesday, Dec 31'])
    assertTableRow(cy.get('@tableRows').eq(6), ['Wednesday, Jan 1'])

    // Inspect for specific ingredients
    cy.get('@tableRows').eq(5).find('.clickable').trigger('click')

    cy.get('@tableRows').eq(6).find('.clickable').trigger('click')

    cy.get('app-dieter-journal-food-table')
      .find('.mealtype-row')
      .not('.hidden')
      .as('mealRows')

    cy.get('@mealRows').should('have.length', 8)

    cy.get('@mealRows').eq(0).find('.clickable').trigger('click')

    cy.get('@mealRows').eq(5).find('.clickable').trigger('click')

    cy.get('@mealRows').eq(6).find('.clickable').trigger('click')

    cy.get('app-dieter-journal-food-table')
      .find('.meal-row')
      .not('.hidden')
      .as('consumedRow')

    assertTableRow(cy.get('@consumedRow').eq(0), [
      'Chocolate Mint Pudding & Shake',
      '2 1/2',
      '100',
      '10 g'
    ])

    assertTableRow(cy.get('@consumedRow').eq(1), [
      'Chocolate Beverage - Natural',
      '1',
      '200',
      '20 g'
    ])

    assertTableRow(cy.get('@consumedRow').eq(2), [
      'Caramel Cocoa Bar',
      '1 3/4',
      '300',
      '30 g'
    ])
  })

  it('Food info is properly converted', function () {
    cy.setTimezone('aet')
    standardSetup()

    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/journal`)

    cy.get('app-dieter-journal-food-table').find('.newday-row').as('dayRows')

    cy.get('@dayRows').eq(5).as('focusRow')

    assertTableRow(cy.get('@focusRow'), [
      '100',
      '10 g',
      'Fiber 1 g',
      'Net Carbs 0 g',
      'Sugar 10 g',
      'Fiber 1 g',
      'Polyunsaturated 1 g',
      'Monounsaturated 1 g',
      'Sat. Fat 0 g',
      'Trans Fat 1 g',
      'Cholesterol 10 mg',
      'Sodium 100 mg',
      'Calcium 1,000 mg',
      'Iron 1 mg',
      'Potassium 100 mg',
      'Vitamin A 1 μg',
      'Vitamin B 1 μg',
      'Vitamin C 1 mg',
      'Vitamin D 1 μg'
    ])
  })
})
