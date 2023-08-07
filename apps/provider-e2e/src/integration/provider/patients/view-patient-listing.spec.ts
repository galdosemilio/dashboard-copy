import * as moment from 'moment-timezone'
import { PackageFilter } from '../../../../../provider/src/app/shared/components/package-filter'

import { standardSetup } from '../../../support'

interface PatientsFilters {
  page?: number
  pageSize?: number
  expires?: string
  organization?: string
  packages?: PackageFilter
}

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

const packages: PackageFilter = {
  'pkg-filter': 'all',
  pkg: [
    {
      id: '1',
      title: 'Package 1',
      description: '',
      isActive: true,
      createdAt: '2015-12-16 15:34:43.601086+00',
      updatedAt: '2018-10-08 07:32:59.090567+00'
    },
    {
      id: '2',
      title: 'Package 2',
      description: '',
      isActive: true,
      createdAt: '2015-12-16 15:34:43.601086+00',
      updatedAt: '2018-10-08 07:32:59.090567+00'
    }
  ]
}

const STORAGE_PATIENTS_FILTERS = 'ccrPatientsFilters'

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
    cy.wait('@patientListingGetRequest')

    for (const sortableHeader of sortableHeaders) {
      cy.get('@headerColumns')
        .contains(sortableHeader.displayValue)
        .click({ force: true })

      cy.tick(1000)

      cy.wait('@patientListingGetRequest').should((xhr) => {
        expect(xhr.request.url).to.contain(`${sortableHeader.value}`)
      })

      cy.tick(1000)
    }
  })

  it('should load patients with default without cookie', () => {
    window.localStorage.removeItem(STORAGE_PATIENTS_FILTERS)
    checkListFiltersAndPagination({})
  })

  it('should load patients with stored pageSize', () => {
    const filters: PatientsFilters = {
      pageSize: 50,
      organization: '1',
      expires: moment('2020-01-01').toISOString()
    }
    window.localStorage.setItem(
      STORAGE_PATIENTS_FILTERS,
      JSON.stringify(filters)
    )

    checkListFiltersAndPagination(filters)
  })

  it('should load patients with stored pageSize and page', () => {
    const filters: PatientsFilters = {
      pageSize: 50,
      page: 2,
      organization: '1',
      expires: moment('2020-01-01').toISOString()
    }
    window.localStorage.setItem(
      STORAGE_PATIENTS_FILTERS,
      JSON.stringify(filters)
    )

    checkListFiltersAndPagination(filters)
  })

  it('should load patients with stores pageSize, page and packages', () => {
    const filters: PatientsFilters = {
      pageSize: 50,
      page: 2,
      organization: '1',
      packages,
      expires: moment('2020-01-01').toISOString()
    }
    window.localStorage.setItem(
      STORAGE_PATIENTS_FILTERS,
      JSON.stringify(filters)
    )

    checkListFiltersAndPagination(filters)
  })

  it('should remove filters with expires and default search', () => {
    const filters: PatientsFilters = {
      pageSize: 50,
      page: 2,
      organization: '1',
      packages,
      expires: moment('2019-12-25').toISOString()
    }

    window.localStorage.setItem(
      STORAGE_PATIENTS_FILTERS,
      JSON.stringify(filters)
    )

    checkListFiltersAndPagination({}, true)
  })

  it('should remove filters with different org and default search', () => {
    const filters: PatientsFilters = {
      pageSize: 50,
      page: 2,
      organization: '2',
      packages,
      expires: moment('2020-01-01').toISOString()
    }

    window.localStorage.setItem(
      STORAGE_PATIENTS_FILTERS,
      JSON.stringify(filters)
    )

    checkListFiltersAndPagination({}, true)
  })

  it('should change the pagination size and store the value', () => {
    window.localStorage.removeItem(STORAGE_PATIENTS_FILTERS)
    cy.setTimezone('aet')
    standardSetup()

    cy.visit(`/accounts/patients`)

    cy.get('table', { timeout: 10000 })
    cy.tick(10000)

    cy.wait('@patientListingGetRequest')
    cy.wait('@patientListingGetRequest')

    cy.get('ccr-page-size-selector').find('select').select('50')
    cy.tick(1000)

    cy.wait('@patientListingGetRequest').should((xhr) => {
      const url = new URL(xhr.request.url)
      const searchParams = url.searchParams

      expect(searchParams.get('limit')).to.equal('50')
      expect(searchParams.get('offset')).to.equal('0')

      const storedFilters = JSON.parse(
        localStorage.getItem(STORAGE_PATIENTS_FILTERS)
      )

      expect(storedFilters.pageSize).to.equal(50)
    })
  })

  it('should change the page and store the value', () => {
    window.localStorage.removeItem(STORAGE_PATIENTS_FILTERS)
    cy.setTimezone('aet')
    standardSetup()

    cy.visit(`/accounts/patients`)

    cy.get('table', { timeout: 10000 })
    cy.tick(10000)

    cy.wait('@patientListingGetRequest')
    cy.wait('@patientListingGetRequest')

    cy.get('ccr-paginator').find('button').eq(1).click()
    cy.tick(1000)

    cy.wait('@patientListingGetRequest').should((xhr) => {
      const url = new URL(xhr.request.url)
      const searchParams = url.searchParams

      expect(searchParams.get('limit')).to.equal('10')
      expect(searchParams.get('offset')).to.equal('10')

      const storedFilters = JSON.parse(
        localStorage.getItem(STORAGE_PATIENTS_FILTERS)
      )

      expect(storedFilters.page).to.equal(1)
    })
  })

  it('Properly exports csv report', function () {
    cy.setTimezone('et')
    standardSetup()

    cy.visit(`/accounts/patients`)

    cy.get('table', { timeout: 10000 })
    cy.clock().tick(10000)

    cy.get('[data-cy="download-csv-button"]').click()

    cy.readFile(
      `${Cypress.config('downloadsFolder')}/CoachCare_Patient_List_csv.csv`
    )
  })

  it('should display the correct color rating for blood pressure', () => {
    cy.setTimezone('aet')
    standardSetup()

    cy.visit(`/accounts/patients`)

    cy.get('table', { timeout: 10000 }).as('table')
    cy.tick(10000)

    cy.wait('@patientListingGetRequest')
    cy.wait('@patientListingGetRequest')

    getBloodPressureReadingCell(0).should(
      'have.class',
      'ccr-blood-pressure-hypotensive'
    )
    getBloodPressureReadingCell(1).should(
      'have.class',
      'ccr-blood-pressure-normal'
    )
    getBloodPressureReadingCell(2).should(
      'have.class',
      'ccr-blood-pressure-elevated'
    )
    getBloodPressureReadingCell(3).should(
      'have.class',
      'ccr-blood-pressure-hypertension-stage-1'
    )
    getBloodPressureReadingCell(4).should(
      'have.class',
      'ccr-blood-pressure-hypertension-stage-2'
    )
    getBloodPressureReadingCell(5).should(
      'have.class',
      'ccr-blood-pressure-hypertensive-crisis'
    )
    getBloodPressureReadingCell(6).should(
      'have.class',
      'ccr-blood-pressure-hypertension-stage-1'
    )
    getBloodPressureReadingCell(7).should(
      'have.class',
      'ccr-blood-pressure-hypertension-stage-2'
    )
    getBloodPressureReadingCell(8).should(
      'have.class',
      'ccr-blood-pressure-hypertensive-crisis'
    )
  })

  it('should display the correct date for blood pressure reading', () => {
    cy.setTimezone('aet')
    standardSetup()

    cy.visit(`/accounts/patients`)

    cy.get('table', { timeout: 10000 }).as('table')
    cy.tick(10000)

    cy.wait('@patientListingGetRequest')
    cy.wait('@patientListingGetRequest')

    getBloodPressureDateCell(0).should('contain', 'Apr 25, 2022')
    getBloodPressureDateCell(1).should('contain', 'Feb 25, 2022')
    getBloodPressureDateCell(2).should('contain', 'Mar 25, 2022')
  })
})

