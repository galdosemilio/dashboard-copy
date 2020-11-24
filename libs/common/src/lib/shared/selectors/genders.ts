import { _ } from '@coachcare/common/shared/utils'
import { SelectorOption } from '@coachcare/common/shared/interfaces'

export const GENDERS: Array<SelectorOption> = [
  {
    value: 'male',
    viewValue: _('SELECTOR.GENDER.MALE')
  },
  {
    value: 'female',
    viewValue: _('SELECTOR.GENDER.FEMALE')
  }
]
