import { _ } from '@app/shared/utils';

export interface EndingAction {
  displayName: string;
  id: string;
  name: string;
}

export const EndingActions: { [key: string]: EndingAction } = {
  ['no-action']: {
    displayName: _('SEQUENCING.END_ACTION_NONE'),
    id: '1',
    name: 'no action'
  },
  ['repeat']: {
    displayName: _('SEQUENCING.END_ACTION_REPEAT'),
    id: '2',
    name: 'repeat'
  }
};
