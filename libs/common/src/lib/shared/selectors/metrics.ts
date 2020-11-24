import { _ } from '@coachcare/common/shared/utils'
import { SelectorOption } from '@coachcare/common/shared/interfaces'

export const MEASUREMENT_UNITS: Array<SelectorOption> = [
  {
    value: 'metric',
    viewValue: _('SELECTOR.UNITSYS.METRIC')
  },
  {
    value: 'us',
    viewValue: _('SELECTOR.UNITSYS.US')
  },
  {
    value: 'uk',
    viewValue: _('SELECTOR.UNITSYS.UK')
  }
]
