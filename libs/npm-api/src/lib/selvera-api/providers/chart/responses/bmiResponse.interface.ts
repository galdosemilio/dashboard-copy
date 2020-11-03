/**
 * Interface for GET chart/bmi (response)
 */

import { BmiDataSegment } from './bmiDataSegment.interface';
import { BmiSummarySegment } from './bmiSummaryResponse.interface';

export interface BmiResponse {
    data: Array<BmiDataSegment>;
    summary: BmiSummarySegment;
}
