/**
 * Interface for GET chart/weight (response)
 */

import { SummarySegment } from './summarySegment.interface';
import { WeightDataSegment } from './weightDataSegment.interface';

export interface WeightResponse {
    data: Array<WeightDataSegment>;
    summary: SummarySegment;
}
