/**
 * GET /note/consultation
 */

import { createTest, createValidator, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { pagination } from '../../../shared/index.test';
import { GetAllNoteConsultationResponse } from './getAllNoteConsultation.response';

export const getAllNoteConsultationResponse = createTest<GetAllNoteConsultationResponse>(
  'GetAllNoteConsultationResponse',
  {
    data: createValidator({
      /** The id of the note's creator. */
      createdBy: t.string,
      /** Is the note provider only?. */
      providerOnly: t.boolean,
      /** The time the note was created in ISO8601 format. */
      createdAt: t.string,
      /** The time the note was updated in ISO8601 format. */
      updatedAt: t.string,
      /** The date of the note in 'YYYY-MM-DD' format. */
      date: t.string,
      /** The relatedAccounts for the note, only if the requester is a provider. */
      relatedAccounts: optional(t.array(t.string))
    }),
    /** Pagination object. */
    pagination: pagination
  }
);
