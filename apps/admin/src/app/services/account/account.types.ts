import { AccountSingle, AccountTypeId } from '@coachcare/backend/services';

export interface AccountResolved {
  account?: AccountSingle;
  accountType: AccountTypeId;
}

export interface AccountParams extends AccountResolved {
  readonly?: boolean;
}
