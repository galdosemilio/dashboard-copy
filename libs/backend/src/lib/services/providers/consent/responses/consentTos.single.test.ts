/**
 * GET /consent/tos/:id
 */

import { createTestFromValidator, createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { consentTosMeta } from '../../../shared/index.test';
import { ConsentTosSingle } from './consentTos.single';

export const consentTosSingle = createValidator({
  /** ID of the ToS version. */
  id: t.string,
  /** ToS metadata group object. */
  meta: consentTosMeta,
  /** ToS content. */
  content: t.string,
  /** String array of organizations. */
  organizations: t.array(t.string),
  /** Business-oriented version number of ToS. */
  version: t.number,
  /** Creation date of the ToS version. */
  createdAt: t.string
});

export const consentTosResponse = createTestFromValidator<ConsentTosSingle>(
  'ConsentTosSingle',
  consentTosSingle
);
