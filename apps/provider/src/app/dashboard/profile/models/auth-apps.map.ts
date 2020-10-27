import { _ } from '@app/shared';

export interface AuthenticatorApp {
  appStore: string;
  displayName: string;
  name: string;
  playStore: string;
}

export const AuthenticatorApps: { [key: string]: AuthenticatorApp } = {
  ['google_authenticator']: {
    appStore: 'https://apps.apple.com/ky/app/google-authenticator/id388497605',
    displayName: _('PROFILE.MFA.GOOGLE_AUTHENTICATOR'),
    name: 'Google Authenticator',
    playStore:
      'https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en_US)'
  },
  ['lastpass_authenticator']: {
    appStore: 'https://apps.apple.com/us/app/lastpass-authenticator/id1079110004',
    displayName: _('PROFILE.MFA.LAST_PASS_AUTHENTICATOR'),
    name: 'LastPass Authenticator',
    playStore: 'https://play.google.com/store/apps/details?id=com.lastpass.authenticator'
  },
  ['microsoft_authenticator']: {
    appStore: 'https://apps.apple.com/app/microsoft-authenticator/id983156458',
    displayName: _('PROFILE.MFA.MICROSOFT_AUTHENTICATOR'),
    name: 'Microsoft Authenticator',
    playStore: 'https://play.google.com/store/apps/details?id=com.azure.authenticator'
  }
};
