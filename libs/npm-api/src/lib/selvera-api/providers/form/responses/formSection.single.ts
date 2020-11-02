/**
 * GET /content/form/section/:id
 */

import { FormRef } from '../entities';

export interface FormSectionSingle {
    /** The section ID. */
    id: string;
    /** Section title. */
    title: string;
    /** Additional description. */
    description?: string;
    /** Sort order of the section on the form. */
    sortOrder: number;
    /** A form for which the section belongs to. */
    form?: FormRef;
}
