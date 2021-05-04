import { AccountSingle, AccountTypeId } from '@coachcare/sdk'

export interface AccountResolved {
  account?: AccountSingle
  accountType: AccountTypeId
}

export interface AccountParams extends AccountResolved {
  readonly?: boolean
}
