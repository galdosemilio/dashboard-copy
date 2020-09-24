/**
 * GET /conference/subaccount/:id
 */

import { createTestFromValidator, createValidator, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { entity } from '../../../shared/index.test';
import { ConferenceSubaccountSingle } from './conferenceSubaccount.single';

export const conferenceSubaccountSingle = createValidator({
  /** Subaccount ID. */
  id: t.string,
  /** Organization ref. */
  organization: entity,
  /** Subaccount creation timestamp. */
  createdAt: t.string,
  /** Subaccount latest modification timestamp. */
  updatedAt: optional(t.string),
  /** Activity flag. */
  isActive: t.boolean,
  /** A flag indicating if the subaccount has access keys set up for it. */
  hasKeys: t.boolean
});

export const conferenceSubaccountResponse = createTestFromValidator<ConferenceSubaccountSingle>(
  'ConferenceSubaccountSingle',
  conferenceSubaccountSingle
);
