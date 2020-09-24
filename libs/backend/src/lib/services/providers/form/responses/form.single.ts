/**
 * GET /content/form/:id
 */

import { FormSectionRef, OrgRef } from '../../../shared';

export interface FormSingle {
  /** Form ID. */
  id: string;
  /** Form name. */
  name: string;
  /** Organization to which the form belongs. */
  organization: OrgRef;
  /** Maximum allowed submissions for a form. */
  maximumSubmissions?: number;
  /** A flag indicating if the form is active. */
  isActive: boolean;
  /** A flag indicating if the form allows adding addendums. */
  allowAddendum: boolean;
  /** Form sections. Only included if `full=true`. Inner collections, including this one, are already sorted by their sort order. */
  sections?: Array<FormSectionRef>;
}
