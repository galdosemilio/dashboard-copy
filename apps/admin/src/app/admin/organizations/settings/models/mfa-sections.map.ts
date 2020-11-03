import { _ } from '@coachcare/backend/shared';

export interface MFASection {
  displayName: string;
  id: string;
  name: string;
}

export const MFA_SECTIONS: { [key: string]: MFASection } = {
  ['1']: {
    id: '1',
    name: 'Login',
    displayName: _('ADMIN.ORGS.SETTINGS.MFA_LOGIN')
  },
  ['2']: {
    id: '2',
    name: 'Password update',
    displayName: _('ADMIN.ORGS.SETTINGS.MFA_PASSWORD_UPDATE')
  }
};
