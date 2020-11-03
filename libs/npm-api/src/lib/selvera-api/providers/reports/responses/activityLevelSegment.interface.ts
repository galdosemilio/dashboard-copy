import { ReportAccount, ReportOrganization } from '../../common/entities'
import { Steps } from '../entities'

export interface ActivityLevelSegment {
  account: ReportAccount
  organization: ReportOrganization
  steps: Steps
  level: { name: string }
  assignedProvider?: ReportAccount
}
