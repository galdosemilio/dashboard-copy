interface ApiOverrideEntry {
  url: string;
  fixture: string;
}

let overrides: ApiOverrideEntry[] = [];

function fetchOverride(url: string, fixture: string): string {
  return overrides.find((e) => e.url === url)
    ? overrides.find((e) => e.url === url).fixture
    : fixture;
}

const interceptCoreApiCalls = (apiOverrides?: ApiOverrideEntry[]): void => {
  cy.log('Loading base API intercept files');

  cy.log('Setting api overrides');
  overrides = apiOverrides ? apiOverrides : [];
  cy.fixture(`api/account/getSingle`).then((data) => {
    data.preference.defaultOrganization = Cypress.env('organizationId');
    data.timezone = Cypress.env('timezone');

    cy.route('GET', `/2.0/account/${Cypress.env('providerId')}`, {
      ...data,
      id: Cypress.env('providerId'),
    }).as('getSingleAccount');

    cy.route('GET', `/2.0/account/${Cypress.env('providerIdOther')}`, {
      ...data,
      id: Cypress.env('providerIdOther'),
    }).as('getSingleAccount');
  });

  cy.route('PATCH', `/2.0/account/**`, {
    status: 204,
    response: 'fixture:api/general/emptyObject',
  });
  cy.route('GET', '/socket.io/**', '');
  cy.route('POST', '/socket.io/**', '');

  cy.route('GET', '/2.0/session', 'fixture:api/session/get');
  cy.route(
    'GET',
    `/2.0/account/${Cypress.env('clientId')}`,
    'fixture:api/account/getSinglePatient'
  );
  cy.route(
    'GET',
    '/2.0/organization/*?**',
    'fixture:api/organization/getSingle'
  );
  cy.route(
    'GET',
    '/2.0/organization/*/descendants**',
    'fixture:api/organization/getAll'
  );
  cy.fixture('api/organization/getMala').then((data) => {
    data.id = Cypress.env('organizationId');
    data.content.enabled = Cypress.env('organizationId') === 1 ? true : false;

    cy.route(
      'GET',
      `/4.0/organization/${Cypress.env('organizationId')}/preference?mala=true`,
      data
    );
  });
  cy.fixture('api/sequence/getOrgPreference').then((data) => {
    data.id = Cypress.env('organizationId');
    data.isActive = Cypress.env('organizationId') === 1 ? true : false;

    cy.route(
      'GET',
      `/1.0/sequence/preference/organization?organization=**`,
      data
    );
  });
  cy.route(
    'GET',
    '/1.0/sequence/enrollment**',
    fetchOverride(
      '/1.0/sequence/enrollment**',
      'fixture:api/sequence/getEnrollments'
    )
  );
  cy.route('GET', '/1.0/sequence?**', 'fixture:api/sequence/getSequences');
  cy.route('GET', '/1.0/sequence/1?**', 'fixture:api/sequence/getSingle');

  cy.route({
    method: 'POST',
    url: `/1.0/sequence`,
    status: 200,
    response: {
      id: '1',
    },
  }).as('postSequence');

  cy.route({
    method: 'POST',
    url: `/1.0/sequence/**/clone`,
    status: 200,
    response: {
      id: '1',
    },
  }).as('cloneSequence');

  cy.route({
    method: 'PATCH',
    url: `/1.0/sequence/1**`,
    status: 204,
    response: {},
  }).as('patchSequence');

  cy.route({
    method: 'POST',
    url: `/1.0/sequence/state`,
    status: 200,
    response: {
      id: `${Math.round(Math.random() * 1000000)}`,
    },
  }).as('postState');

  cy.route({
    method: 'PATCH',
    url: `/1.0/sequence/state/**`,
    status: 204,
    response: {},
  });

  cy.route({
    method: 'POST',
    url: `/1.0/sequence/trigger`,
    status: 200,
    response: {
      id: `${Math.round(Math.random() * 1000000)}`,
    },
  });

  cy.route({
    method: 'POST',
    url: `/1.0/sequence/transition`,
    status: 200,
    response: {
      id: `${Math.round(Math.random() * 1000000)}`,
    },
  }).as('sequencePostTransition');

  cy.route({
    method: 'DELETE',
    url: `/1.0/sequence/transition/**`,
    status: 204,
    response: {},
  });

  cy.route({
    method: 'PATCH',
    url: `/1.0/sequence/trigger/**`,
    status: 204,
    response: {},
  }).as('sequenceTriggerDeactivate');

  cy.route(
    'GET',
    `/2.0/organization/${Cypress.env('organizationId')}`,
    'fixture:api/organization/getSingle'
  );
  cy.route(
    'GET',
    '/2.0/access/organization?**',
    fetchOverride(
      '/2.0/access/organization?**',
      'fixture:api/organization/getAll'
    )
  );
  cy.route(
    'GET',
    '/2.0/access/organization?account=1&ancestor=999**',
    fetchOverride(
      '/2.0/access/organization?account=1&ancestor=999**',
      'fixture:api/organization/getAll'
    )
  ).as('api-access_organization_sequence');
  cy.route({
    method: 'POST',
    url: '/2.0/account',
    status: 201,
    response: { id: '1' },
  }).as('accountPostRequest');
  cy.route('GET', '/2.0/message/unread', 'fixture:/api/message/getUnreadNone');
  cy.route(
    'GET',
    '/3.0/conference/video/call**',
    'fixture:/api/general/emptyDataEmptyPagination'
  );
  cy.route(
    'GET',
    '/1.0/conference/subaccount**',
    'fixture:/api/general/emptyData'
  );
  cy.route(
    'GET',
    '/3.0/meeting**',
    'fixture:/api/general/emptyDataEmptyPagination'
  );
  cy.route('GET', '/2.0/message/thread?**', 'fixture:/api/message/getThreads');
  cy.route('GET', '/2.0/message/thread/**', 'fixture:/api/message/getThread');
  cy.route(
    'GET',
    '/1.0/authentication/**',
    'fixture:/api/access/availableDevices'
  );
  cy.route('GET', '/2.0/food/consumed**', 'fixture:/api/food/consumed');
  cy.route('GET', '/2.0/food/meal/**', 'fixture:api/food/consumedMeal');
  cy.route(
    'GET',
    '/2.0/nutrition/summary?**',
    'fixture:/api/food/nutrition-summary'
  );
  cy.route('GET', '/1.0/food/consumed/*', 'fixture:/api/food/consumed-old');
  cy.route(
    'GET',
    '/1.0/rpm/state**',
    fetchOverride('/1.0/rpm/state**', 'fixture:/api/general/emptyData')
  ).as('getRpm');
  cy.route(
    'GET',
    '/1.0/rpm/preference/organization?organization=**',
    'fixture:/api/rpm/getOrgPreference'
  );
  cy.route(
    'GET',
    '/1.0/communication/preference?organization=**',
    'fixture:/api/communication/getOrgPreference-enabled'
  );
  cy.route(
    'GET',
    '/3.0/conference/video/call?status=ended**',
    'fixture:/api/communication/getCalls'
  );
  cy.route(
    'GET',
    '/1.0/conference/subaccount**',
    'fixture:/api/conference/fetchSubaccount'
  );
  cy.route(
    'GET',
    '/1.0/content/vault/preference?organization=**',
    fetchOverride(
      `/1.0/content/vault/preference?organization=**`,
      'fixture:/api/filevault/getOrgPreference-enabled'
    )
  );
  cy.route(
    'GET',
    '/1.0/message/preference/organization?organization=**',
    'fixture:/api/message/getOrgPreference-enabled'
  );

  cy.fixture(`api/rpm/getOrgPreference`).then((data) => {
    data.id = Cypress.env('organizationId');
    data.isActive = Cypress.env('organizationId') === 1 ? false : true;

    cy.route('GET', `/1.0/rpm/preference/organization?organization=**`, data);
  });

  cy.route(
    'GET',
    '/1.0/content?**',
    'fixture:/api/library/file-explorer-contents'
  );
  cy.route(
    'GET',
    '1.0/content/form/addendum?**',
    'fixture:/api/general/emptyDataEmptyPagination'
  );
  cy.route(
    'GET',
    `/1.0/content/form/submission/${Cypress.env('formSubmissionId')}`,
    'fixture:/api/form/form-submission-single.json'
  );
  cy.route(
    'GET',
    `/1.0/content/form/${Cypress.env('formId')}?**`,
    fetchOverride(
      `/1.0/content/form/${Cypress.env('formId')}?**`,
      'fixture:/api/form/full-form'
    )
  );
  cy.route(
    'GET',
    '/1.0/content/form?**',
    'fixture:/api/general/emptyDataEmptyPagination'
  );
  cy.route('GET', '/2.0/package?**', 'fixture:/api/package/getPackages1');
  cy.route(
    'GET',
    '/2.0/package/enrollment?**',
    'fixture:/api/package/getEnrollments1'
  );
  cy.route(
    'GET',
    '/2.0/package/organization?**',
    'fixture:/api/package/getPackages'
  );
  cy.route(
    'POST',
    '2.0/package/enrollment',
    'fixture:/api/general/emptyObject'
  );
  cy.route('GET', '/1.0/goal?account=**', 'fixture:/api/goal/getGoal');
  cy.route({
    method: 'PUT',
    url: '/1.0/goal',
    status: 204,
    response: {},
  }).as('goalPutRequest');
  cy.route(
    'GET',
    '/2.0/access/account?**',
    fetchOverride(
      '/2.0/access/account?**',
      'fixture:/api/access/getAccountAccess'
    )
  ).as('api-access_account');
  cy.route(
    'GET',
    '/3.0/measurement/body?**',
    'fixture:/api/measurement/getBody'
  );
  cy.route(
    'GET',
    '/2.0/available/calendar?**',
    'fixture:/api/meeting/getAvailability'
  );
  cy.route(
    'GET',
    '/1.0/meeting/attendance/status/**',
    'fixture:/api/meeting/getAttendanceStatuses'
  );
  cy.route(
    'PATCH',
    '/3.0/meeting/attendance/**',
    'fixture:/api/general/emptyObject'
  );
  cy.route(
    'GET',
    '/3.0/meeting?**',
    fetchOverride('/3.0/meeting?**', 'fixture:/api/meeting/getListing')
  );
  cy.route(
    'GET',
    '/3.0/meeting/**',
    fetchOverride('/3.0/meeting/**', 'fixture:/api/meeting/getSingle')
  );
  cy.route('PUT', '/2.0/meeting/**', {
    status: 204,
    response: 'fixture:api/general/emptyObject',
  });
  cy.route('DELETE', '/2.0/meeting/**', {
    status: 200,
    response: 'fixture:api/general/emptyObject',
  }).as('deleteMeeting');
  cy.route(
    'GET',
    '/2.0/meeting/type/organization/**',
    'fixture:/api/meeting/getTypes'
  );
  cy.route(
    'GET',
    new RegExp(
      `\/2\.0\/account\/(?!${Cypress.env('clientId')}|${Cypress.env(
        'providerId'
      )})`
    ),
    'fixture:/api/meeting/getSingleAttendee'
  );
  cy.route(
    'GET',
    '/2.0/measurement/body/summary?account=**',
    'fixture:/api/measurement/getBodySummary'
  );
  cy.route(
    'GET',
    '/2.0/supplement/summary?**',
    'fixture:/api/supplements/supplements-summary.json'
  );
  cy.route(
    'GET',
    '/3.0/supplement/organization?**',
    'fixture:/api/supplements/organization-supplements.json'
  );
  cy.route(
    'GET',
    '/1.0/hydration/summary?**',
    'fixture:/api/hydration/hydration-summary.json'
  );
  cy.route(
    'GET',
    '/1.0/measurement/activity/summary?**',
    'fixture:/api/measurement/getActivitySummary'
  );
  cy.route(
    'GET',
    '/1.0/measurement/sleep/summary?**',
    'fixture:/api/measurement/getSleepSummary'
  );
  cy.route('GET', '/1.0/consultation?**', 'fixture:/api/general/emptyArray');
  cy.route(
    'GET',
    '/1.0/notification?**',
    'fixture:/api/general/emptyDataEmptyPagination'
  );
  cy.route(
    'GET',
    '/3.0/warehouse/rpm/state/billing-summary?**',
    fetchOverride(
      '/3.0/warehouse/rpm/state/billing-summary?**',
      'fixture:/api/warehouse/getRPMBilling'
    )
  );
  cy.route(
    'GET',
    '/2.0/warehouse/organization/sign-ups/timeline**',
    'fixture:/api/warehouse/getSignups'
  );
  cy.route(
    'GET',
    '/2.0/warehouse/demographics/age**',
    'fixture:/api/warehouse/demographicsAge'
  );
  cy.route(
    'GET',
    '/2.0/warehouse/provider/count**',
    'fixture:/api/warehouse/providerCount'
  );
  cy.route(
    'GET',
    '/2.0/warehouse/weight/change**',
    'fixture:/api/general/emptyDataEmptyPagination'
  );
  cy.route(
    'GET',
    '/2.0/warehouse/organization/sign-ups/timeline**',
    'fixture:/api/general/emptyDataEmptyPagination'
  );
  cy.route(
    'GET',
    '/2.0/warehouse/enrollment/simple**',
    'fixture:/api/general/emptyDataEmptyPagination'
  );
  cy.route(
    'GET',
    '/2.0/warehouse/enrollment/patient-count**',
    'fixture:/api/general/emptyDataEmptyPagination'
  );
  cy.route(
    'GET',
    '/1.0/warehouse/patient-listing**',
    'fixture:/api/warehouse/getPatientListing'
  );
  cy.route(
    'GET',
    '/2.0/warehouse/organization/activity**',
    'fixture:/api/general/emptyDataEmptyPagination'
  );
  cy.route('GET', '/2.0/warehouse/alert/type**', 'fixture:/api/alert/getTypes');
  cy.route(
    'GET',
    '/2.0/warehouse/alert/preference**',
    'fixture:/api/warehouse/alertPreference'
  );

  cy.route(
    'GET',
    '/1.0/content/form/submission?**',
    fetchOverride(
      '/1.0/content/form/submission?**',
      'fixture:/api/form/getListing'
    )
  );
  cy.route(
    'GET',
    '/1.0/content/form/submission/1',
    'fixture:/api/form/getForm1'
  );
  cy.route(
    'GET',
    '/1.0/content/form/submission/2',
    'fixture:/api/form/getForm2'
  );
  cy.route(
    'GET',
    '/1.0/content/form/submission/3',
    'fixture:/api/form/getForm3'
  );
  cy.route(
    'GET',
    '/1.0/content/form/15081?**',
    'fixture:/api/form/getStructure'
  );
  cy.route(
    'GET',
    '/2.0/account/*/external-identifier?account=**',
    'fixture:/api/general/emptyData'
  );
  cy.route({
    method: 'DELETE',
    url: '/1.0/content/form/submission/**',
    status: 204,
    response: {},
  }).as('formSubmissionDeleteRequest');

  cy.route('POST', '/1.0/content/form/submission', '{"id":"1"}').as(
    'formSubmit'
  );

  cy.route({
    method: 'POST',
    url: '/2.0/organization',
    status: 201,
    response: { id: '1' },
  }).as('organizationCreateRequest');

  cy.route({
    method: 'POST',
    url: '/1.0/account/activity/event',
    status: 201,
    response: {},
  }).as('accountActivityPostRequest');

  cy.route(
    'GET',
    '/1.0/rpm/state/deactivation-reason**',
    'fixture:/api/rpm/deactivationReasons'
  );

  cy.route({
    method: 'POST',
    url: '/2.0/rpm/state',
    status: 201,
    response: {},
  }).as('rpmStatePostRequest');

  cy.route({
    method: 'GET',
    url: '/1.0/rpm/individual-summary**',
    status: 200,
    response: {},
  }).as('rpmIndividualSummaryRequest');

  cy.route(
    'GET',
    '/1.0/rpm/state/audit**',
    'fixture:/api/rpm/rpmStateAuditEntries.json'
  );

  cy.route({
    method: 'POST',
    url: '/1.0/content/copy/**',
    status: 201,
    response: { id: '1' },
  }).as('contentCopyRequest');

  cy.route({
    method: 'GET',
    url: '/1.0/content/*',
    status: 200,
    response: { id: '1' },
  });

  cy.route({
    method: 'PATCH',
    url: '/1.0/content/*',
    status: 204,
    response: {},
  });

  cy.route({
    method: 'POST',
    url: '/1.0/sequence/enrollment/bulk',
    status: 204,
    response: {
      id: '1',
    },
  }).as('sequenceBulkEnrollmentPostRequest');

  cy.route({
    method: 'POST',
    url: '/1.0/sequence/enrollment/bulk/organization',
    status: 204,
    response: {
      id: '1',
    },
  }).as('sequenceBulkOrganizationEnrollmentPostRequest');

  cy.route({
    method: 'POST',
    url: '/2.0/package',
    status: 201,
    response: { id: '1' },
  }).as('packagePostRequest');

  cy.route({
    method: 'PATCH',
    url: '/2.0/package/organization/*',
    status: 204,
    response: {},
  }).as('packageOrganizationPatchRequest');
  cy.route(
    'GET',
    '/1.0/account/*/login-history?**',
    'fixture:/api/account/getLoginHistory.json'
  );
  cy.route({
    method: 'DELETE',
    url: '/1.0/package/enrollment/*',
    status: 204,
    response: {},
  });
  cy.route(
    'GET',
    'https://coachcare.zendesk.com/api/v2/help_center/en-us/categories/360002579931/articles.json?sort_by=created_at&sort_order=desc',
    'fixture:/api/zendesk/zendeskArticles'
  );

  cy.route(
    'GET',
    '/2.0/measurement/device/sync**',
    'fixture:/api/measurement/deviceSyncing'
  );

  cy.route(
    'GET',
    '/1.0/communication/interaction?**',
    'fixture:/api/interactions/getAll'
  );

  cy.route(
    'GET',
    '/1.0/communication/interaction/type**',
    'fixture:/api/interactions/getAllTypes'
  );

  cy.route({
    method: 'POST',
    url: '/1.0/communication/interaction/manual',
    status: 204,
    response: { id: '1' },
  }).as('manualInteractionPostRequest');

  cy.route(
    'GET',
    '/1.0/communication/interaction/self**',
    'fixture:/api/general/emptyDataEmptyPagination'
  );

  cy.route(
    'GET',
    '1.0/communication/interaction/billable-service**',
    'fixture:/api/interactions/getBillableServices'
  );
};

const seti18n = (): void => {
  cy.log('Loading i18n en file');

  cy.fixture('assets/i18n/en.json').as('i18n-en');
  cy.route('GET', '/assets/i18n/en.json', '@i18n-en');
};

export { ApiOverrideEntry, interceptCoreApiCalls, seti18n };
