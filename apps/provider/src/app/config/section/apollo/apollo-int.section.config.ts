import { AccountIdentifiersComponent } from '@app/dashboard/accounts/dieters/form/account-identifiers/account-identifiers.component'
import { AccountIdentifiersProps } from '@app/dashboard/accounts/dieters/form/account-identifiers/models'
import { _ } from '@app/shared/utils'
import { SectionConfigDetails } from '../models/section.details'

export const ApolloInternationalSectionConfig: SectionConfigDetails = {
  PATIENT_FORM: {
    SHOW_ACC_IDN_INPUT_CREATE: true,
    ACCOUNT_IDENTIFIERS_INPUT: {
      component: AccountIdentifiersComponent,
      props: AccountIdentifiersProps,
      values: {
        identifiers: [
          {
            name: 'codice_fiscale',
            displayName: 'Codice Fiscale',
            required: false,
            localeLock: ['it']
          }
        ]
      }
    }
  }
}