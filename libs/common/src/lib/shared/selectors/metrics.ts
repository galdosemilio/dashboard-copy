import { _, SelectorOption } from '@coachcare/backend/shared'

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
