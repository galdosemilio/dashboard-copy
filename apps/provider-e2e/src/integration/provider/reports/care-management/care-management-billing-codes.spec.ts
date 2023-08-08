import { standardSetup } from '../../../../support'
import { getCareManagementBillingRows } from '../../../../support/care-management'

describe('Reports -> RPM -> Care Management Billing Codes', function () {
  beforeEach(() => {
    cy.setTimezone('et')
  })

  it('Table shows RPM CPT codes correctly', function () {
    standardSetup({
      apiOverrides: [
        {
          url: '/1.0/warehouse/care-management/billing/snapshot**',
          fixture: 'api/warehouse/getRPMBillingSnapshot-Codes'
        }
      ]
    })

    getCareManagementBillingRows()

    checkRPMAndRTMRows(['99453', '99454', '99457', '99458'])
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

    getCareManagementBillingRows({
      serviceType: {
        id: '2',
        name: 'CCM',
        code: 'ccm'
      }
    })

    verifyCPTCode('99490', 0, 10, '[data-cy="cpt-code-claim-date"]', null)
    verifyCPTCode(
      '99490',
      0,
      10,
      '[data-cy="cpt-code-next-claim-requirements"]',
      null
    )
    verifyCPTCode('99490', 0, 10, 'ccr-rpm-calendar-icon', '30d')
    verifyCPTCode('99490', 0, 10, 'ccr-rpm-clock-icon', '20m')

    verifyCPTCode('99439 (1)', 0, 11, '[data-cy="cpt-code-claim-date"]', null)
    verifyCPTCode(
      '99439 (1)',
      0,
      11,
      '[data-cy="cpt-code-next-claim-requirements"]',
      '99490'
    )
    verifyCPTCode('99439 (1)', 0, 11, 'ccr-rpm-calendar-icon', '30d')
    verifyCPTCode('99439 (1)', 0, 11, 'ccr-rpm-clock-icon', '20m')

    verifyCPTCode('99439 (2)', 0, 12, '[data-cy="cpt-code-claim-date"]', null)
    verifyCPTCode(
      '99439 (2)',
      0,
      12,
      '[data-cy="cpt-code-next-claim-requirements"]',
      '99439'
    )
    verifyCPTCode('99439 (2)', 0, 12, 'ccr-rpm-calendar-icon', '30d')
    verifyCPTCode('99439 (2)', 0, 12, 'ccr-rpm-clock-icon', '20m')

    cy.wait(1000)

    verifyCPTCode(
      '99490',
      1,
      10,
      '[data-cy="cpt-code-claim-date"]',
      '01/31/2020'
    )
    verifyCPTCode(
      '99490',
      1,
      10,
      '[data-cy="cpt-code-next-claim-requirements"]',
      null
    )
    verifyCPTCode('99490', 1, 10, 'ccr-rpm-calendar-icon', null)
    verifyCPTCode('99490', 1, 10, 'ccr-rpm-clock-icon', null)

    verifyCPTCode('99439 (1)', 1, 11, '[data-cy="cpt-code-claim-date"]', null)
    verifyCPTCode(
      '99439 (1)',
      1,
      11,
      '[data-cy="cpt-code-next-claim-requirements"]',
      null
    )
    verifyCPTCode('99439 (1)', 1, 11, 'ccr-rpm-calendar-icon', '30d')
    verifyCPTCode('99439 (1)', 1, 11, 'ccr-rpm-clock-icon', '15m')

    verifyCPTCode('99439 (2)', 1, 12, '[data-cy="cpt-code-claim-date"]', null)
    verifyCPTCode(
      '99439 (2)',
      1,
      12,
      '[data-cy="cpt-code-next-claim-requirements"]',
      '99439'
    )
    verifyCPTCode('99439 (2)', 1, 12, 'ccr-rpm-calendar-icon', '30d')
    verifyCPTCode('99439 (2)', 1, 12, 'ccr-rpm-clock-icon', '20m')

    cy.wait(1000)

    verifyCPTCode(
      '99490',
      2,
      10,
      '[data-cy="cpt-code-claim-date"]',
      '01/31/2020'
    )
    verifyCPTCode(
      '99490',
      2,
      10,
      '[data-cy="cpt-code-next-claim-requirements"]',
      null
    )
    verifyCPTCode('99490', 2, 10, 'ccr-rpm-calendar-icon', null)
    verifyCPTCode('99490', 2, 10, 'ccr-rpm-clock-icon', null)

    verifyCPTCode(
      '99439 (1)',
      2,
      11,
      '[data-cy="cpt-code-claim-date"]',
      '01/31/2020'
    )
    verifyCPTCode(
      '99439 (1)',
      2,
      11,
      '[data-cy="cpt-code-next-claim-requirements"]',
      null
    )
    verifyCPTCode('99439 (1)', 2, 11, 'ccr-rpm-calendar-icon', null)
    verifyCPTCode('99439 (1)', 2, 11, 'ccr-rpm-clock-icon', null)

    verifyCPTCode('99439 (2)', 2, 12, '[data-cy="cpt-code-claim-date"]', null)
    verifyCPTCode(
      '99439 (2)',
      2,
      12,
      '[data-cy="cpt-code-next-claim-requirements"]',
      null
    )
    verifyCPTCode('99439 (2)', 2, 12, 'ccr-rpm-calendar-icon', null)
    verifyCPTCode('99439 (2)', 2, 12, 'ccr-rpm-clock-icon', '10m')

    cy.wait(1000)

    verifyCPTCode(
      '99490',
      3,
      10,
      '[data-cy="cpt-code-claim-date"]',
      '01/31/2020'
    )
    verifyCPTCode(
      '99490',
      3,
      10,
      '[data-cy="cpt-code-next-claim-requirements"]',
      null
    )
    verifyCPTCode('99490', 3, 10, 'ccr-rpm-calendar-icon', null)
    verifyCPTCode('99490', 3, 10, 'ccr-rpm-clock-icon', null)

    verifyCPTCode(
      '99439 (1)',
      3,
      11,
      '[data-cy="cpt-code-claim-date"]',
      '01/31/2020'
    )
    verifyCPTCode(
      '99439 (1)',
      3,
      11,
      '[data-cy="cpt-code-next-claim-requirements"]',
      null
    )
    verifyCPTCode('99439 (1)', 3, 11, 'ccr-rpm-calendar-icon', null)
    verifyCPTCode('99439 (1)', 3, 11, 'ccr-rpm-clock-icon', null)

    verifyCPTCode(
      '99439 (2)',
      3,
      12,
      '[data-cy="cpt-code-claim-date"]',
      '01/31/2020'
    )
    verifyCPTCode(
      '99439 (2)',
      3,
      12,
      '[data-cy="cpt-code-next-claim-requirements"]',
      null
    )
    verifyCPTCode('99439 (2)', 3, 12, 'ccr-rpm-calendar-icon', null)
    verifyCPTCode('99439 (2)', 3, 12, 'ccr-rpm-clock-icon', null)
  })

  it('Table shows RTM CPT codes correctly', () => {
    standardSetup({
      apiOverrides: [
        {
          url: '/1.0/warehouse/care-management/billing/snapshot**',
          fixture: 'api/warehouse/getRTMBillingSnapshot'
        }
      ]
    })
    getCareManagementBillingRows({
      serviceType: {
        id: '3',
        name: 'RTM',
        code: 'rtm'
      }
    })

    checkRPMAndRTMRows(['98975', '98977', '98980', '98981'])
  })
})

