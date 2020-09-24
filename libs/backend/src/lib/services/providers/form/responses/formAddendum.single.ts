/**
 * GET /content/form/addendum/:id
 */

import { Entity, FormRefNamed, FormSubmissionRef } from '../../../shared';

export interface FormAddendumSingle {
  /** Addendum ID. */
  id: string;
  /** Form. */
  form: FormRefNamed;
  /** Submission. */
  submission: FormSubmissionRef;
  /** Account. */
  account: Entity;
  /** Addendum text content. */
  content: string;
  /** Timestamp indicating when the addendum was created. */
  createdAt: string;
}
