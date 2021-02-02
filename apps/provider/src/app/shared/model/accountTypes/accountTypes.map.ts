import { _ } from '@app/shared/utils'
import { AccountTypeId, AccountTypeTitle } from '@coachcare/npm-api'

interface AccountTypeInfo {
  displayName?: string
  id: AccountTypeId
  title: AccountTypeTitle
}

export const AccountTypes: { [key: string]: AccountTypeInfo } = {
  admin: {
    displayName: _('PERM.ADMIN'),
    id: AccountTypeId.Admin,
    title: 'Admin'
  },
  provider: {
    displayName: _('GLOBAL.COACH'),
    id: AccountTypeId.Provider,
    title: 'Provider'
  },
  client: {
    displayName: _('GLOBAL.PATIENT'),
    id: AccountTypeId.Client,
    title: 'Client'
  }
}
