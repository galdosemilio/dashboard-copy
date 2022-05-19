import { AlertsDatabase } from '@app/dashboard'
import { ConsultationsDataService } from './consultations-data.service'
import { NotificationsDataService } from './notifications-data.service'
import {
  PhaseEnrollmentDatabase,
  PhaseEnrollmentDataSource
} from './phase-enrollment'

export {
  ConsultationsDataService,
  NotificationsDataService,
  PhaseEnrollmentDatabase,
  PhaseEnrollmentDataSource
}

export const RightPanelServices = [
  AlertsDatabase,
  ConsultationsDataService,
  NotificationsDataService,
  PhaseEnrollmentDatabase
]
