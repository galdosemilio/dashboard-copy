import { NamedEntity } from '../../common/entities/namedEntity'

export interface Section {
  accountType: NamedEntity
  section: NamedEntity
  isRequired: boolean
}
