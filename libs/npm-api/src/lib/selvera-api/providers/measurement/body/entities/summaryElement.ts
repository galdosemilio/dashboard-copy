/**
 * SummaryElement
 */

import { SummaryChange } from './summaryChange';
import { SummaryRecord } from './summaryRecord';

export interface SummaryElement {
    /** Key property record data. */
    record: SummaryRecord;
    /** Change value. */
    change: SummaryChange;
}
