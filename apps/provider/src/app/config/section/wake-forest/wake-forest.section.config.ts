import { SectionConfigDetails } from '../models/section.details'
import { _ } from '@app/shared/utils'
import { RPM_DEVICES } from '@app/dashboard/reports/rpm/models'

export const WakeForestSectionConfig: SectionConfigDetails = {
  RPM: {
    AVAILABLE_DEVICES: [
      ...RPM_DEVICES,
      {
        id: '6',
        name: 'Activity Tracker',
        displayName: _('RPM.ACTIVITY_TRACKER'),
        imageSrc: 'assets/img/activity-tracker.png',
        sortOrder: 6
      }
    ]
  }
}
