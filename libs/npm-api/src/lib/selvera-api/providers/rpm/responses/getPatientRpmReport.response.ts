import { NamedEntity } from '../../common/entities'
import { ActiveRPMItem, InactiveRPMItem } from '../../reports/responses'
import {
  PatientRPMReportActivityItem,
  PatientRPMReportDataItem
} from '../entities'

export interface GetPatientRPMReportResponse {
  activity: PatientRPMReportActivityItem[]
  carePlan: (ActiveRPMItem | InactiveRPMItem) & {
    createdAt: string
    organization: NamedEntity
    type: string
  }
  data: PatientRPMReportDataItem[]
  profile: {
    dateOfBirth: string
    firstName: string
    lastName: string
  }
}
