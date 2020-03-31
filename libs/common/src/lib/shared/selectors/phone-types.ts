import { _, SelectorOption } from '@coachcare/backend/shared';

export const PHONE_TYPES: Array<SelectorOption> = [
  {
    value: 'android',
    viewValue: _('SELECTOR.PHONE_TYPE.ANDROID')
  },
  {
    value: 'ios',
    viewValue: _('SELECTOR.PHONE_TYPE.IOS')
  }
];
