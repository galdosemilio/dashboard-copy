/**
 * alertItem
 */

import { createValidator, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { accountBasicRef } from '../generic/index.test';
import { orgEntity } from './orgEntity.test';

export const alertItem = createValidator({
  /** ID of the notification. */
  id: t.string,
  /** Creation timestamp. */
  createdAt: t.string,
  /** Type of the notification. */
  type: createValidator({
    /** ID of the notification type. */
    id: t.string,
    /** Code of the notification type. */
    code: t.string,
    /** Description of the notification type. */
    description: t.string
  }),
  /** Recipient of the notification. */
  recipient: accountBasicRef,
  /** Organization data associated with the recipient. */
  organization: orgEntity,
  /** Account data of person who triggered the alert. */
  triggeredBy: optional(accountBasicRef),
  /** A flag indicating whether a person with specified account viewed the notification. */
  viewed: t.boolean,
  /** Notification-specific payload. */
  payload: optional(t.any),
  /** Notification group ID. */
  groupId: optional(t.string)
});
