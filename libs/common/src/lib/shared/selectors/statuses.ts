import { _ } from '@coachcare/common/shared/utils'
import { SelectorOption } from '@coachcare/common/shared/interfaces'

export const STATUSES: Array<SelectorOption> = [
  {
    value: 'all',
    viewValue: _('SELECTOR.STATUS.ALL')
  },
  {
    value: 'active',
    viewValue: _('SELECTOR.STATUS.ACTIVE')
  },
  {
    value: 'inactive',
    viewValue: _('SELECTOR.STATUS.INACTIVE')
  }
]
