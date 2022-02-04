import { RobardHeaderComponent } from '@board/pages/register/clinic/header/robard/robard.header.component'
import { _ } from '@coachcare/common/shared/utils'
import { SectionConfigDetails } from './section.config'

export const RobardTestSectionConfig: SectionConfigDetails = {
  REGISTER: {
    HEADER: RobardHeaderComponent,
    MOB_APP_TYPE: [
      {
        description: _('REGISTER.STEP1.ROBARD.MOB_APP_1_DESCRIPTION'),
        displayValue: _('REGISTER.STEP1.ROBARD.MOB_APP_1_TITLE'),
        iosAppLink: 'https://itunes.apple.com/us/app/coachcare/id1421821437',
        androidAppLink:
          'https://play.google.com/store/apps/details?id=com.coachcare.robardionic',
        value: '7387'
      },
      {
        description: _('REGISTER.STEP1.ROBARD.MOB_APP_2_DESCRIPTION'),
        displayValue: _('REGISTER.STEP1.ROBARD.MOB_APP_2_TITLE'),
        subtext: _('REGISTER.STEP1.ROBARD.MOB_APP_2_SMALLTEXT'),
        value: '7386'
      }
    ],
    SHOW_REGISTER_ICON: true
  }
}

export const RobardProdSectionConfig: SectionConfigDetails = {
  REGISTER: {
    HEADER: RobardHeaderComponent,
    MOB_APP_TYPE: [
      {
        description: _('REGISTER.STEP1.ROBARD.MOB_APP_1_DESCRIPTION'),
        displayValue: _('REGISTER.STEP1.ROBARD.MOB_APP_1_TITLE'),
        iosAppLink: 'https://itunes.apple.com/us/app/coachcare/id1421821437',
        androidAppLink:
          'https://play.google.com/store/apps/details?id=com.coachcare.robardionic',
        value: '6508'
      },
      {
        description: _('REGISTER.STEP1.ROBARD.MOB_APP_2_DESCRIPTION'),
        displayValue: _('REGISTER.STEP1.ROBARD.MOB_APP_2_TITLE'),
        subtext: _('REGISTER.STEP1.ROBARD.MOB_APP_2_SMALLTEXT'),
        value: '6510'
      }
    ],
    SHOW_REGISTER_ICON: true
  }
}
