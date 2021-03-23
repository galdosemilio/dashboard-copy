import { standardSetup } from './../../../support'

describe('Patient profile -> measurement -> vitals', function () {
  it('Right panel allows measurement posting', function () {
    cy.setTimezone('et')
    standardSetup()

    cy.intercept('POST', `/2.0/measurement/body`, (request) => {
      expect(request.body.totalCholesterol).to.equal('20')
      expect(request.body.ldl).to.equal('20')
      expect(request.body.hdl).to.equal('20')
      expect(request.body.vldl).to.equal('20')
      expect(request.body.triglycerides).to.equal('20')
      expect(request.body.fastingGlucose).to.equal('20')
      expect(request.body.hba1c).to.equal('20000')
      expect(request.body.insulin).to.equal('50')
      expect(request.body.hsCrp).to.equal('200000')
      expect(request.body.temperature).to.equal('3667')
      expect(request.body.heartRate).to.equal('20')
      expect(request.body.bloodPressureSystolic).to.equal('20')
      expect(request.body.bloodPressureDiastolic).to.equal('20')
      expect(request.body.respirationRate).to.equal('20')
      request.reply({})
    })

    cy.visit(
      `/accounts/patients/${Cypress.env('clientId')}/measurements;s=vitals`
    )

    cy.get('.mat-radio-container').as('radioButtons')

    cy.clock().tick(100000)

    cy.get('@radioButtons').should('have.length', 4)

    cy.get('@radioButtons').eq(3).click()

    cy.clock().tick(100000)

    cy.get('input.mat-input-element[data-placeholder="Total Cholesterol"]')
      .eq(0)
      .type('20')

    cy.get(
      'input.mat-input-element[data-placeholder="Low-Density Lipoprotein"]'
    )
      .eq(0)
      .type('20')

    cy.get(
      'input.mat-input-element[data-placeholder="High-Density lipoprotein"]'
    )
      .eq(0)
      .type('20')

    cy.get(
      'input.mat-input-element[data-placeholder="Very Low-Density Lipoprotein"]'
    )
      .eq(0)
      .type('20')

    cy.get('input.mat-input-element[data-placeholder="Triglycerides"]')
      .eq(0)
      .type('20')

    cy.get('input.mat-input-element[data-placeholder="Fasting Glucose"]')
      .eq(0)
      .type('20')

    cy.get('input.mat-input-element[data-placeholder="HbA1c"]').eq(0).type('20')

    cy.get('input.mat-input-element[data-placeholder="Insulin"]')
      .eq(0)
      .type('50')

    cy.get('input.mat-input-element[data-placeholder="HSCRP"]').eq(0).type('20')

    cy.get('input.mat-input-element[data-placeholder="Body Temperature"]')
      .eq(0)
      .type('98')

    cy.get('input.mat-input-element[data-placeholder="Heart Rate"]')
      .eq(0)
      .type('20')

    cy.get(
      'input.mat-input-element[data-placeholder="Systolic Blood Pressure"]'
    )
      .eq(0)
      .type('20')

    cy.get(
      'input.mat-input-element[data-placeholder="Diastolic Blood Pressure"]'
    )
      .eq(0)
      .type('20')

    cy.get('input.mat-input-element[data-placeholder="Respiration Rate"]')
      .eq(0)
      .type('20')

    cy.get('form').find('a.ccr-icon-button.mat-button').click()

    // cy.get('@vitalInputs').should('have.length', 24);

    // cy.get('@vitalInputs').eq(10).
  })

  it('Table shows vitals data and units', function () {
    cy.setTimezone('et')
    standardSetup()

    cy.visit(
      `/accounts/patients/${Cypress.env('clientId')}/measurements;s=vitals`
    )

    cy.get('app-dieter-measurements-table')
      .find('tbody tr')
      .as('measurementRows')

    cy.clock().tick(100000)

    cy.get('@measurementRows').should('have.length', 13)

    cy.get('@measurementRows').eq(12).find('td').as('measurementCells')

    cy.get('@measurementCells').should('have.length', 16)

    cy.get('@measurementCells').eq(2).should('contain', '20 mg/dl')

    cy.get('@measurementCells').eq(3).should('contain', '20 mg/dl')

    cy.get('@measurementCells').eq(4).should('contain', '20 mg/dl')

    cy.get('@measurementCells').eq(5).should('contain', '20 mg/dl')

    cy.get('@measurementCells').eq(6).should('contain', '20 mg/dl')

    cy.get('@measurementCells').eq(7).should('contain', '20 mg/dl')

    cy.get('@measurementCells').eq(8).should('contain', '20 %')

    cy.get('@measurementCells').eq(9).should('contain', '20 mg/l')

    cy.get('@measurementCells').eq(10).should('contain', '64.4 ℉')

    cy.get('@measurementCells').eq(11).should('contain', '20 /min')

    cy.get('@measurementCells').eq(12).should('contain', '20 /min')

    cy.get('@measurementCells').eq(13).should('contain', '20/20')
  })
})
