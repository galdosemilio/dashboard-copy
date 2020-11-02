/**
 * GET /content/form/:id
 */

import { OrgRef } from '../../organization/entities';
import { FormSectionRef } from '../entities';

export interface FormSingle {
    /** Form ID. */
    id: string;
    /** Form name. */
    name: string;
    /** Organization for which the form was created. */
    organization: OrgRef;
    /** Maximum allowed submissions for a form. */
    maximumSubmissions?: number;
    /** A flag indicating if the form is active. */
    isActive: boolean;
    /** A flag indicating if the form allows adding addendums. */
    allowAddendum: boolean;
    /** A flag indicating if the form supports submission removal */
    removableSubmissions: boolean;
    /** Form sections. Only included if `full=true`. Inner collections, including this one, are already sorted by their sort order. */
    sections?: Array<FormSectionRef>;
}
