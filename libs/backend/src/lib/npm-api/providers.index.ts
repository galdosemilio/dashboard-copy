import { ApiService, Account, Organization } from 'selvera-api';

export { Account, Organization } from 'selvera-api';

export const SelveraApiProviders = [
  {
    provide: Account,
    useClass: Account,
    deps: [ApiService]
  },
  {
    provide: Organization,
    useClass: Organization,
    deps: [ApiService]
  }
];
