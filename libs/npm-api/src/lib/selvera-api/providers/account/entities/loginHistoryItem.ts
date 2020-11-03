import { NamedEntity } from '../../common/entities'

export interface LoginHistoryItem {
  createdAt: string
  id: string
  ip?: string
  organization?: NamedEntity
}
