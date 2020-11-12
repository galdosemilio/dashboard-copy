import { _ } from '@app/shared/utils'

export interface BillableService {
  id: string
  displayName: string
  name: string
}

export const BILLABLE_SERVICES: { [key: string]: BillableService } = {
  none: {
    id: '-1',
    displayName: _('CALL.BILLABLE_SERVICES.NONE'),
    name: 'None'
  },
  rpm: {
    id: '1',
    displayName: _('CALL.BILLABLE_SERVICES.RPM'),
    name: 'RPM'
  },
  telehealth: {
    id: '2',
    displayName: _('CALL.BILLABLE_SERVICES.TELEHEALTH'),
    name: 'Telehealth'
  }
}
