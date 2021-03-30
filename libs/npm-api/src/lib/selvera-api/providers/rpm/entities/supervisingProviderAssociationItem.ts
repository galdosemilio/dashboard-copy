import { AccountRef } from '../../account/entities'
import { NamedEntity } from '../../common/entities'

export interface SupervisingProviderAssociationItem {
  id: string
  account: AccountRef
  organization: NamedEntity
}
