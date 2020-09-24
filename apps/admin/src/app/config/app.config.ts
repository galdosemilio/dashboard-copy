/**
 * App Settings
 */
import { AppSettings } from '@coachcare/common/shared';

export function getRole(accountType: any): string {
  let role = '';
  switch (accountType.toString()) {
    case '1':
    case 'admin':
      role = 'admin';
      break;

    case '2':
    case 'provider':
      role = 'coaches';
      break;

    case '3':
    case 'client':
      role = 'patients';
      break;
    default:
  }
  return role;
}

export function getRoute(account: { id: any; accountType: any }): string {
  const role = getRole(account.accountType);
  return `/accounts/${role}/${account.id}`;
}

export const appSettings: AppSettings = {
  account: {
    profile: getRoute,
    role: getRole
  },
  durations: {
    notifier: 4500
  },
  lang: {
    default: 'en',
    supported: ['en', 'es']
  },
  layout: {
    footer: {
      clinic: 'Library Demo',
      company: 'CoachCare'
    }
  },
  screen: {
    xs: 600,
    sm: 780,
    md: 992,
    lg: 1200
  }
};
