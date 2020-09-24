/**
 * GET /notification/mobile-push/client
 */

import { createValidator, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';

export const getAllMobilePushClientResponse = t.array(
  createValidator({
    /** The client ID. */
    id: t.string,
    /** Organization to which the client is associated. */
    organization: t.string,
    /** The account ID. */
    account: t.string,
    /** The Google project-id associated with the app if admin. */
    projectId: optional(t.string),
    /** The device token if admin. */
    token: optional(t.string),
    /** The user-agent passed in if exists and is admin. */
    userAgent: optional(t.string)
  })
);
