/**
 * Interface for GET chart/leanMass (response)
 */

import { DataSegment } from './dataSegment.interface';
import { SummarySegment } from './summarySegment.interface';

export interface LeanMassResponse {
    data: Array<DataSegment>;
    summary: SummarySegment;
}
