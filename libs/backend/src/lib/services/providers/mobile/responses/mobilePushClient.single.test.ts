/**
 * GET /notification/mobile-push/client/:id
 */

import { createTestFromValidator, createValidator, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { MobilePushClientSingle } from './mobilePushClient.single';

export const mobilePushClientSingle = createValidator({
  /** The client ID. */
  id: t.string,
  /** The account ID. */
  account: t.string,
  /** Organization to which the client is associated. */
  organization: t.string,
  /** The Google project-id associated with the app. */
  projectId: t.string,
  /** The device token. */
  token: t.string,
  /** The user agent passed in by the client. */
  userAgent: optional(t.string)
});

export const mobilePushClientResponse = createTestFromValidator<MobilePushClientSingle>(
  'MobilePushClientSingle',
  mobilePushClientSingle
);
