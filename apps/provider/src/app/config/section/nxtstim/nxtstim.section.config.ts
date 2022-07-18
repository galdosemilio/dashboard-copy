import { MeasurementTabs, SidenavOptions } from '../consts'
import { SectionConfigDetails } from '../models/section.details'
import { _ } from '@app/shared/utils'

export const NXTSTIMSectionConfig: SectionConfigDetails = {
  JOURNAL: {
    HIDDEN_MEASUREMENT_TABS: [MeasurementTabs.FOOD]
  },
  SIDENAV: {
    HIDDEN_OPTIONS: [SidenavOptions.REPORT_CUSTOM, SidenavOptions.STORE]
  },
  RPM: {
    AVAILABLE_DEVICES: [
      {
        id: '5',
        name: 'NXTSTIM EcoAI',
        displayName: _('RPM.NXTSTIM_ECOAI'),
        imageSrc: 'assets/img/ecoai.png',
        sortOrder: 5
      }
    ]
  }
}
