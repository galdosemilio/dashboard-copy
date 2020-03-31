import { _, SelectorOption } from '@coachcare/backend/shared';

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
];
