import { ReportAccount, ReportOrganization } from '../../common/entities'

export interface SignupsListSegment {
  startDate: string
  length: number
  organization: ReportOrganization
  account: ReportAccount
  assignedProvider?: ReportAccount
}
