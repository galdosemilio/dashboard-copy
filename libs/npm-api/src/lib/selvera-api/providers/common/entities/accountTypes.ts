import { AccountTypeId, AccountTypeTitle } from '../../account/entities'

interface AccountTypeInfo {
  displayName?: string
  id: AccountTypeId
  title: AccountTypeTitle
}

export const AccountTypes: { [key: string]: AccountTypeInfo } = {
  admin: {
    displayName: 'Admin',
    id: AccountTypeId.Admin,
    title: 'Admin'
  },
  provider: {
    displayName: 'Provider',
    id: AccountTypeId.Provider,
    title: 'Provider'
  },
  client: {
    displayName: 'Client',
    id: AccountTypeId.Client,
    title: 'Client'
  },
  manager: {
    displayName: 'Manager',
    id: AccountTypeId.Manager,
    title: 'Manager'
  }
}
