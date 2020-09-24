/**
 * AlertItem
 */

import { AccountBasicRef } from '../generic';
import { OrgEntity } from './orgEntity';

export interface AlertItem {
  /** ID of the notification. */
  id: string;
  /** Creation timestamp. */
  createdAt: string;
  /** Type of the notification. */
  type: {
    /** ID of the notification type. */
    id: string;
    /** Code of the notification type. */
    code: string;
    /** Description of the notification type. */
    description: string;
  };
  /** Recipient of the notification. */
  recipient: AccountBasicRef;
  /** Organization data associated with the recipient. */
  organization: OrgEntity;
  /** Account data of person who triggered the alert. */
  triggeredBy?: AccountBasicRef;
  /** A flag indicating whether a person with specified account viewed the notification. */
  viewed: boolean;
  /** Notification-specific payload. */
  payload?: any;
  /** Notification group ID. */
  groupId?: string;
}
