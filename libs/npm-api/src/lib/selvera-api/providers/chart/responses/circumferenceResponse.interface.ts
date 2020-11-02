/**
 * Interface for GET chart/circumference (response)
 */
import { CircumferenceSegment } from './circumferenceSegment.interface';

export interface CircumferenceResponse {
    data: Array<CircumferenceSegment>;
}
