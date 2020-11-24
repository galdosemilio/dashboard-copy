import { _ } from '@coachcare/common/shared/utils'
import { SelectorOption } from '@coachcare/common/shared/interfaces'

export const PHONE_TYPES: Array<SelectorOption> = [
  {
    value: 'android',
    viewValue: _('SELECTOR.PHONE_TYPE.ANDROID')
  },
  {
    value: 'ios',
    viewValue: _('SELECTOR.PHONE_TYPE.IOS')
  }
]
