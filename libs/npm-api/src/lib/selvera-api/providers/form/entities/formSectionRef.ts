/**
 * FormSectionRef
 */

import { FormQuestionData } from './formQuestionData';

export interface FormSectionRef {
    /** Section ID. */
    id: string;
    /** Section title. */
    title: string;
    /** Additional description. */
    description?: string;
    /** Sort order of the section on the form. */
    sortOrder: number;
    /** Form questions. */
    questions?: Array<FormQuestionData>;
}
