import { NamedEntity } from '../../common/entities'

export interface ActiveCampaignListAssociationItem {
  createdAt: string
  id: string
  isActive: boolean
  list: NamedEntity
  organization: {
    id: string
    name: string
    hierarchyPath: string[]
  }
}
