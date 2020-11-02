/**
 * FormRefNamed
 */

import { FormRef } from './formRef';

export interface FormRefNamed extends FormRef {
    /** Form name. */
    name: string;
}
