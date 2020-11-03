import { STORAGE_FIRST_TIME_GUIDE, STORAGE_RPM_GUIDE } from '@app/config';
import { _ } from '@app/shared/utils';

interface WalkthroughGuideItem {
  title: string;
  urls: { [key: string]: string };
  storageItem?: string;
}

export const WALKTHROUGHS: { [key: string]: WalkthroughGuideItem } = {
  dashboard: {
    title: _('WALKTHROUGH.STARTER_GUIDE'),
    urls: {
      en: 'https://coachcare.nickelled.com/set-up-coach-account---basics'
    },
    storageItem: STORAGE_FIRST_TIME_GUIDE
  },
  rpm: {
    title: _('SIDENAV.RPM'),
    urls: {
      en: 'https://coachcare.nickelled.com/remote-patient-monitoring-onboarding'
    },
    storageItem: STORAGE_RPM_GUIDE
  }
};
