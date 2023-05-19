import { standardSetup } from '../../../../support'
import { getRpmBillingRows } from '../../../../support/care-management'

describe('Reports -> RPM -> Care Management Billing Codes', function () {
  beforeEach(() => {
    cy.setTimezone('et')
  })

  it('Table shows RPM CPT codes correctly', function () {
    standardSetup()

    getRpmBillingRows()

    verifyCPTCode(
      '99453',
      0,
      11,
      '[data-cy="cpt-code-claim-date"]',
      '11/16/2020'
    )
    verifyCPTCode(
      '99453',
      0,
      12,
      '[data-cy="cpt-code-next-claim-requirements"]',
      null
    )
    verifyCPTCode('99454', 0, 12, '[data-cy="cpt-code-claim-date"]', null)
    verifyCPTCode('99454', 0, 12, 'ccr-rpm-calendar-icon', '31d')
    verifyCPTCode('99454', 0, 12, 'ccr-rpm-scale-icon', '15')
    verifyCPTCode('99457', 0, 13, '[data-cy="cpt-code-claim-date"]', null)
    verifyCPTCode('99457', 0, 13, 'ccr-rpm-calendar-icon', '31d')
    verifyCPTCode('99457', 0, 13, 'ccr-rpm-clock-icon', '20m')
    verifyCPTCode('99457', 0, 13, 'ccr-rpm-chat-icon', '1')

    verifyCPTCode(
      '99453',
      1,
      11,
      '[data-cy="cpt-code-claim-date"]',
      '01/31/2020'
    )
    verifyCPTCode('99453', 1, 12, '[data-cy="cpt-code-claim-date"]', null)
    verifyCPTCode('99454', 1, 12, '[data-cy="cpt-code-claim-date"]', null)
    verifyCPTCode('99454', 1, 12, 'ccr-rpm-calendar-icon', '32d')
    verifyCPTCode('99454', 1, 12, 'ccr-rpm-scale-icon', '14')
    verifyCPTCode('99457', 1, 13, '[data-cy="cpt-code-claim-date"]', null)
    verifyCPTCode('99457', 1, 13, 'ccr-rpm-calendar-icon', '32d')
    verifyCPTCode('99457', 1, 13, 'ccr-rpm-clock-icon', '10m')
    verifyCPTCode('99457', 1, 13, 'ccr-rpm-chat-icon', '1')

    verifyCPTCode(
      '99453',
      2,
      11,
      '[data-cy="cpt-code-claim-date"]',
      '02/01/2020'
    )
    verifyCPTCode(
      '99453',
      2,
      12,
      '[data-cy="cpt-code-next-claim-requirements"]',
      null
    )
    verifyCPTCode('99454', 2, 12, '[data-cy="cpt-code-claim-date"]', null)
    verifyCPTCode('99454', 2, 12, 'ccr-rpm-calendar-icon', '31d')
    verifyCPTCode('99454', 2, 12, 'ccr-rpm-scale-icon', null)
    verifyCPTCode('99457', 2, 13, '[data-cy="cpt-code-claim-date"]', null)
    verifyCPTCode('99457', 2, 13, 'ccr-rpm-calendar-icon', '27d')
    verifyCPTCode('99457', 2, 13, 'ccr-rpm-clock-icon', '10m')
    verifyCPTCode('99457', 2, 13, 'ccr-rpm-chat-icon', null)

    verifyCPTCode('99453', 3, 11, '[data-cy="cpt-code-claim-date"]', null)
    verifyCPTCode('99453', 3, 11, 'ccr-rpm-calendar-icon', '23d')
    verifyCPTCode('99453', 3, 11, 'ccr-rpm-scale-icon', '5')
    verifyCPTCode(
      '99454',
      3,
      12,
      '[data-cy="cpt-code-claim-date"]',
      '12/31/2019'
    )
    verifyCPTCode('99454', 3, 12, 'ccr-rpm-calendar-icon', '16d')
    verifyCPTCode('99454', 3, 12, 'ccr-rpm-scale-icon', null)
    verifyCPTCode(
      '99457',
      3,
      13,
      '[data-cy="cpt-code-claim-date"]',
      '12/31/2019'
    )
    verifyCPTCode('99457', 3, 13, 'ccr-rpm-calendar-icon', '31d')
    verifyCPTCode('99457', 3, 13, 'ccr-rpm-clock-icon', null)
    verifyCPTCode('99457', 3, 13, 'ccr-rpm-chat-icon', null)

    verifyCPTCode('99453', 4, 11, '[data-cy="cpt-code-claim-date"]', null)
    verifyCPTCode('99453', 4, 11, 'ccr-rpm-calendar-icon', '1d')
    verifyCPTCode(
      '99454',
      4,
      12,
      '[data-cy="cpt-code-claim-date"]',
      '01/01/2020'
    )
    verifyCPTCode('99454', 4, 12, 'ccr-rpm-calendar-icon', '1d')
    verifyCPTCode('99454', 4, 12, 'ccr-rpm-scale-icon', null)
    verifyCPTCode(
      '99457',
      4,
      13,
      '[data-cy="cpt-code-claim-date"]',
      '12/31/2019'
    )
    verifyCPTCode('99457', 4, 13, '[data-cy="cpt-code-claim-date"]', null)
    verifyCPTCode('99457', 4, 13, 'ccr-rpm-calendar-icon', null)
    verifyCPTCode('99457', 4, 13, 'ccr-rpm-clock-icon', null)
    verifyCPTCode('99457', 4, 13, 'ccr-rpm-chat-icon', null)
  })
})

function verifyCPTCode(
  cptCode: '99453' | '99454' | '99457' | '99458x1' | '99458x2',
  row: number,
  column: number,
  element:
    | '[data-cy="cpt-code-claim-date"]'
    | '[data-cy="cpt-code-next-claim-requirements"]'
    | 'ccr-rpm-calendar-icon'
    | 'ccr-rpm-scale-icon'
    | 'ccr-rpm-clock-icon'
    | 'ccr-rpm-chat-icon',
  displayedText: string | null
): void {
  cy.log(`Verify CPT code ${cptCode}`)

  // Test for the case where the icon is not shown
  if (element.includes('-icon') && displayedText === null) {
    cy.get('@rpmBillingRows')
      .eq(row)
      .find('td')
      .eq(column)
      .find(element)
      .should('not.exist')
  } else {
    cy.get('@rpmBillingRows')
      .eq(row)
      .find('td')
      .eq(column)
      .find(element)
      .should(
        displayedText === null ? 'not.have.text' : 'contain',
        displayedText
      )
  }
}
