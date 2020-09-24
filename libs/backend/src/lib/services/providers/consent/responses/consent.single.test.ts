/**
 * GET /consent/:id
 */

import { createTestFromValidator, createValidator, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { ConsentSingle } from './consent.single';

export const consentSingle = createValidator({
  consent: createValidator({
    /** ID of the ToS version the action was taken upon. */
    tosVersionId: t.string,
    /** Action taken. */
    action: t.string,
    /** Organization for which the action was taken. Can be null for personal account consents. */
    organization: optional(t.string),
    /** Creation date of the consent. */
    timestamp: t.string
  }),
  consents: createValidator({
    /** Account which has actually submitted the consent. */
    createdBy: t.string
  })
});

export const consentResponse = createTestFromValidator<ConsentSingle>(
  'ConsentSingle',
  consentSingle
);