function checkRPMAndRTMRows(codes: string[]) {
  verifyCPTCode(codes[0], 0, 11, '[data-cy="cpt-code-claim-date"]', null)
  verifyCPTCode(
    codes[0],
    0,
    11,
    '[data-cy="cpt-code-next-claim-requirements"]',
    null
  )
  verifyCPTCode(codes[0], 0, 11, 'ccr-rpm-calendar-icon', '30d')

  verifyCPTCode(codes[1], 0, 12, '[data-cy="cpt-code-claim-date"]', null)
  verifyCPTCode(
    codes[1],
    0,
    12,
    '[data-cy="cpt-code-next-claim-requirements"]',
    null
  )
  verifyCPTCode(codes[1], 0, 12, 'ccr-rpm-calendar-icon', '30d')
  verifyCPTCode(codes[1], 0, 12, 'ccr-rpm-scale-icon', '15')

  verifyCPTCode(codes[2], 0, 13, '[data-cy="cpt-code-claim-date"]', null)
  verifyCPTCode(
    codes[2],
    0,
    13,
    '[data-cy="cpt-code-next-claim-requirements"]',
    null
  )
  verifyCPTCode(codes[2], 0, 13, 'ccr-rpm-calendar-icon', '30d')
  verifyCPTCode(codes[2], 0, 13, 'ccr-rpm-clock-icon', '20m')
  verifyCPTCode(codes[2], 0, 13, 'ccr-rpm-chat-icon', '1')

  verifyCPTCode(
    `${codes[3]} (1)`,
    0,
    14,
    '[data-cy="cpt-code-claim-date"]',
    null
  )
  verifyCPTCode(
    `${codes[3]} (1)`,
    0,
    14,
    '[data-cy="cpt-code-next-claim-requirements"]',
    codes[2]
  )
  verifyCPTCode(`${codes[3]} (1)`, 0, 14, 'ccr-rpm-calendar-icon', '30d')
  verifyCPTCode(`${codes[3]} (1)`, 0, 14, 'ccr-rpm-clock-icon', '20m')

  verifyCPTCode(
    `${codes[3]} (2)`,
    0,
    15,
    '[data-cy="cpt-code-claim-date"]',
    null
  )
  verifyCPTCode(
    `${codes[3]} (2)`,
    0,
    15,
    '[data-cy="cpt-code-next-claim-requirements"]',
    codes[3]
  )
  verifyCPTCode(`${codes[3]} (2)`, 0, 15, 'ccr-rpm-calendar-icon', '30d')
  verifyCPTCode(`${codes[3]} (2)`, 0, 15, 'ccr-rpm-clock-icon', '20m')

  cy.wait(1000)

  verifyCPTCode(
    codes[0],
    1,
    11,
    '[data-cy="cpt-code-claim-date"]',
    '01/31/2020'
  )
  verifyCPTCode(
    codes[0],
    1,
    11,
    '[data-cy="cpt-code-next-claim-requirements"]',
    null
  )
  verifyCPTCode(codes[0], 1, 11, 'ccr-rpm-calendar-icon', null)

  verifyCPTCode(codes[1], 1, 12, '[data-cy="cpt-code-claim-date"]', null)
  verifyCPTCode(
    codes[1],
    1,
    12,
    '[data-cy="cpt-code-next-claim-requirements"]',
    null
  )
  verifyCPTCode(codes[1], 1, 12, 'ccr-rpm-calendar-icon', '20d')
  verifyCPTCode(codes[1], 1, 12, 'ccr-rpm-scale-icon', '15')

  verifyCPTCode(codes[2], 1, 13, '[data-cy="cpt-code-claim-date"]', null)
  verifyCPTCode(
    codes[2],
    1,
    13,
    '[data-cy="cpt-code-next-claim-requirements"]',
    null
  )
  verifyCPTCode(codes[2], 1, 13, 'ccr-rpm-calendar-icon', '30d')
  verifyCPTCode(codes[2], 1, 13, 'ccr-rpm-clock-icon', '20m')
  verifyCPTCode(codes[2], 1, 13, 'ccr-rpm-chat-icon', '1')

  verifyCPTCode(
    `${codes[3]} (1)`,
    1,
    14,
    '[data-cy="cpt-code-claim-date"]',
    null
  )
  verifyCPTCode(
    `${codes[3]} (1)`,
    1,
    14,
    '[data-cy="cpt-code-next-claim-requirements"]',
    codes[2]
  )
  verifyCPTCode(`${codes[3]} (1)`, 1, 14, 'ccr-rpm-calendar-icon', '30d')
  verifyCPTCode(`${codes[3]} (1)`, 1, 14, 'ccr-rpm-clock-icon', '20m')

  verifyCPTCode(
    `${codes[3]} (2)`,
    1,
    15,
    '[data-cy="cpt-code-claim-date"]',
    null
  )
  verifyCPTCode(
    `${codes[3]} (2)`,
    1,
    15,
    '[data-cy="cpt-code-next-claim-requirements"]',
    codes[3]
  )
  verifyCPTCode(`${codes[3]} (2)`, 1, 15, 'ccr-rpm-calendar-icon', '30d')
  verifyCPTCode(`${codes[3]} (2)`, 1, 15, 'ccr-rpm-clock-icon', '20m')

  cy.wait(1000)

  verifyCPTCode(
    codes[0],
    2,
    11,
    '[data-cy="cpt-code-claim-date"]',
    '01/31/2020'
  )
  verifyCPTCode(
    codes[0],
    2,
    11,
    '[data-cy="cpt-code-next-claim-requirements"]',
    null
  )
  verifyCPTCode(codes[0], 2, 11, 'ccr-rpm-calendar-icon', null)

  verifyCPTCode(
    codes[1],
    2,
    12,
    '[data-cy="cpt-code-claim-date"]',
    '01/31/2020'
  )
  verifyCPTCode(
    codes[1],
    2,
    12,
    '[data-cy="cpt-code-next-claim-requirements"]',
    null
  )
  verifyCPTCode(codes[1], 2, 12, 'ccr-rpm-calendar-icon', null)
  verifyCPTCode(codes[1], 2, 12, 'ccr-rpm-scale-icon', null)

  verifyCPTCode(codes[2], 2, 13, '[data-cy="cpt-code-claim-date"]', null)
  verifyCPTCode(
    codes[2],
    2,
    13,
    '[data-cy="cpt-code-next-claim-requirements"]',
    null
  )
  verifyCPTCode(codes[2], 2, 13, 'ccr-rpm-calendar-icon', '20d')
  verifyCPTCode(codes[2], 2, 13, 'ccr-rpm-clock-icon', '10m')
  verifyCPTCode(codes[2], 2, 13, 'ccr-rpm-chat-icon', '1')

  verifyCPTCode(
    `${codes[3]} (1)`,
    2,
    14,
    '[data-cy="cpt-code-claim-date"]',
    null
  )
  verifyCPTCode(
    `${codes[3]} (1)`,
    2,
    14,
    '[data-cy="cpt-code-next-claim-requirements"]',
    codes[2]
  )
  verifyCPTCode(`${codes[3]} (1)`, 2, 14, 'ccr-rpm-calendar-icon', '30d')
  verifyCPTCode(`${codes[3]} (1)`, 2, 14, 'ccr-rpm-clock-icon', '20m')

  verifyCPTCode(
    `${codes[3]} (2)`,
    2,
    15,
    '[data-cy="cpt-code-claim-date"]',
    null
  )
  verifyCPTCode(
    `${codes[3]} (2)`,
    2,
    15,
    '[data-cy="cpt-code-next-claim-requirements"]',
    codes[3]
  )
  verifyCPTCode(`${codes[3]} (2)`, 2, 15, 'ccr-rpm-calendar-icon', '30d')
  verifyCPTCode(`${codes[3]} (2)`, 2, 15, 'ccr-rpm-clock-icon', '20m')

  cy.wait(1000)

  verifyCPTCode(
    codes[0],
    3,
    11,
    '[data-cy="cpt-code-claim-date"]',
    '01/31/2020'
  )
  verifyCPTCode(
    codes[0],
    3,
    11,
    '[data-cy="cpt-code-next-claim-requirements"]',
    null
  )
  verifyCPTCode(codes[0], 3, 11, 'ccr-rpm-calendar-icon', null)

  verifyCPTCode(
    codes[1],
    3,
    12,
    '[data-cy="cpt-code-claim-date"]',
    '01/31/2020'
  )
  verifyCPTCode(
    codes[1],
    3,
    12,
    '[data-cy="cpt-code-next-claim-requirements"]',
    null
  )
  verifyCPTCode(codes[1], 3, 12, 'ccr-rpm-calendar-icon', null)
  verifyCPTCode(codes[1], 3, 12, 'ccr-rpm-scale-icon', null)

  verifyCPTCode(
    codes[2],
    3,
    13,
    '[data-cy="cpt-code-claim-date"]',
    '01/31/2020'
  )
  verifyCPTCode(
    codes[2],
    3,
    13,
    '[data-cy="cpt-code-next-claim-requirements"]',
    null
  )
  verifyCPTCode(codes[2], 3, 13, 'ccr-rpm-calendar-icon', null)
  verifyCPTCode(codes[2], 3, 13, 'ccr-rpm-clock-icon', null)
  verifyCPTCode(codes[2], 3, 13, 'ccr-rpm-chat-icon', null)

  verifyCPTCode(
    `${codes[3]} (1)`,
    3,
    14,
    '[data-cy="cpt-code-claim-date"]',
    '01/31/2020'
  )
  verifyCPTCode(
    `${codes[3]} (1)`,
    3,
    14,
    '[data-cy="cpt-code-next-claim-requirements"]',
    null
  )
  verifyCPTCode(`${codes[3]} (1)`, 3, 14, 'ccr-rpm-calendar-icon', null)
  verifyCPTCode(`${codes[3]} (1)`, 3, 14, 'ccr-rpm-clock-icon', null)

  verifyCPTCode(
    `${codes[3]} (2)`,
    3,
    15,
    '[data-cy="cpt-code-claim-date"]',
    null
  )
  verifyCPTCode(
    `${codes[3]} (2)`,
    3,
    15,
    '[data-cy="cpt-code-next-claim-requirements"]',
    null
  )
  verifyCPTCode(`${codes[3]} (2)`, 3, 15, 'ccr-rpm-calendar-icon', null)
  verifyCPTCode(`${codes[3]} (2)`, 3, 15, 'ccr-rpm-clock-icon', '20m')

  cy.wait(1000)

  verifyCPTCode(
    codes[0],
    4,
    11,
    '[data-cy="cpt-code-claim-date"]',
    '01/31/2020'
  )
  verifyCPTCode(
    codes[0],
    4,
    11,
    '[data-cy="cpt-code-next-claim-requirements"]',
    null
  )
  verifyCPTCode(codes[0], 4, 11, 'ccr-rpm-calendar-icon', null)

  verifyCPTCode(
    codes[1],
    4,
    12,
    '[data-cy="cpt-code-claim-date"]',
    '01/31/2020'
  )
  verifyCPTCode(
    codes[1],
    4,
    12,
    '[data-cy="cpt-code-next-claim-requirements"]',
    null
  )
  verifyCPTCode(codes[1], 4, 12, 'ccr-rpm-calendar-icon', null)
  verifyCPTCode(codes[1], 4, 12, 'ccr-rpm-scale-icon', null)

  verifyCPTCode(
    codes[2],
    4,
    13,
    '[data-cy="cpt-code-claim-date"]',
    '01/31/2020'
  )
  verifyCPTCode(
    codes[2],
    4,
    13,
    '[data-cy="cpt-code-next-claim-requirements"]',
    null
  )
  verifyCPTCode(codes[2], 4, 13, 'ccr-rpm-calendar-icon', null)
  verifyCPTCode(codes[2], 4, 13, 'ccr-rpm-clock-icon', null)
  verifyCPTCode(codes[2], 4, 13, 'ccr-rpm-chat-icon', null)

  verifyCPTCode(
    `${codes[3]} (1)`,
    4,
    14,
    '[data-cy="cpt-code-claim-date"]',
    '01/31/2020'
  )
  verifyCPTCode(
    `${codes[3]} (1)`,
    4,
    14,
    '[data-cy="cpt-code-next-claim-requirements"]',
    null
  )
  verifyCPTCode(`${codes[3]} (1)`, 4, 14, 'ccr-rpm-calendar-icon', null)
  verifyCPTCode(`${codes[3]} (1)`, 4, 14, 'ccr-rpm-clock-icon', null)

  verifyCPTCode(
    `${codes[3]} (2)`,
    4,
    15,
    '[data-cy="cpt-code-claim-date"]',
    '01/31/2020'
  )
  verifyCPTCode(
    `${codes[3]} (2)`,
    4,
    15,
    '[data-cy="cpt-code-next-claim-requirements"]',
    null
  )
  verifyCPTCode(`${codes[3]} (2)`, 4, 15, 'ccr-rpm-calendar-icon', null)
  verifyCPTCode(`${codes[3]} (2)`, 4, 15, 'ccr-rpm-clock-icon', null)
}

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
    cy.get('@careManagementBillingRows')
      .eq(row)
      .find('td')
      .eq(column)
      .find(element)
      .should('not.exist')
  } else {
    cy.get('@careManagementBillingRows')
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
