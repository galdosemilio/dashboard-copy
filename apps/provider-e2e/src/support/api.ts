interface ApiOverrideEntry {
  url: string
  fixture: string
}

let overrides: ApiOverrideEntry[] = []

function fetchOverride(url: string, fixture: string): string {
  return overrides.find((e) => e.url === url)
    ? overrides.find((e) => e.url === url).fixture
    : fixture
}

function setupAccountEndpointData(data) {
  data.preference.defaultOrganization = Cypress.env('organizationId')
  data.timezone = Cypress.env('timezone')

  cy.intercept('GET', `/2.0/account/${Cypress.env('providerId')}`, {
    body: { ...data, id: Cypress.env('providerId') }
  }).as('getSingleAccount')

  cy.intercept('GET', `/2.0/account/${Cypress.env('providerIdOther')}`, {
    body: { ...data, id: Cypress.env('providerIdOther') }
  }).as('getSingleAccount')
}

const interceptCoreApiCalls = (
  apiOverrides?: ApiOverrideEntry[],
  mode: 'provider' | 'client' = 'provider'
): void => {
  cy.log('Loading base API intercept files')

  cy.log('Setting api overrides')
  overrides = apiOverrides ? apiOverrides : []

  if (mode === 'provider') {
    cy.fixture(`api/account/getSingle`).then(setupAccountEndpointData)
  } else {
    cy.fixture(`api/account/getSinglePatient`).then(setupAccountEndpointData)
  }

  cy.intercept('PATCH', `/2.0/account/**`, {
    statusCode: 204,
    fixture: 'api/general/emptyObject'
  }).as('accountPatchRequest')
  cy.intercept('GET', '/socket.io/**', '')
  cy.intercept('POST', '/socket.io/**', '')

  cy.intercept('GET', '/2.0/session', { fixture: 'api/session/get' })
  cy.intercept('GET', `/2.0/account/${Cypress.env('clientId')}`, {
    fixture: 'api/account/getSinglePatient'
  })
  cy.intercept('GET', '/2.0/organization/*?**', {
    fixture: 'api/organization/getSingle'
  })
  cy.intercept('GET', '/2.0/organization/*/descendants**', {
    fixture: 'api/organization/getAll'
  })
  cy.fixture('api/organization/getMala').then((data) => {
    data.id = Cypress.env('organizationId')
    data.content.enabled = Cypress.env('organizationId') === 1 ? true : false

    cy.intercept('GET', `/4.0/organization/undefined/preference**`, {
      body: data
    })
  })

  cy.intercept('GET', `/4.0/organization/*/preference**`, {
    fixture: 'api/organization/getMala'
  })

  cy.fixture('api/sequence/getOrgPreference').then((data) => {
    data.id = Cypress.env('organizationId')
    data.isActive = Cypress.env('organizationId') === 1 ? true : false

    cy.intercept(
      'GET',
      `/1.0/sequence/preference/organization?organization=**`,
      { body: data }
    )
  })
  cy.intercept('GET', '/1.0/sequence/enrollment**', {
    fixture: fetchOverride(
      '/1.0/sequence/enrollment**',
      'api/sequence/getEnrollments'
    )
  })
  cy.intercept('GET', '/1.0/sequence?**', {
    fixture: 'api/sequence/getSequences'
  }).as('getSequences')
  cy.intercept('GET', '/1.0/sequence/1?**', {
    fixture: 'api/sequence/getSingle'
  })
  cy.intercept('GET', '/1.0/sequence/2?**', {
    fixture: 'api/sequence/getSingle'
  })
  cy.intercept('GET', '/1.0/sequence/3?**', {
    fixture: 'api/sequence/getSingle'
  })

  cy.intercept('POST', `/1.0/sequence`, {
    statusCode: 200,
    body: {
      id: '1'
    }
  }).as('postSequence')

  cy.intercept('POST', `/1.0/sequence/**/clone`, {
    statusCode: 200,
    body: {
      id: '1'
    }
  }).as('cloneSequence')

  cy.intercept('PATCH', `/1.0/sequence/1**`, {
    statusCode: 204,
    body: {}
  }).as('patchSequence')

  cy.intercept('POST', `/1.0/sequence/state`, {
    statusCode: 200,
    body: {
      id: `${Math.round(Math.random() * 1000000)}`
    }
  }).as('postState')

  cy.intercept('PATCH', `/1.0/sequence/state/**`, {
    statusCode: 204,
    body: {}
  })

  cy.intercept('POST', `/1.0/sequence/trigger`, {
    statusCode: 200,
    body: {
      id: `${Math.round(Math.random() * 1000000)}`
    }
  })

  cy.intercept('POST', `/1.0/sequence/transition`, {
    statusCode: 200,
    body: {
      id: `${Math.round(Math.random() * 1000000)}`
    }
  }).as('sequencePostTransition')

  cy.intercept('DELETE', `/1.0/sequence/transition/**`, {
    statusCode: 204,
    body: {}
  })

  cy.intercept('PATCH', `/1.0/sequence/trigger/**`, {
    statusCode: 204,
    body: {}
  }).as('sequenceTriggerDeactivate')

  cy.intercept('GET', `/2.0/organization/${Cypress.env('organizationId')}`, {
    fixture: 'api/organization/getSingle'
  })
  cy.intercept('GET', '/2.0/access/organization?**', {
    fixture: fetchOverride(
      '/2.0/access/organization?**',
      'api/organization/getAll'
    )
  })
  cy.intercept('GET', '/2.0/access/organization?account=1&ancestor=999**', {
    fixture: fetchOverride(
      '/2.0/access/organization?account=1&ancestor=999**',
      'api/organization/getAll'
    )
  }).as('api-access_organization_sequence')

  cy.intercept('POST', '/2.0/account', {
    statusCode: 201,
    body: { id: '1' }
  }).as('accountPostRequest')

  cy.intercept('GET', '/2.0/message/unread', {
    fixture: fetchOverride('/2.0/message/unread', 'api/message/getUnreadNone')
  })
  cy.intercept('GET', '/3.0/conference/video/call**', {
    fixture: 'api/general/emptyDataEmptyPagination'
  })
  cy.intercept('GET', '/2.0/message/thread?**', {
    fixture: 'api/message/getThreads'
  })
  cy.intercept('GET', '/2.0/message/thread/**', {
    fixture: 'api/message/getThread'
  }).as('threadGetRequest')
  cy.intercept('POST', '/2.0/message/viewed', {
    fixture: 'api/general/emptyObject'
  }).as('threadMarkAsViewedRequest')
  cy.intercept('POST', '/2.0/message', { statusCode: 204, body: {} }).as(
    'messagePostRequest'
  )
  cy.intercept('POST', '/2.0/message/permission', {
    statusCode: 204,
    body: {}
  }).as('threadMemberAddRequest')
  cy.intercept('PATCH', '/2.0/message/thread/*/*', {
    statusCode: 204,
    body: {}
  }).as('threadMemberUpdateRequest')
  cy.intercept('GET', '/1.0/authentication/**', {
    fixture: 'api/access/availableDevices'
  })
  cy.intercept('GET', '/3.0/account/*/avatar', { fixture: 'api/avatar/get' })
  cy.intercept('GET', '/2.0/food/consumed**', { fixture: 'api/food/consumed' })
  cy.intercept('GET', '/2.0/food/meal/**', { fixture: 'api/food/consumedMeal' })
  cy.intercept('GET', '/2.0/nutrition/summary?**', {
    fixture: 'api/food/nutrition-summary'
  })
  cy.intercept('GET', '/1.0/food/consumed/*', {
    fixture: 'api/food/consumed-old'
  })

  cy.intercept('GET', '/1.0/rpm/preference/organization?organization=**', {
    fixture: 'api/rpm/getOrgPreference'
  })
  cy.intercept('GET', '/1.0/communication/preference?organization=**', {
    fixture: fetchOverride(
      '/1.0/communication/preference?organization=**',
      'api/communication/getOrgPreference-enabled'
    )
  })
  cy.intercept('GET', '/3.0/conference/video/call?status=ended**', {
    fixture: 'api/communication/getCalls'
  })
  cy.intercept('GET', '/1.0/conference/subaccount**', {
    fixture: 'api/conference/fetchSubaccount'
  })
  cy.intercept('GET', '/1.0/content/vault/preference?organization=**', {
    fixture: fetchOverride(
      `/1.0/content/vault/preference?organization=**`,
      'api/filevault/getOrgPreference-enabled'
    )
  })

  cy.intercept('GET', '/4.0/rpm/state**', {
    fixture: fetchOverride('/1.0/rpm/state**', 'api/general/emptyData')
  }).as('getRpm')

  cy.intercept('GET', '/1.0/rpm/preference/organization/**', {
    fixture: fetchOverride(
      '/1.0/rpm/preference/organization?organization=**',
      'api/rpm/getOrgPreference'
    )
  })
  cy.intercept('PATCH', '/1.0/rpm/preference/organization/**', {
    statusCode: 204,
    body: {}
  }).as('rpmPreferencePatchRequest')
  cy.intercept('POST', '/1.0/rpm/preference/organization', {
    statusCode: 204,
    body: { id: '1' }
  }).as('rpmPreferencePostRequest')
  cy.intercept('DELETE', '/1.0/rpm/preference/organization/**', {
    statusCode: 204,
    body: {}
  }).as('rpmPreferenceDeleteRequest')

  cy.intercept('GET', '/1.0/message/preference/organization?organization=**', {
    fixture: 'api/message/getOrgPreference-enabled'
  })

  cy.fixture(`api/rpm/getOrgPreference`).then((data) => {
    data.id = Cypress.env('organizationId')
    data.isActive = Cypress.env('organizationId') === 1 ? false : true

    const override = fetchOverride(
      '/1.0/rpm/preference/organization?organization=**',
      ''
    )

    cy.intercept(
      'GET',
      `/1.0/rpm/preference/organization?organization=**`,
      override
        ? {
            fixture: override
          }
        : { body: data, statusCode: 200 }
    )
  })

  cy.intercept('GET', '/1.0/content?**', {
    fixture: 'api/library/file-explorer-contents'
  })
  cy.intercept('GET', '1.0/content/form/addendum?**', {
    fixture: 'api/general/emptyDataEmptyPagination'
  })
  cy.intercept(
    'GET',
    `/1.0/content/form/submission/${Cypress.env('formSubmissionId')}`,
    { fixture: 'api/form/form-submission-single.json' }
  )
  cy.intercept('GET', `/1.0/content/form/${Cypress.env('formId')}?**`, {
    fixture: fetchOverride(
      `/1.0/content/form/${Cypress.env('formId')}?**`,
      'api/form/full-form'
    )
  })
  cy.intercept('GET', '/1.0/content/form?**', {
    fixture: 'api/general/emptyDataEmptyPagination'
  })
  cy.intercept('GET', '/2.0/package?**', {
    fixture: 'api/package/getPackages1'
  })
  cy.intercept('GET', '/2.0/package/enrollment?**', {
    fixture: 'api/package/getEnrollments1'
  })
  cy.intercept('GET', '/2.0/package/organization?**', {
    fixture: 'api/package/getPackages'
  })
  cy.intercept('POST', '2.0/package/enrollment', {
    fixture: 'api/general/emptyObject'
  })
  cy.intercept('PATCH', '2.0/package/enrollment/**', {
    fixture: 'api/general/emptyObject'
  })
  cy.intercept('GET', '/1.0/goal?account=**', { fixture: 'api/goal/getGoal' })
  cy.intercept('PUT', '/1.0/goal', {
    statusCode: 204,
    body: {}
  }).as('goalPutRequest')
  cy.intercept('GET', '/2.0/access/account?**', {
    fixture: fetchOverride(
      '/2.0/access/account?**',
      'api/access/getAccountAccess'
    )
  }).as('api-access_account')
  cy.intercept('GET', '/3.0/measurement/body?**', {
    fixture: 'api/measurement/getBody'
  })
  cy.intercept('GET', '/1.0/measurement/label?**', {
    fixture: 'api/measurement/labels'
  }).as('measurementLabelGetRequest')
  cy.intercept('POST', '/1.0/measurement/label', {
    statusCode: 204,
    body: {}
  }).as('measurementLabelPostRequest')
  cy.intercept('PATCH', '/1.0/measurement/label/**', {
    statusCode: 204,
    body: {}
  }).as('measurementLabelPatchRequest')
  cy.intercept('GET', '/1.0/measurement/preference?**', {
    fixture: fetchOverride(
      '/1.0/measurement/preference?**',
      'api/measurement/preference'
    )
  })
  cy.intercept('POST', '/1.0/measurement/preference', {
    statusCode: 204,
    body: {}
  })
  cy.intercept('PATCH', '/1.0/measurement/preference/**', {
    statusCode: 204,
    body: {}
  })
  cy.intercept('GET', '/1.0/measurement/data-point/type?**', {
    fixture: 'api/measurement/getDataPointType'
  })
  cy.intercept('GET', '/1.0/measurement/data-point/type/association?**', {
    fixture: 'api/measurement/dataPointAssociations'
  })
  cy.intercept('POST', '/1.0/measurement/data-point/type/association', {
    statusCode: 204,
    body: {}
  }).as('measurementDataPointTypeAssocPostRequest')
  cy.intercept('DELETE', '/1.0/measurement/data-point/type/association/**', {
    statusCode: 204,
    body: {}
  }).as('measurementDataPointTypeAssocDeleteRequest')
  cy.intercept('GET', '1.0/measurement/data-point/group?**', {
    fixture: 'api/general/emptyDataEmptyPagination'
  })
  cy.intercept('GET', '/2.0/available/calendar?**', {
    fixture: 'api/meeting/getAvailability'
  })
  cy.intercept('GET', '/2.0/available?provider**', {
    fixture: 'api/general/emptyDataEmptyPagination'
  })
  cy.intercept('GET', '/1.0/meeting/attendance/status/**', {
    fixture: 'api/meeting/getAttendanceStatuses'
  })
  cy.intercept('PATCH', '/3.0/meeting/attendance/**', {
    fixture: 'api/general/emptyObject'
  })
  cy.intercept('GET', '/4.0/meeting?**', {
    fixture: fetchOverride('/3.0/meeting?**', 'api/meeting/getListing')
  }).as('getMeetingsRequest')
  cy.intercept('GET', '/3.0/meeting/**', {
    fixture: fetchOverride('/3.0/meeting/**', 'api/meeting/getSingle')
  })
  cy.intercept('PUT', '/2.0/meeting/**', {
    statusCode: 204,
    fixture: 'api/general/emptyObject'
  })
  cy.intercept('DELETE', '/2.0/meeting/**', {
    statusCode: 200,
    fixture: 'api/general/emptyObject'
  }).as('deleteMeeting')
  cy.intercept('GET', '/2.0/meeting/type/organization/**', {
    fixture: 'api/meeting/getTypes'
  })
  cy.intercept(
    'GET',
    new RegExp(
      `\/2\.0\/account\/(?!${Cypress.env('clientId')}|${Cypress.env(
        'providerId'
      )})`
    ),
    { fixture: 'api/meeting/getSingleAttendee' }
  )
  cy.intercept('GET', '/2.0/measurement/body/summary?account=**', {
    fixture: 'api/measurement/getBodySummary'
  })
  cy.intercept('GET', '/2.0/supplement/summary?**', {
    fixture: 'api/supplements/supplements-summary.json'
  })
  cy.intercept('GET', '/3.0/supplement/organization?**', {
    fixture: 'api/supplements/organization-supplements.json'
  })
  cy.intercept('GET', '/1.0/hydration/summary?**', {
    fixture: 'api/hydration/hydration-summary.json'
  })
  cy.intercept('GET', '/2.0/measurement/activity/summary?**', {
    fixture: 'api/measurement/getActivitySummary'
  })
  cy.intercept('GET', '/1.0/measurement/sleep/summary?**', {
    fixture: 'api/measurement/getSleepSummary'
  })
  cy.intercept('GET', '/1.0/consultation?**', {
    fixture: 'api/general/emptyArray'
  })
  cy.intercept('GET', '/1.0/notification?**', {
    fixture: 'api/alert/notifications'
  })
  cy.intercept('GET', '/3.0/warehouse/rpm/state/billing-summary?**', {
    fixture: fetchOverride(
      '/3.0/warehouse/rpm/state/billing-summary?**',
      'api/warehouse/getRPMBilling'
    )
  }).as('billingSummaryGetRequest')
  cy.intercept('GET', '/2.0/warehouse/organization/sign-ups/timeline**', {
    fixture: 'api/warehouse/getSignups'
  })
  cy.intercept('GET', '/2.0/warehouse/demographics/age**', {
    fixture: 'api/warehouse/demographicsAge'
  })
  cy.intercept('GET', '/2.0/warehouse/provider/count**', {
    fixture: 'api/warehouse/providerCount'
  })
  cy.intercept('GET', '/2.0/warehouse/weight/change**', {
    fixture: 'api/general/emptyDataEmptyPagination'
  })
  cy.intercept('GET', '/2.0/warehouse/organization/sign-ups/timeline**', {
    fixture: 'api/general/emptyDataEmptyPagination'
  })
  cy.intercept('GET', '/2.0/warehouse/enrollment/simple**', {
    fixture: 'api/general/emptyDataEmptyPagination'
  })
  cy.intercept('GET', '/2.0/warehouse/enrollment/patient-count**', {
    fixture: 'api/general/emptyDataEmptyPagination'
  })
  cy.intercept('GET', '/1.0/warehouse/patient-listing**', {
    fixture: 'api/warehouse/getPatientListing'
  }).as('patientListingGetRequest')
  cy.intercept('GET', '/2.0/warehouse/organization/activity**', {
    fixture: 'api/general/emptyDataEmptyPagination'
  })
  cy.intercept('GET', '/2.0/warehouse/alert/type**', {
    fixture: 'api/alert/getTypes'
  })
  cy.intercept('GET', '/2.0/warehouse/alert/preference**', {
    fixture: 'api/warehouse/alertPreference'
  })
  cy.intercept('POST', '/2.0/warehouse/alert/preference', {
    statusCode: 201,
    body: { id: '1' }
  }).as('createAlertPreferenceRequest')
  cy.intercept('PATCH', '/2.0/warehouse/alert/preference/**', {
    statusCode: 200
  }).as('patchAlertPreferenceRequest')
  cy.intercept('DELETE', '/2.0/warehouse/alert/preference/**', {
    statusCode: 200
  }).as('deleteAlertPreferenceRequest')

  cy.intercept('GET', '/1.0/content/form/submission?**', {
    fixture: fetchOverride(
      '/1.0/content/form/submission?**',
      'api/form/getListing'
    )
  })
  cy.intercept('GET', '/1.0/content/form/submission/1', {
    fixture: 'api/form/getForm1'
  })
  cy.intercept('GET', '/1.0/content/form/submission/2', {
    fixture: 'api/form/getForm2'
  })
  cy.intercept('GET', '/1.0/content/form/submission/3', {
    fixture: 'api/form/getForm3'
  })
  cy.intercept('GET', '/1.0/content/form/15081?**', {
    fixture: 'api/form/getStructure'
  })
  cy.intercept('GET', '/2.0/account/*/external-identifier?account=**', {
    fixture: fetchOverride(
      '/2.0/account/*/external-identifier?account=**',
      'api/general/emptyData'
    )
  })
  cy.intercept('DELETE', '/1.0/content/form/submission/**', {
    statusCode: 204,
    body: {}
  }).as('formSubmissionDeleteRequest')

  cy.intercept('POST', '/1.0/content/form/submission', {
    body: { id: '1' }
  }).as('formSubmit')

  cy.intercept('POST', '/2.0/organization', {
    statusCode: 201,
    body: { id: '1' }
  }).as('organizationCreateRequest')

  cy.intercept('POST', '/1.0/account/activity/event', {
    statusCode: 201,
    body: {}
  }).as('accountActivityPostRequest')

  cy.intercept('GET', '/3.0/rpm/state/reason**', {
    fixture: 'api/rpm/deactivationReasons'
  })

  cy.intercept('POST', '/4.0/rpm/state', {
    fixture: 'api/general/emptyData'
  }).as('rpmStatePostRequest')

  cy.intercept('GET', '/1.0/rpm/individual-summary**', {
    statusCode: 200,
    body: {}
  }).as('rpmIndividualSummaryRequest')

  cy.intercept('GET', '/1.0/rpm/state/audit**', {
    fixture: 'api/rpm/rpmStateAuditEntries.json'
  })

  cy.intercept(
    'POST',
    `/1.0/content/copy/${Cypress.env('firstContentItemId')}/dry-run`,
    {
      fixture: fetchOverride(
        `/1.0/content/copy/${Cypress.env('firstContentItemId')}/dry-run`,
        'api/library/dry-run-success'
      )
    }
  )

  cy.intercept(
    'POST',
    `/1.0/content/copy/${Cypress.env('secondContentItemId')}/dry-run`,
    {
      fixture: fetchOverride(
        `/1.0/content/copy/${Cypress.env('secondContentItemId')}/dry-run`,
        'api/library/dry-run-success'
      )
    }
  )

  cy.intercept(
    'POST',
    `/1.0/content/copy/${Cypress.env('thirdContentItemId')}/dry-run`,
    {
      fixture: fetchOverride(
        `/1.0/content/copy/${Cypress.env('thirdContentItemId')}/dry-run`,
        'api/library/dry-run-success'
      )
    }
  )

  cy.intercept('POST', '/1.0/content/copy/*', {
    statusCode: 201,
    body: { id: '1' }
  }).as('contentCopyRequest')

  cy.intercept('GET', '/1.0/content/*', {
    statusCode: 200,
    body: { id: '1' }
  })

  cy.intercept('PATCH', '/1.0/content/*', {
    statusCode: 204,
    body: {}
  })

  cy.intercept('GET', '/1.0/content/vault?**', {
    fixture: 'api/filevault/file-vault-contents'
  })

  cy.intercept('POST', '/1.0/sequence/enrollment/bulk', {
    statusCode: 204,
    body: {
      id: '1'
    }
  }).as('sequenceBulkEnrollmentPostRequest')

  cy.intercept('POST', '/1.0/sequence/enrollment/bulk/organization', {
    statusCode: 204,
    body: {
      id: '1'
    }
  }).as('sequenceBulkOrganizationEnrollmentPostRequest')

  cy.intercept('POST', '/2.0/package', {
    statusCode: 201,
    body: { id: '1' }
  }).as('packagePostRequest')

  cy.intercept('PUT', '/1.0/sequence/*/autoenrollment/preference', {
    statusCode: 204,
    body: {
      id: '1'
    }
  }).as('sequenceAutoEnrollmentPutRequest')

  cy.intercept('PATCH', '/2.0/package/organization/*', {
    statusCode: 204,
    body: {}
  }).as('packageOrganizationPatchRequest')
  cy.intercept('GET', '/1.0/account/*/login-history?**', {
    fixture: 'api/account/getLoginHistory.json'
  })
  cy.intercept('DELETE', '/1.0/package/enrollment/*', {
    statusCode: 204,
    body: {}
  })
  cy.intercept(
    'GET',
    'https://coachcare.zendesk.com/api/v2/help_center/en-us/categories/360002579931/articles.json?sort_by=created_at&sort_order=desc',
    { fixture: 'api/zendesk/zendeskArticles' }
  )

  cy.intercept('GET', '/2.0/measurement/device/sync**', {
    fixture: 'api/measurement/deviceSyncing'
  })

  cy.intercept('GET', '/1.0/communication/interaction?**', {
    fixture: 'api/interactions/getAll'
  })

  cy.intercept('GET', '/1.0/communication/interaction/type**', {
    fixture: 'api/interactions/getAllTypes'
  })

  cy.intercept('POST', '/1.0/communication/interaction/manual', {
    statusCode: 204,
    body: { id: '1' }
  }).as('manualInteractionPostRequest')

  cy.intercept('GET', '/1.0/communication/interaction/self**', {
    fixture: 'api/general/emptyDataEmptyPagination'
  })

  cy.intercept('GET', '1.0/communication/interaction/billable-service**', {
    fixture: 'api/interactions/getBillableServices'
  })

  cy.intercept('GET', '1.0/measurement/data-point/summary?**', {
    fixture: 'api/measurement/dataPointSummary'
  })

  cy.intercept('GET', '1.0/rpm/supervising-provider?**', {
    fixture: fetchOverride(
      '1.0/rpm/supervising-provider?**',
      'api/rpm/supervisingProviders'
    )
  })

  cy.intercept('POST', '1.0/rpm/supervising-provider', {
    statusCode: 204,
    body: { id: '1' }
  }).as('supervisingProviderPostRequest')

  cy.intercept('DELETE', '1.0/rpm/supervising-provider/**', {
    statusCode: 204,
    body: {}
  }).as('supervisingProviderDeleteRequest')

  cy.intercept('GET', '1.0/rpm/state/1/diagnosis/audit?**', {
    fixture: fetchOverride(
      '1.0/rpm/state/1/diagnosis/audit?**',
      'api/general/emptyDataEmptyPagination'
    )
  })

  cy.intercept('PUT', '1.0/rpm/state/1/diagnosis', {
    statusCode: 204,
    body: {}
  }).as('rpmDiagnosisPutRequest')

  cy.intercept('DELETE', '2.0/association/**', {
    statusCode: 204,
    body: {}
  }).as('clinicAssociationDeleteRequest')
  cy.intercept('GET', '/1.0/message/draft**', {
    statusCode: 404,
    body: {}
  })

  cy.intercept('PUT', '/1.0/message/draft', {
    statusCode: 204,
    body: {}
  }).as('upsertMessageDraft')

  cy.intercept('DELETE', '/1.0/message/draft**', {
    statusCode: 204,
    body: {}
  })

  cy.intercept('GET', '1.0/content/form/submission/draft/**', {
    statusCode: 404,
    body: {}
  })

  cy.intercept('PUT', '1.0/content/form/submission/draft/**', {
    statusCode: 204,
    body: {}
  }).as('upsertFormSubmissionDraft')

  cy.intercept('GET', '1.0/address/label', {
    fixture: 'api/address/addressLabels'
  })

  cy.intercept('POST', `1.0/account/${Cypress.env('clientId')}/address`, {
    statusCode: 204,
    body: {}
  }).as('postAddressRequestClient')

  cy.intercept('PATCH', `1.0/account/${Cypress.env('clientId')}/address/**`, {
    statusCode: 204,
    body: {}
  }).as('patchAddressRequest')

  cy.intercept('DELETE', `1.0/account/${Cypress.env('clientId')}/address/**`, {
    statusCode: 204,
    body: {}
  }).as('deleteAddressRequest')

  cy.intercept('GET', `1.0/account/${Cypress.env('providerId')}/address**`, {
    fixture: 'api/address/getAddresses'
  })

  cy.intercept('GET', `1.0/account/${Cypress.env('clientId')}/address**`, {
    fixture: 'api/address/getAddresses'
  })

  cy.intercept('POST', `1.0/account/${Cypress.env('providerId')}/address`, {
    statusCode: 204,
    body: {}
  }).as('postAddressRequest')

  cy.intercept('PATCH', `1.0/account/${Cypress.env('providerId')}/address/**`, {
    statusCode: 204,
    body: {}
  }).as('patchAddressRequest')

  cy.intercept(
    'DELETE',
    `1.0/account/${Cypress.env('providerId')}/address/**`,
    {
      statusCode: 204,
      body: {}
    }
  ).as('deleteAddressRequest')

  cy.intercept('GET', `1.0/account/${Cypress.env('providerId')}/address**`, {
    fixture: 'api/address/getAddresses'
  })

  cy.intercept('GET', '2.0/package/enrollment/check?**', {
    body: { enrolled: true }
  })

  cy.intercept('GET', '1.0/warehouse/measurement/cohort/listing**', {
    fixture: 'api/warehouse/cohortListing'
  }).as('getCohortListingRequest')
}

const seti18n = (): void => {
  cy.log('Loading i18n en file')

  cy.fixture('../../../provider/src/assets/i18n/en.json').as('i18n-en')
  cy.intercept('GET', '/assets/i18n/en.json', {
    fixture: '../../../provider/src/assets/i18n/en.json'
  })
}

export { ApiOverrideEntry, interceptCoreApiCalls, seti18n }
