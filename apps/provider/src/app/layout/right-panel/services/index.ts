import { AlertsDatabase } from '@app/dashboard'
import { ConsultationsDataService } from './consultations-data.service'
import { MeasurementsDataService } from './measurements-data.service'
import { NotificationsDataService } from './notifications-data.service'
import {
  PhaseEnrollmentDatabase,
  PhaseEnrollmentDataSource
} from './phase-enrollment'

export {
  ConsultationsDataService,
  MeasurementsDataService,
  NotificationsDataService,
  PhaseEnrollmentDatabase,
  PhaseEnrollmentDataSource
}

export const RightPanelServices = [
  AlertsDatabase,
  ConsultationsDataService,
  MeasurementsDataService,
  NotificationsDataService,
  PhaseEnrollmentDatabase
]
