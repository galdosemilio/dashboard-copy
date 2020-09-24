/**
 * GET /note/general/:id
 */

import { createTestFromValidator, createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { NoteGeneralSingle } from './noteGeneral.single';

export const noteGeneralSingle = createValidator({
  /** The ID of the note. */
  noteId: t.string,
  /** Content of the note. */
  content: t.string,
  /** Note creator. */
  createdBy: t.string,
  /** Whether is visible only for providers or not. */
  providerOnly: t.boolean,
  /** Creation timestamp. */
  createdAt: t.string,
  /** Update timestamp. */
  updatedAt: t.string,
  /** Note date. */
  date: t.string,
  /** Related accounts. */
  relatedAccounts: t.array(t.string)
});

export const noteGeneralResponse = createTestFromValidator<NoteGeneralSingle>(
  'NoteGeneralSingle',
  noteGeneralSingle
);
