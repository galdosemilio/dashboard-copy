import { AccountSingle, AccountTypeId } from '@coachcare/npm-api'

export interface AccountResolved {
  account?: AccountSingle
  accountType: AccountTypeId
}

export interface AccountParams extends AccountResolved {
  readonly?: boolean
}
