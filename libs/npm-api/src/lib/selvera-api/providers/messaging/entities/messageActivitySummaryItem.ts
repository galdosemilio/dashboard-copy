import { Entity } from '../../common/entities'
import { OrganizationEntity } from '../../organization/entities'

interface MessageActivitySummaryItemTimeData {
  timestamp: string
  date: string
  time: string
}

export interface MessageActivitySummaryItem {
  account: { id: string; type: string }
  createdAt: {
    timezone: string
    utc: MessageActivitySummaryItemTimeData
    local: MessageActivitySummaryItemTimeData
  }
  id: string
  organization: OrganizationEntity
  role: string
  thread: Entity
}
