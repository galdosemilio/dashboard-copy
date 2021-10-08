import { standardSetup } from '../../support'
import { verifyDayAvailability, WeekDays } from './utils'

describe('Schedule -> availability', function () {
  it('Schedule shows proper availability white/gray blocks in ET (New York)', function () {
    cy.setTimezone('et')
    standardSetup()

    cy.visit(`/schedule/view`)

    cy.get('.calendar-wrapper')
    cy.wait(1000)
    cy.tick(100000)

    verifyDayAvailability(
      'unavailable',
      {
        day: WeekDays.SUNDAY,
        hour: 0,
        minute: 0
      },
      {
        day: WeekDays.SUNDAY,
        hour: 23,
        minute: 45
      }
    )
    verifyDayAvailability(
      'unavailable',
      {
        day: WeekDays.MONDAY,
        hour: 0,
        minute: 0
      },
      {
        day: WeekDays.MONDAY,
        hour: 18,
        minute: 45
      }
    )
    verifyDayAvailability(
      'available',
      {
        day: WeekDays.MONDAY,
        hour: 19,
        minute: 0
      },
      {
        day: WeekDays.MONDAY,
        hour: 23,
        minute: 45
      }
    )
    verifyDayAvailability(
      'available',
      {
        day: WeekDays.TUESDAY,
        hour: 0,
        minute: 0
      },
      {
        day: WeekDays.TUESDAY,
        hour: 17,
        minute: 0
      }
    )
    verifyDayAvailability(
      'unavailable',
      {
        day: WeekDays.TUESDAY,
        hour: 17,
        minute: 15
      },
      {
        day: WeekDays.TUESDAY,
        hour: 18,
        minute: 45
      }
    )
    verifyDayAvailability(
      'available',
      {
        day: WeekDays.TUESDAY,
        hour: 19,
        minute: 0
      },
      {
        day: WeekDays.TUESDAY,
        hour: 23,
        minute: 45
      }
    )
    verifyDayAvailability(
      'available',
      {
        day: WeekDays.WEDNESDAY,
        hour: 0,
        minute: 0
      },
      {
        day: WeekDays.WEDNESDAY,
        hour: 17,
        minute: 0
      }
    )
    verifyDayAvailability(
      'unavailable',
      {
        day: WeekDays.WEDNESDAY,
        hour: 17,
        minute: 15
      },
      {
        day: WeekDays.WEDNESDAY,
        hour: 23,
        minute: 45
      }
    )
    verifyDayAvailability(
      'unavailable',
      {
        day: WeekDays.THURSDAY,
        hour: 0,
        minute: 0
      },
      {
        day: WeekDays.THURSDAY,
        hour: 23,
        minute: 45
      }
    )
    verifyDayAvailability(
      'unavailable',
      {
        day: WeekDays.FRIDAY,
        hour: 0,
        minute: 0
      },
      {
        day: WeekDays.FRIDAY,
        hour: 23,
        minute: 45
      }
    )
    verifyDayAvailability(
      'unavailable',
      {
        day: WeekDays.SATURDAY,
        hour: 0,
        minute: 0
      },
      {
        day: WeekDays.SATURDAY,
        hour: 23,
        minute: 45
      }
    )

    cy.wait(3000)
  })

  it('Schedule shows proper availability white/gray blocks in AET (Australia Eastern)', function () {
    cy.setTimezone('aet')
    standardSetup()

    cy.visit(`/schedule/view`)

    cy.get('.calendar-wrapper')
    cy.wait(1000)
    cy.tick(100000)

    // To add equivalent tests for this timezone...
    verifyDayAvailability(
      'unavailable',
      {
        day: WeekDays.SUNDAY,
        hour: 0,
        minute: 0
      },
      {
        day: WeekDays.SUNDAY,
        hour: 23,
        minute: 45
      }
    )
    verifyDayAvailability(
      'unavailable',
      {
        day: WeekDays.MONDAY,
        hour: 0,
        minute: 0
      },
      {
        day: WeekDays.MONDAY,
        hour: 23,
        minute: 45
      }
    )
    verifyDayAvailability(
      'unavailable',
      {
        day: WeekDays.TUESDAY,
        hour: 0,
        minute: 0
      },
      {
        day: WeekDays.TUESDAY,
        hour: 10,
        minute: 45
      }
    )
    verifyDayAvailability(
      'available',
      {
        day: WeekDays.TUESDAY,
        hour: 11,
        minute: 0
      },
      {
        day: WeekDays.TUESDAY,
        hour: 23,
        minute: 45
      }
    )
    verifyDayAvailability(
      'available',
      {
        day: WeekDays.WEDNESDAY,
        hour: 0,
        minute: 0
      },
      {
        day: WeekDays.WEDNESDAY,
        hour: 9,
        minute: 0
      }
    )
    verifyDayAvailability(
      'unavailable',
      {
        day: WeekDays.WEDNESDAY,
        hour: 9,
        minute: 15
      },
      {
        day: WeekDays.WEDNESDAY,
        hour: 10,
        minute: 45
      }
    )
    verifyDayAvailability(
      'available',
      {
        day: WeekDays.WEDNESDAY,
        hour: 11,
        minute: 0
      },
      {
        day: WeekDays.WEDNESDAY,
        hour: 23,
        minute: 45
      }
    )
    verifyDayAvailability(
      'available',
      {
        day: WeekDays.THURSDAY,
        hour: 0,
        minute: 0
      },
      {
        day: WeekDays.THURSDAY,
        hour: 9,
        minute: 0
      }
    )
    verifyDayAvailability(
      'unavailable',
      {
        day: WeekDays.THURSDAY,
        hour: 9,
        minute: 15
      },
      {
        day: WeekDays.THURSDAY,
        hour: 23,
        minute: 45
      }
    )
    verifyDayAvailability(
      'unavailable',
      {
        day: WeekDays.FRIDAY,
        hour: 0,
        minute: 0
      },
      {
        day: WeekDays.FRIDAY,
        hour: 23,
        minute: 45
      }
    )
    verifyDayAvailability(
      'unavailable',
      {
        day: WeekDays.SATURDAY,
        hour: 0,
        minute: 0
      },
      {
        day: WeekDays.SATURDAY,
        hour: 23,
        minute: 45
      }
    )
  })

  it('Allows providers to modify their availability if the organization is different from Wellcore', function () {
    cy.setTimezone('et')
    standardSetup()

    cy.visit(`schedule/available/recurring`)

    cy.get('app-schedule-availability').should(
      'not.contain',
      'Your provider account is associated to an external prescription management system.'
    )

    cy.get('app-schedule-availability-recurring')
      .find('button')
      .should('have.length', 8)
  })

  it("Allows providers to modify their availability (wellcore) if the org is Wellcore and they don't have a Prescribery ID", function () {
    cy.setTimezone('et')
    cy.setOrganization('wellcore')
    standardSetup()

    cy.visit(`schedule/available/recurring`)

    cy.get('app-schedule-availability').should(
      'not.contain',
      'Your provider account is associated to an external prescription management system.'
    )

    cy.get('app-schedule-availability-recurring')
      .find('button')
      .should('have.length', 8)
  })

  it('Prevents providers from modifying their availability (wellcore) if the org is Wellcore and they have a Prescribery ID', function () {
    cy.setTimezone('et')
    cy.setOrganization('wellcore')
    standardSetup(undefined, [
      {
        url: '/2.0/account/*/external-identifier?account=**',
        fixture: 'api/account/getPrescriberyExternalIdentifier'
      }
    ])

    cy.visit(`schedule/available/recurring`)

    cy.get('app-schedule-availability').should(
      'contain',
      'Your provider account is associated to an external prescription management system.'
    )

    cy.get('app-schedule-availability-recurring')
      .find('button')
      .should('have.length', 0)
  })

  it('Prevents providers from modifying their availability (single) if the org is Wellcore and they have a Prescribery ID', function () {
    cy.setTimezone('et')
    cy.setOrganization('wellcore')
    standardSetup(undefined, [
      {
        url: '/2.0/account/*/external-identifier?account=**',
        fixture: 'api/account/getPrescriberyExternalIdentifier'
      }
    ])

    cy.visit(`schedule/available/single`)

    cy.get('app-schedule-availability').should(
      'contain',
      'Your provider account is associated to an external prescription management system.'
    )

    cy.get('app-schedule-availability-single')
      .find('button')
      .should('have.length', 0)
  })
})
