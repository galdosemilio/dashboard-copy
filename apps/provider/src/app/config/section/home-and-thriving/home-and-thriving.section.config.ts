import { DataPointTypes } from '@coachcare/sdk'
import { SectionConfigDetails } from '../models/section.details'

export const HomeAndThrivingSectionConfig: SectionConfigDetails = {
  CLINIC_LISTING: {
    SHOW_CLINIC_CREATE_BUTTON_DIRECT: true
  },
  JOURNAL: {
    HIDDEN_SETTINGS_TABS: [],
    ADDITIONAL_VITALS_COLUMNS: []
  },
  PATIENT_DASHBOARD: {
    ALLOWED_CHART_DATA_POINT_TYPES: [
      DataPointTypes.BMI,
      DataPointTypes.BODY_FAT_PERCENTAGE,
      DataPointTypes.BLOOD_OXYGEN_LEVEL,
      DataPointTypes.BLOOD_PRESSURE_SYSTOLIC,
      DataPointTypes.BLOOD_PRESSURE_DIASTOLIC,
      DataPointTypes.HEART_RATE,
      DataPointTypes.HEART_RATE_VARIABILITY,
      DataPointTypes.RESPIRATION_RATE,
      DataPointTypes.SLEEP,
      DataPointTypes.STEPS,
      DataPointTypes.TEMPERATURE,
      DataPointTypes.WATER_PERCENTAGE,
      DataPointTypes.WEIGHT
    ]
  }
}
