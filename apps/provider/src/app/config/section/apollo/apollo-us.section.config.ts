import { AccountIdentifiersComponent } from '@app/dashboard/accounts/dieters/form/account-identifiers/account-identifiers.component'
import { AccountIdentifiersProps } from '@app/dashboard/accounts/dieters/form/account-identifiers/models'
import { PackageSelectorProps } from '@app/shared/components/package-selector/models'
import { PackageSelectorComponent } from '@app/shared/components/package-selector/package-selector.component'
import { _ } from '@app/shared/utils'
import { SectionConfigDetails } from '../models/section.details'

export const ApolloUSProdSectionConfig: SectionConfigDetails = {
  PATIENT_FORM: {
    ACCOUNT_IDENTIFIERS_INPUT: {
      component: AccountIdentifiersComponent,
      props: AccountIdentifiersProps,
      values: {
        identifiers: [
          {
            name: 'po_number',
            displayName: _('SECTION.APOLLO_US.ACCOUNT_IDENTIFIERS.PO_NUMBER'),
            required: true
          }
        ]
      }
    },
    PACKAGE_ENROLL: null,
    PACKAGE_ENROLL_GRID: {
      component: PackageSelectorComponent,
      props: PackageSelectorProps,
      values: {
        forcePackageSelection: true,
        packages: [
          {
            name: _('SECTION.APOLLO_US.PACKAGE_SELECT.COACH_PLUS'),
            value: '296',
            image: '../../../assets/package-a.png',
            contents: [
              _('SECTION.APOLLO_US.PACKAGE_SELECT.MOBILE_APP'),
              _('SECTION.APOLLO_US.PACKAGE_SELECT.BODY_COMPOSITION_SCALE')
            ]
          },
          {
            name: _('SECTION.APOLLO_US.PACKAGE_SELECT.COACH_PLUS_SERVICE'),
            value: '297',
            image: '../../../assets/package-b.png',
            contents: [
              _('SECTION.APOLLO_US.PACKAGE_SELECT.MOBILE_APP'),
              _('SECTION.APOLLO_US.PACKAGE_SELECT.BODY_COMPOSITION_SCALE'),
              _('SECTION.APOLLO_US.PACKAGE_SELECT.APOLLO_COACHING_SERVICES')
            ]
          }
        ],
        trackerPackage: {
          value: '298'
        }
      }
    },
    SHOW_ACC_IDN_INPUT_CREATE: true
  }
}

export const ApolloUSTestSectionConfig: SectionConfigDetails = {
  PATIENT_FORM: {
    ACCOUNT_IDENTIFIERS_INPUT: {
      component: AccountIdentifiersComponent,
      props: AccountIdentifiersProps,
      values: {
        identifiers: [
          {
            name: 'po_number',
            displayName: _('SECTION.APOLLO_US.ACCOUNT_IDENTIFIERS.PO_NUMBER'),
            required: true
          },
          {
            name: 'abc',
            displayName: "Test Identifier (Won't reach prod, don't worry)",
            required: false
          }
        ]
      }
    },
    PACKAGE_ENROLL: null,
    PACKAGE_ENROLL_GRID: {
      component: PackageSelectorComponent,
      props: PackageSelectorProps,
      values: {
        forcePackageSelection: true,
        packages: [
          {
            name: _('SECTION.APOLLO_US.PACKAGE_SELECT.COACH_PLUS'),
            value: '680',
            image: '../../../assets/package-a.png',
            contents: [
              _('SECTION.APOLLO_US.PACKAGE_SELECT.MOBILE_APP'),
              _('SECTION.APOLLO_US.PACKAGE_SELECT.BODY_COMPOSITION_SCALE')
            ]
          },
          {
            name: _('SECTION.APOLLO_US.PACKAGE_SELECT.COACH_PLUS_SERVICE'),
            value: '681',
            image: '../../../assets/package-b.png',
            contents: [
              _('SECTION.APOLLO_US.PACKAGE_SELECT.MOBILE_APP'),
              _('SECTION.APOLLO_US.PACKAGE_SELECT.BODY_COMPOSITION_SCALE'),
              _('SECTION.APOLLO_US.PACKAGE_SELECT.APOLLO_COACHING_SERVICES')
            ]
          }
        ],
        trackerPackage: {
          value: '682'
        }
      }
    },
    SHOW_ACC_IDN_INPUT_CREATE: true
  }
}
