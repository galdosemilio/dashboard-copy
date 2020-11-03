import { APP_SEARCH_SOURCE } from '@coachcare/common/shared';

import {
  AccountsDatabase,
  AccountsDataSource,
  EmailTemplatesDatabase,
  LabelsDatabase,
  LabelsDataSource,
  OrganizationsDatabase,
  OrganizationsDataSource
} from '@coachcare/backend/data';

// Search Database Factories

export function AccountsSearchFactory(database: AccountsDatabase) {
  const source = new AccountsDataSource(database);
  source.startWithNull = false;
  source.addDefault({ includeInactive: true });
  return source;
}

export function OrganizationsSearchFactory(database: OrganizationsDatabase) {
  const source = new OrganizationsDataSource(database);
  source.startWithNull = false;
  source.addDefault({
    isAdmin: true,
    status: 'active' // TODO fix after inactive orgs are available
  });
  return source;
}

export function LabelsSearchFactory(database: LabelsDatabase) {
  const source = new LabelsDataSource(database);
  source.startWithNull = false;
  // source.addDefault({
  //   isActive: true
  // });
  return source;
}

// Module Collections

export const AdminProviders = [
  // accounts search
  AccountsDatabase,
  {
    provide: APP_SEARCH_SOURCE,
    useFactory: AccountsSearchFactory,
    deps: [AccountsDatabase],
    multi: true
  },
  // organizations search
  OrganizationsDatabase,
  {
    provide: APP_SEARCH_SOURCE,
    useFactory: OrganizationsSearchFactory,
    deps: [OrganizationsDatabase],
    multi: true
  },
  // labels search
  LabelsDatabase,
  {
    provide: APP_SEARCH_SOURCE,
    useFactory: LabelsSearchFactory,
    deps: [LabelsDatabase],
    multi: true
  },
  // emails search
  EmailTemplatesDatabase
];
