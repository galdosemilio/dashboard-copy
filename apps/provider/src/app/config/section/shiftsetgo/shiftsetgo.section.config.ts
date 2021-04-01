import { CompositionColumns } from '../consts'
import { SectionConfigDetails } from '../models/section.details'

export const ShiftSetGoSectionConfig: SectionConfigDetails = {
  CLINIC_LISTING: {
    SHOW_CLINIC_CREATE_BUTTON_DIRECT: true
  },
  JOURNAL: {
    ALLOW_MEASUREMENT_LIST_VIEW: true,
    HIDDEN_COMPOSITION_COLUMNS: [
      CompositionColumns.EXTRACELLULAR_WATER,
      CompositionColumns.KETONES,
      CompositionColumns.TOTAL_BODY_WATER,
      CompositionColumns.VISCERALFATPERCENTAGE
    ],
    SHOW_DOCTOR_PDF_BUTTON: true,
    SHOW_PATIENT_PDF_BUTTON: true
  },
  RIGHT_PANEL: {
    SHOW_DAYSHEET_BUTTON: true
  }
}
