import { _ } from '@app/shared/utils'
import { SectionConfigDetails } from '../models/section.details'

export const ConciSectionConfig: SectionConfigDetails = {
  PATIENT_DASHBOARD: {
    PATIENT_PROFILE_LINKS: [
      {
        title: _('GLOBAL.FILE_VAULT'),
        link: 'settings',
        params: {
          s: 'file-vault'
        }
      },
      {
        title: _('GLOBAL.DIAGNOSIS_FORM'),
        link: 'settings',
        params: {
          s: 'forms',
          formId: '1915'
        }
      }
    ]
  }
}
