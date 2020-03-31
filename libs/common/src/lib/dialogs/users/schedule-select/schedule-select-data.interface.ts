import { AccountAccessData } from '@coachcare/backend/services';

/**
 * ScheduleSelectDialog Data Interface
 */
export interface ScheduleSelectData {
  user: AccountAccessData;
  title: string;
  button: string;
  onlyProviders?: boolean;
}
