import { MeasurementSummaryData } from '@app/service'
import { CompositionColumns, MeasurementTabs, SettingsTabs } from '../consts'

export interface JournalConfigDetails {
  ALLOW_MEASUREMENT_LIST_VIEW?: boolean
  HIDDEN_TABS?: string[]
  HIDDEN_MEASUREMENT_TABS?: MeasurementTabs[]
  HIDDEN_COMPOSITION_COLUMNS?: CompositionColumns[]
  HIDDEN_SETTINGS_TABS?: SettingsTabs[]
  ADDITIONAL_VITALS_COLUMNS?: MeasurementSummaryData[]
  PHYSICIAN_FORM?: string
  SHOW_DOCTOR_PDF_BUTTON?: boolean
  SHOW_PATIENT_PDF_BUTTON?: boolean
  SHOW_FOOD_MOOD_AND_NOTE?: boolean
}
