/**
 * App Configuration.
 */

import { appLocales } from '@app/shared/utils/i18n.config';
import { CCRApp } from './config.interface';

function getProfileRoute(account: { id: any; accountType: any }): string {
  const accountType =
    typeof account.accountType === 'object'
      ? account.accountType.id
      : account.accountType;

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
  }

  return `/accounts/${role}/${account.id}`;
}

export const AppConfig: CCRApp = {
  accountType: {
    profileRoute: getProfileRoute
  },
  default: {
    startTime: {
      hours: 8,
      minutes: 0,
      seconds: 0
    },
    noteMinDate: { month: 1 },
    noteMaxLength: 100
  },
  durations: {
    notifier: 4500
  },
  lang: {
    default: 'en',
    supported: Object.keys(appLocales).map((locale: string) => locale.toLowerCase())
  },
  limit: {
    notifications: 12,
    reminders: 3,
    threads: 20
  },
  moment: {
    thresholds: {
      m: 57,
      h: 24,
      d: 28,
      M: 12
    }
  },
  refresh: {
    chat: {
      newMessages: 5000,
      updateThread: 30000,
      updateTimestamps: 20000
    }
  },
  screen: {
    xs: 600,
    sm: 780,
    md: 992,
    lg: 1200
  }
};
