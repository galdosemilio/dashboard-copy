import { PackageSelectorProps } from '@app/shared/components/package-selector/models'
import { PackageSelectorComponent } from '@app/shared/components/package-selector/package-selector.component'
import { _ } from '@app/shared/utils'
import { SectionConfigDetails } from '../models/section.details'

export const ApolloUSProdSectionConfig: SectionConfigDetails = {
  PATIENT_FORM: {
    PACKAGE_ENROLL: null,
    PACKAGE_ENROLL_GRID: {
      component: PackageSelectorComponent,
      props: PackageSelectorProps,
      values: {
        forcePackageSelection: false,
        forcePackageChoiceId: '297',
        packages: [
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
        ]
      }
    },
    SHOW_ACC_IDN_INPUT_CREATE: true
  }
}
