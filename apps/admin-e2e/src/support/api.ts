interface ApiOverrideEntry {
  url: string
  fixture: string
}

let overrides: ApiOverrideEntry[] = []

function fetchOverride(url: string, fixture: string): string {
  const foundOverride = overrides.find((e) => e.url === url)
  return foundOverride ? foundOverride.fixture : fixture
}

const interceptCoreApiCalls = (
  authenticated: boolean,
  apiOverrides?: ApiOverrideEntry[]
): void => {
  cy.log('Loading base API intercept files')

  cy.log('Setting api overrides')
  overrides = apiOverrides ? apiOverrides : []

  if (authenticated) {
    cy.log('Loading authenticated API routes')
    cy.route('GET', '2.0/session', 'fixture:api/session/get')
  } else {
    cy.log('Loading unauthenticated API routes')
    cy.route({
      method: 'GET',
      url: '2.0/session',
      status: 401,
      response: {}
    })
  }

  cy.fixture(`api/account/getSingle`).then((data) => {
    data.preference.defaultOrganization = Cypress.env('organizationId')
    data.timezone = Cypress.env('timezone')

    cy.route('GET', `2.0/account/${Cypress.env('adminId')}`, data).as(
      'getSingleAccount'
    )
  })

  cy.route(
    'GET',
    `2.0/account/${Cypress.env('patientId')}`,
    'fixture:/api/account/patientSingle'
  )
  cy.route(
    'GET',
    `2.0/account/${Cypress.env('providerId')}`,
    'fixture:/api/account/coachSingle'
  )
  cy.route(
    'GET',
    '2.0/account?accountType=2&offset=0&limit=10',
    'fixture:/api/account/coachesList'
  )
  cy.route(
    'GET',
    '2.0/account?accountType=3&offset=0&limit=10',
    'fixture:/api/account/patientsList'
  )
  cy.route('GET', '2.0/country?**', 'fixture:/api/countries')
  cy.route(
    'GET',
    '2.0/organization/?**',
    'fixture:/api/organization/organizationList'
  )
  cy.route(
    'GET',
    `2.0/organization/${Cypress.env('organizationId')}`,
    'fixture:/api/organization/getSingle'
  )
  cy.fixture('../../../admin/src/i18n/en.json').as('i18n-en')
  cy.route('GET', '/assets/i18n/admin/en.json', '@i18n-en')
  cy.route(
    'GET',
    '4.0/organization/**/preference/assets?id=*',
    'fixture:/api/organization'
  ).as('apiCallOrgPreference')

  cy.route(
    'GET',
    '1.0/warehouse/organization/billing?**',
    'fixture:/api/general/emptyDataEmptyPagination'
  ).as('apiCallOrganizationBilling')

  cy.route({
    method: 'PATCH',
    url: '2.0/account/**',
    status: 204,
    response: {}
  })

  cy.route('GET', '1.0/app/android/**', 'fixture:/api/androidApp').as(
    'apiCallAndroidApp'
  )
  cy.route('GET', '1.0/app/ios/**', 'fixture:/api/iosApp').as('apiCallIosApp')
  cy.route({
    method: 'HEAD',
    url: '2.0/account?**',
    status: 404,
    response: {}
  })

  cy.route({
    method: 'PUT',
    url: '2.0/organization/**',
    status: 204,
    response: {}
  })

  cy.route({
    method: 'PATCH',
    url: `/4.0/organization/${Cypress.env('organizationId')}/preference`,
    status: 204,
    response: {}
  }).as('updateOrgCall')

  cy.route({
    method: 'PATCH',
    url: `/4.0/organization/${Cypress.env('organizationId')}/preference/admin`,
    status: 204,
    response: {}
  }).as('updateMalaCall')

  cy.route(
    'GET',
    '4.0/organization/3378/preference?id=3378**',
    'fixture:/api/organization/getPreference'
  )
  cy.route(
    'GET',
    '1.0/message/preference/organization?organization=**',
    'fixture:/api/organization/getPreferenceMessage'
  )
  cy.route(
    'GET',
    '1.0/content/preference?organization=**',
    'fixture:/api/organization/getPreferenceContent'
  )
  cy.route(
    'GET',
    '1.0/communication/preference?organization=**',
    'fixture:/api/organization/getPreferenceCommunication'
  )
  cy.route(
    'GET',
    '1.0/sequence/preference/organization?organization=**',
    'fixture:/api/organization/getPreferenceSequence'
  )
  cy.route(
    'GET',
    '1.0/rpm/preference/organization?organization=**',
    'fixture:/api/organization/getPreferenceRpm'
  )
  cy.route(
    'GET',
    '1.0/content/vault/preference?organization=**',
    'fixture:/api/organization/getPreferenceVault'
  )
  cy.route(
    'GET',
    '1.0/mfa/preference?**',
    'fixture:/api/organization/getPreferenceMfa'
  )
  cy.route('GET', '1.0/mfa/preference/section', 'fixture:/api/mfa/getSections')
  cy.route(
    'GET',
    '2.0/package/organization?**',
    'fixture:/api/package/fetchAll'
  )

  cy.route(
    'GET',
    '1.0/active-campaign/list/association**',
    fetchOverride(
      '1.0/active-campaign/list/association**',
      'fixture:/api/organization/getActiveCampaignListAssociations'
    )
  ).as('activeCampaignListAssociationGetRequest')
  cy.route(
    'GET',
    '1.0/active-campaign/list',
    'fixture:/api/organization/getActiveCampaignLists'
  )
  cy.route({
    method: 'POST',
    url: '1.0/active-campaign/list/association',
    status: 201,
    response: { id: '1' }
  }).as('activeCampaignListAssociationPostRequest')
  cy.route({
    method: 'DELETE',
    url: '1.0/active-campaign/list/association/**',
    status: 204,
    response: {}
  }).as('activeCampaignListAssociationDeleteRequest')
  cy.route({
    method: 'POST',
    url: '1.0/active-campaign/newsletter/subscription',
    status: 201,
    response: { id: '1' }
  }).as('activeCampaignListSubscriptionPostRequest')
  cy.route(
    `/2.0/account?query=test&accountType=2&organization=${Cypress.env(
      'organizationId'
    )}`,
    'fixture:/api/account/coachesList'
  )
  cy.route(
    `/2.0/account?organization=${Cypress.env(
      'organizationId'
    )}&accountType=2&offset=0&limit=all`,
    'fixture:/api/account/coachesList'
  )
  cy.route(
    'GET',
    '1.0/billing-plan',
    'fixture:/api/organization/getBillingPlans'
  )
  cy.route(
    'GET',
    '1.0/organization/*/billing**',
    'fixture:/api/organization/getBillingRecord'
  )
  cy.route(
    'PATCH',
    '1.0/organization/*/billing',
    'fixture:/api/general/emptyObject'
  )
  cy.route(
    'POST',
    '1.0/organization/*/billing',
    'fixture:/api/general/emptyObject'
  )
  cy.route(
    'GET',
    '1.0/organization/entity-type**',
    'fixture:/api/organization/getEntityTypes'
  )
  cy.route(
    'GET',
    '2.0/organization/preference/email**',
    'fixture:/api/organization/emailTemplates'
  )
  cy.route({
    method: 'POST',
    url: '/2.0/organization/preference/email',
    status: 201,
    response: { id: '1' }
  }).as('organizationTemplatePostRequest')

  cy.route({
    method: 'DELETE',
    url: '/2.0/organization/preference/email/**',
    status: 204,
    response: {}
  }).as('organizationTemplateDeleteRequest')

  cy.route({
    method: 'PATCH',
    url: '/2.0/organization/preference/email/*',
    status: 204,
    response: {}
  }).as('organizationTemplatePatchRequest')

  cy.route(
    'GET',
    '/2.0/measurement/device/sync?**',
    fetchOverride(
      '/2.0/measurement/device/sync?**',
      'fixture:/api/measurement/syncDevices'
    )
  )

  cy.route({
    method: 'POST',
    url: '/2.0/measurement/device/sync',
    status: 204,
    response: {}
  }).as('deviceSyncPostRequest')

  cy.route({
    method: 'PUT',
    url: '/2.0/measurement/device/sync/healthkit',
    status: 204,
    response: {}
  }).as('healthkitSyncPutRequest')
}

const seti18n = (): void => {
  cy.log('Loading i18n en file')

  cy.fixture('../../../admin/src/i18n/en.json').as('i18n-en')
  cy.route('GET', '/assets/i18n/admin/en.json', '@i18n-en')
}

export { ApiOverrideEntry, interceptCoreApiCalls, seti18n }
