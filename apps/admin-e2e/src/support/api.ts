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
    cy.intercept('GET', '2.0/session', { fixture: 'api/session/get' })
  } else {
    cy.log('Loading unauthenticated API routes')
    cy.intercept('GET', '2.0/session', {
      status: 401,
      body: {}
    })
  }

  cy.fixture(`api/account/getSingle`).then((data) => {
    data.preference.defaultOrganization = Cypress.env('organizationId')
    data.timezone = Cypress.env('timezone')

    cy.intercept('GET', `2.0/account/${Cypress.env('adminId')}`, {
      body: data
    }).as('getSingleAccount')
  })

  cy.intercept('GET', `2.0/account/${Cypress.env('patientId')}`, {
    fixture: 'api/account/patientSingle'
  })
  cy.intercept('GET', `2.0/account/${Cypress.env('providerId')}`, {
    fixture: 'api/account/coachSingle'
  })
  cy.intercept('GET', '2.0/account?accountType=2&offset=0&limit=10', {
    fixture: 'api/account/coachesList'
  })
  cy.intercept('GET', '2.0/account?accountType=3&offset=0&limit=10', {
    fixture: 'api/account/patientsList'
  })
  cy.intercept('GET', '2.0/country?**', { fixture: 'api/countries' })
  cy.intercept('GET', '2.0/organization/?**', {
    fixture: 'api/organization/organizationList'
  })
  cy.intercept('GET', `2.0/organization/${Cypress.env('organizationId')}`, {
    fixture: 'api/organization/getSingle'
  })
  cy.fixture('../../../admin/src/i18n/en.json').as('i18n-en')
  cy.intercept('GET', '/assets/i18n/admin/en.json', {
    fixture: '../../../admin/src/i18n/en.json'
  })
  cy.intercept('GET', '4.0/organization/**/preference/assets?id=*', {
    fixture: 'api/organization'
  }).as('apiCallOrgPreference')

  cy.intercept('GET', '1.0/warehouse/organization/billing?**', {
    fixture: 'api/general/emptyDataEmptyPagination'
  }).as('apiCallOrganizationBilling')

  cy.intercept('PATCH', '2.0/account/**', {
    statusCode: 204,
    body: {}
  })

  cy.intercept('GET', '1.0/app/android/**', { fixture: 'api/androidApp' }).as(
    'apiCallAndroidApp'
  )
  cy.intercept('GET', '1.0/app/ios/**', { fixture: 'api/iosApp' }).as(
    'apiCallIosApp'
  )
  cy.intercept('HEAD', '2.0/account?**', {
    statusCode: 404,
    body: {}
  })

  cy.intercept('PUT', '2.0/organization/**', {
    statusCode: 204,
    response: {}
  })

  cy.intercept(
    'PATCH',
    `/4.0/organization/${Cypress.env('organizationId')}/preference`,
    {
      statusCode: 204,
      body: {}
    }
  ).as('updateOrgCall')

  cy.intercept(
    'PATCH',
    `/4.0/organization/${Cypress.env('organizationId')}/preference/admin`,
    {
      statusCode: 204,
      response: {}
    }
  ).as('updateMalaCall')

  cy.intercept('GET', '4.0/organization/3378/preference?id=3378**', {
    fixture: 'api/organization/getPreference'
  })
  cy.intercept('GET', '1.0/message/preference/organization?organization=**', {
    fixture: 'api/organization/getPreferenceMessage'
  })
  cy.intercept('GET', '1.0/content/preference?organization=**', {
    fixture: 'api/organization/getPreferenceContent'
  })
  cy.intercept('GET', '1.0/communication/preference?organization=**', {
    fixture: 'api/organization/getPreferenceCommunication'
  })
  cy.intercept('GET', '1.0/sequence/preference/organization?organization=**', {
    fixture: 'api/organization/getPreferenceSequence'
  })
  cy.intercept('GET', '1.0/rpm/preference/organization?organization=**', {
    fixture: 'api/organization/getPreferenceRpm'
  })
  cy.intercept('GET', '1.0/content/vault/preference?organization=**', {
    fixture: 'api/organization/getPreferenceVault'
  })
  cy.intercept('GET', '1.0/mfa/preference?**', {
    fixture: 'api/organization/getPreferenceMfa'
  })
  cy.intercept('GET', '1.0/mfa/preference/section', {
    fixture: 'api/mfa/getSections'
  })
  cy.intercept('GET', '2.0/package/organization?**', {
    fixture: 'api/package/fetchAll'
  })

  cy.intercept('GET', '1.0/active-campaign/list/association**', {
    fixture: fetchOverride(
      '1.0/active-campaign/list/association**',
      'api/organization/getActiveCampaignListAssociations'
    )
  }).as('activeCampaignListAssociationGetRequest')
  cy.intercept('GET', '1.0/active-campaign/list', {
    fixture: 'api/organization/getActiveCampaignLists'
  })
  cy.intercept('POST', '1.0/active-campaign/list/association', {
    statusCode: 201,
    body: { id: '1' }
  }).as('activeCampaignListAssociationPostRequest')
  cy.intercept('DELETE', '1.0/active-campaign/list/association/**', {
    statusCode: 204,
    body: {}
  }).as('activeCampaignListAssociationDeleteRequest')
  cy.intercept('POST', '1.0/active-campaign/newsletter/subscription', {
    statusCode: 201,
    body: { id: '1' }
  }).as('activeCampaignListSubscriptionPostRequest')
  cy.intercept(
    'GET',
    `/2.0/account?query=test&accountType=2&organization=${Cypress.env(
      'organizationId'
    )}`,
    { fixture: 'api/account/coachesList' }
  )
  cy.intercept(
    'GET',
    `/2.0/account?organization=${Cypress.env(
      'organizationId'
    )}&accountType=2&offset=0&limit=all`,
    { fixture: 'api/account/coachesList' }
  )
  cy.intercept('GET', '1.0/billing-plan', {
    fixture: 'api/organization/getBillingPlans'
  })
  cy.intercept('GET', '1.0/organization/*/billing**', {
    fixture: 'api/organization/getBillingRecord'
  })
  cy.intercept('PATCH', '1.0/organization/*/billing', {
    fixture: 'api/general/emptyObject'
  })
  cy.intercept('POST', '1.0/organization/*/billing', {
    fixture: 'api/general/emptyObject'
  })
  cy.intercept('GET', '1.0/organization/entity-type**', {
    fixture: 'api/organization/getEntityTypes'
  })
  cy.intercept('GET', '2.0/organization/preference/email**', {
    fixture: 'api/organization/emailTemplates'
  })
  cy.intercept('POST', '/2.0/organization/preference/email', {
    statusCode: 201,
    body: { id: '1' }
  }).as('organizationTemplatePostRequest')

  cy.intercept('DELETE', '/2.0/organization/preference/email/**', {
    statusCode: 204,
    body: {}
  }).as('organizationTemplateDeleteRequest')

  cy.intercept('PATCH', '/2.0/organization/preference/email/*', {
    statusCoe: 204,
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
  cy.intercept('GET', '/assets/i18n/admin/en.json', {
    fixture: '../../../admin/src/i18n/en.json'
  })
}

export { ApiOverrideEntry, interceptCoreApiCalls, seti18n }
