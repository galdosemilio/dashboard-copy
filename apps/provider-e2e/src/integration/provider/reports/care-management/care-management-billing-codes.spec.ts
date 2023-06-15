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

  it('Table show CCM CPT codes correctly', () => {
    standardSetup({
      apiOverrides: [
        {
          url: '/1.0/warehouse/care-management/billing/snapshot**',
          fixture: 'api/warehouse/getCCMBillingSnapshotMultiple'
        }
      ]
    })

    getRpmBillingRows({
      serviceType: {
        id: '2',
        name: 'CCM',
        code: 'ccm'
      }
    })

    // not started anything
    verifyCPTCode(
      '99490',
      0,
      10,
      '[data-cy="cpt-code-next-claim-requirements"]',
      null
    )
    verifyCPTCode('99490', 0, 10, 'ccr-rpm-calendar-icon', '31d')
    verifyCPTCode('99490', 0, 10, 'ccr-rpm-clock-icon', '20m')
    verifyCPTCode('99439 (2)', 0, 12, 'ccr-rpm-chat-icon', null)
    verifyCPTCode('99439 (2)', 0, 12, 'ccr-rpm-scale-icon', null)

    verifyCPTCode(
      '99439 (1)',
      0,
      11,
      '[data-cy="cpt-code-next-claim-requirements"]',
      '99490'
    )
    verifyCPTCode('99439 (1)', 0, 11, 'ccr-rpm-calendar-icon', '31d')
    verifyCPTCode('99439 (1)', 0, 11, 'ccr-rpm-clock-icon', '20m')
    verifyCPTCode('99439 (2)', 0, 12, 'ccr-rpm-chat-icon', null)
    verifyCPTCode('99439 (2)', 0, 12, 'ccr-rpm-scale-icon', null)

    verifyCPTCode(
      '99439 (2)',
      0,
      12,
      '[data-cy="cpt-code-next-claim-requirements"]',
      '99439'
    )
    verifyCPTCode('99439 (2)', 0, 12, 'ccr-rpm-calendar-icon', '31d')
    verifyCPTCode('99439 (2)', 0, 12, 'ccr-rpm-clock-icon', '20m')
    verifyCPTCode('99439 (2)', 0, 12, 'ccr-rpm-chat-icon', null)
    verifyCPTCode('99439 (2)', 0, 12, 'ccr-rpm-scale-icon', null)

    // started but x1 is not satisfied and x2 is not satisfied
    verifyCPTCode(
      '99490',
      1,
      10,
      '[data-cy="cpt-code-next-claim-requirements"]',
      null
    )
    verifyCPTCode('99490', 1, 10, 'ccr-rpm-calendar-icon', '32d')
    verifyCPTCode('99490', 1, 10, 'ccr-rpm-clock-icon', null)
    verifyCPTCode('99439 (2)', 1, 12, 'ccr-rpm-chat-icon', null)
    verifyCPTCode('99439 (2)', 1, 12, 'ccr-rpm-scale-icon', null)

    verifyCPTCode(
      '99439 (1)',
      1,
      11,
      '[data-cy="cpt-code-next-claim-requirements"]',
      null
    )
    verifyCPTCode('99439 (1)', 1, 11, 'ccr-rpm-calendar-icon', '32d')
    verifyCPTCode('99439 (1)', 1, 11, 'ccr-rpm-clock-icon', '15m')
    verifyCPTCode('99439 (2)', 1, 12, 'ccr-rpm-chat-icon', null)
    verifyCPTCode('99439 (2)', 1, 12, 'ccr-rpm-scale-icon', null)

    verifyCPTCode(
      '99439 (2)',
      1,
      12,
      '[data-cy="cpt-code-next-claim-requirements"]',
      '99439'
    )
    verifyCPTCode('99439 (2)', 1, 12, 'ccr-rpm-calendar-icon', '32d')
    verifyCPTCode('99439 (2)', 1, 12, 'ccr-rpm-clock-icon', '20m')
    verifyCPTCode('99439 (2)', 1, 12, 'ccr-rpm-chat-icon', null)
    verifyCPTCode('99439 (2)', 1, 12, 'ccr-rpm-scale-icon', null)

    // x1 is satisfied but x2 is not
    verifyCPTCode(
      '99490',
      2,
      10,
      '[data-cy="cpt-code-next-claim-requirements"]',
      null
    )
    verifyCPTCode('99490', 2, 10, 'ccr-rpm-calendar-icon', '31d')
    verifyCPTCode('99490', 2, 10, 'ccr-rpm-clock-icon', null)
    verifyCPTCode('99439 (2)', 2, 12, 'ccr-rpm-chat-icon', null)
    verifyCPTCode('99439 (2)', 2, 12, 'ccr-rpm-scale-icon', null)

    verifyCPTCode(
      '99439 (1)',
      2,
      11,
      '[data-cy="cpt-code-next-claim-requirements"]',
      null
    )
    verifyCPTCode('99439 (1)', 2, 11, 'ccr-rpm-calendar-icon', '31d')
    verifyCPTCode('99439 (1)', 2, 11, 'ccr-rpm-clock-icon', null)
    verifyCPTCode('99439 (2)', 2, 12, 'ccr-rpm-chat-icon', null)
    verifyCPTCode('99439 (2)', 2, 12, 'ccr-rpm-scale-icon', null)

    verifyCPTCode(
      '99439 (2)',
      2,
      12,
      '[data-cy="cpt-code-next-claim-requirements"]',
      null
    )
    verifyCPTCode('99439 (2)', 2, 12, 'ccr-rpm-calendar-icon', '31d')
    verifyCPTCode('99439 (2)', 2, 12, 'ccr-rpm-clock-icon', '10m')
    verifyCPTCode('99439 (2)', 2, 12, 'ccr-rpm-chat-icon', null)
    verifyCPTCode('99439 (2)', 2, 12, 'ccr-rpm-scale-icon', null)

    // x1 is satisfied and x2 is satisfied
    verifyCPTCode(
      '99490',
      3,
      10,
      '[data-cy="cpt-code-next-claim-requirements"]',
      null
    )
    verifyCPTCode('99490', 3, 10, 'ccr-rpm-calendar-icon', '31d')
    verifyCPTCode('99490', 3, 10, 'ccr-rpm-clock-icon', null)
    verifyCPTCode('99439 (2)', 3, 12, 'ccr-rpm-chat-icon', null)
    verifyCPTCode('99439 (2)', 3, 12, 'ccr-rpm-scale-icon', null)

    verifyCPTCode(
      '99439 (1)',
      3,
      11,
      '[data-cy="cpt-code-next-claim-requirements"]',
      null
    )
    verifyCPTCode('99439 (1)', 3, 11, 'ccr-rpm-calendar-icon', '31d')
    verifyCPTCode('99439 (1)', 3, 11, 'ccr-rpm-clock-icon', null)
    verifyCPTCode('99439 (2)', 3, 12, 'ccr-rpm-chat-icon', null)
    verifyCPTCode('99439 (2)', 3, 12, 'ccr-rpm-scale-icon', null)

    verifyCPTCode(
      '99439 (2)',
      3,
      12,
      '[data-cy="cpt-code-next-claim-requirements"]',
      null
    )
    verifyCPTCode('99439 (2)', 3, 12, 'ccr-rpm-calendar-icon', '31d')
    verifyCPTCode('99439 (2)', 3, 12, 'ccr-rpm-clock-icon', null)
    verifyCPTCode('99439 (2)', 3, 12, 'ccr-rpm-chat-icon', null)
    verifyCPTCode('99439 (2)', 3, 12, 'ccr-rpm-scale-icon', null)
  })
})

function verifyCPTCode(
  cptCode: string,
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