const checkListFiltersAndPagination = (
  { page = 0, pageSize = 10, packages }: PatientsFilters,
  isClearedSession = false
) => {
  cy.setTimezone('aet')
  standardSetup()

  cy.visit(`/accounts/patients`)

  cy.get('table', { timeout: 10000 })
  cy.tick(10000)

  cy.wait('@patientListingGetRequest')
  cy.wait('@patientListingGetRequest').should((xhr) => {
    const url = new URL(xhr.request.url)
    const searchParams = url.searchParams

    expect(searchParams.get('limit')).to.equal(`${pageSize}`)
    expect(searchParams.get('offset')).to.equal(`${pageSize * page}`)

    if (packages) {
      expect(searchParams.get('pkg-filter')).to.contain(packages['pkg-filter'])

      packages.pkg.forEach((pkg, index) => {
        expect(searchParams.get(`pkg[${index}]`)).to.contain(pkg.id)
      })
    }

    if (isClearedSession) {
      const storedFilters = window.localStorage.getItem(
        STORAGE_PATIENTS_FILTERS
      )
      expect(storedFilters).to.be.null
    }
  })

  cy.tick(10000)
  cy.get('ccr-page-size-selector')
    .find('select')
    .find(':selected')
    .contains(`${pageSize}`)
  cy.get('ccr-paginator')
    .find('.offset-selector')
    .find(':selected')
    .contains(`${page + 1} / ${Math.ceil(604 / pageSize)}`)
}

function getBloodPressureReadingCell(patientIndex: number) {
  return cy
    .get('@table')
    .find('tbody')
    .find('tr.level0')
    .eq(patientIndex)
    .find('td.column-bloodpressure')
}

function getBloodPressureDateCell(patientIndex: number) {
  return cy
    .get('@table')
    .find('tbody')
    .find('tr.level0')
    .eq(patientIndex)
    .find('td.column-bloodpressure')
    .next()
}
