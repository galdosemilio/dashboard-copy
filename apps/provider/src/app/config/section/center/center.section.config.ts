import { AccountIdentifiersComponent } from '@app/dashboard/accounts/dieters/form/account-identifiers/account-identifiers.component'
import { AccountIdentifiersProps } from '@app/shared/model/accountIdentifiers/account-identifiers.props'
import { SidenavOptions } from '../consts'
import { SectionConfigDetails } from '../models/section.details'

export const CenterForMedicalWeightLossProdSectionConfig: SectionConfigDetails =
  {
    PATIENT_FORM: {
      ACCOUNT_IDENTIFIERS_INPUT: {
        component: AccountIdentifiersComponent,
        props: AccountIdentifiersProps,
        values: {
          identifiers: [
            {
              name: 'cmwl_id',
              displayName: 'CMWL ID',
              required: false
            }
          ]
        }
      }
    },
    RIGHT_PANEL: {
      SHOW_REMINDERS: false
    },
    SIDENAV: {
      HIDDEN_OPTIONS: [
        SidenavOptions.ACCOUNTS_COACHES,
        SidenavOptions.REPORT_OVERVIEW,
        SidenavOptions.REPORT_STATISTICS,
        SidenavOptions.STORE_COACHCARE,
        SidenavOptions.REPORT_CUSTOM
      ],
      SHOWN_OPTIONS: [SidenavOptions.ACCOUNTS_COACHES]
    }
  }

export const CenterForMedicalWeightLossTestSectionConfig: SectionConfigDetails =
  {
    PATIENT_FORM: {
      ACCOUNT_IDENTIFIERS_INPUT: {
        component: AccountIdentifiersComponent,
        props: AccountIdentifiersProps,
        values: {
          identifiers: [
            {
              name: 'cmwl_id',
              displayName: 'CMWL ID',
              required: false
            }
          ]
        }
      }
    },
    RIGHT_PANEL: {
      SHOW_REMINDERS: false
    },
    SIDENAV: {
      HIDDEN_OPTIONS: [
        SidenavOptions.ACCOUNTS_COACHES,
        SidenavOptions.REPORT_OVERVIEW,
        SidenavOptions.REPORT_STATISTICS,
        SidenavOptions.STORE_COACHCARE,
        SidenavOptions.REPORT_CUSTOM
      ],
      SHOWN_OPTIONS: [SidenavOptions.ACCOUNTS_COACHES]
    }
  }
